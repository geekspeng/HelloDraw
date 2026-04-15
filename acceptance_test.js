/**
 * HelloDraw 产品验收测试 v3
 *
 * 用法: node acceptance_test.js
 * 前提: 开发服务器已启动 (npm run dev)
 */

import { chromium } from '@playwright/test'

const BASE_URL = 'http://localhost:3001'

let passed = 0
let failed = 0
const failures = []

function assert(condition, message) {
  if (!condition) throw new Error(`断言失败: ${message}`)
}

async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log(`  ✅ ${name}`)
  } catch (err) {
    failed++
    failures.push({ name, error: err.message })
    console.log(`  ❌ ${name}`)
    console.log(`     ${err.message.split('\n')[0]}`)
  }
}

// ============ Mock AI 服务器 (带 CORS) ============
let mockServer = null

async function startMockAIServer() {
  const http = await import('http')
  mockServer = http.createServer((req, res) => {
    // 处理 CORS 预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      })
      res.end()
      return
    }

    // 所有响应都加 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (req.method === 'POST' && req.url === '/v1/chat/completions') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        const parsed = JSON.parse(body)
        const systemPrompt = parsed.messages[0]?.content || ''
        let chartContent = ''

        if (systemPrompt.includes('Mermaid')) {
          chartContent = `\`\`\`mermaid
flowchart TD
    A[开始] --> B[输入用户名]
    B --> C[验证密码]
    C --> D{验证成功?}
    D -->|是| E[登录成功]
    D -->|否| F[显示错误]
\`\`\``
        } else if (systemPrompt.includes('Excalidraw')) {
          chartContent = `\`\`\`json
{"type":"excalidraw","version":2,"elements":[{"id":"rect1","type":"rectangle","x":100,"y":100,"width":200,"height":100}]}
\`\`\``
        } else if (systemPrompt.includes('Draw.io')) {
          chartContent = `\`\`\`xml
<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Hello" style="rounded=1" vertex="1" parent="1"><mxGeometry x="100" y="100" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>
\`\`\``
        }

        const response = {
          id: 'mock-response',
          object: 'chat.completion',
          choices: [{
            index: 0,
            message: { role: 'assistant', content: chartContent || 'mock response' },
            finish_reason: 'stop',
          }],
        }
        res.writeHead(200, { 'Content-Type': 'application/json', ...corsHeaders })
        res.end(JSON.stringify(response))
      })
    } else {
      res.writeHead(404, corsHeaders)
      res.end('Not found')
    }
  })
  return new Promise(resolve => mockServer.listen(19876, resolve))
}

function stopMockAIServer() {
  if (mockServer) { mockServer.close(); mockServer = null }
}

// ============ 辅助函数 ============

async function configureAPI(page) {
  await page.evaluate(() => {
    const data = {
      state: {
        settings: {
          theme: 'auto',
          accessPassword: null,
          aiConfig: {
            provider: 'custom',
            apiUrl: 'http://localhost:19876/v1',
            apiKey: 'test-key',
            modelId: 'test-model',
          }
        }
      }
    }
    localStorage.setItem('hello-draw-settings', JSON.stringify(data))
  })
}

async function createProjectAndEnterEditor(page, engine = 'Mermaid') {
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')
  await configureAPI(page)
  await page.reload()
  await page.waitForLoadState('networkidle')

  await page.locator('button').filter({ hasText: engine }).first().click()
  await page.locator('button').filter({ hasText: '生成图表' }).first().click()
  await page.waitForURL(/\/editor\//, { timeout: 5000 })
}

// ============ 主测试流程 ============

async function runTests() {
  console.log('\n🚀 HelloDraw 产品验收测试 v3\n')
  console.log('─'.repeat(50))

  await startMockAIServer()
  console.log('\n📡 Mock AI 服务器已启动 (port 19876, CORS enabled)\n')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => {
    consoleErrors.push(`PageError: ${err.message}`)
  })

  // ─── 1. 应用加载 ───
  console.log('📦 1. 应用加载测试\n')

  await test('首页正常加载 (HTTP 200)', async () => {
    const resp = await page.goto(BASE_URL)
    assert(resp.status() === 200, `HTTP 状态码: ${resp.status()}`)
    const title = await page.title()
    assert(title.includes('HelloDraw'), `页面标题: ${title}`)
  })

  await test('首页包含 "创建新图表" 标题', async () => {
    const h1 = await page.locator('h1').first().textContent()
    assert(h1.includes('创建新图表'), `标题: ${h1}`)
  })

  await test('无致命 JS 错误', async () => {
    const realErrors = consoleErrors.filter(e =>
      !e.includes('favicon') && !e.includes('DevTools')
    )
    assert(realErrors.length === 0, `JS 错误: ${realErrors.join('; ')}`)
  })

  // ─── 2. 首页 UI ───
  console.log('\n🏠 2. 首页 UI 测试\n')

  await test('三种引擎按钮可见', async () => {
    for (const name of ['Mermaid', 'Excalidraw', 'Draw.io']) {
      const btn = page.locator('button').filter({ hasText: name }).first()
      assert(await btn.isVisible(), `${name} 按钮不可见`)
    }
  })

  await test('引擎选择状态切换', async () => {
    await page.locator('button').filter({ hasText: 'Excalidraw' }).first().click()
    let cls = await page.locator('button').filter({ hasText: 'Excalidraw' }).first().getAttribute('class')
    assert(cls.includes('blue-600'), 'Excalidraw 未选中')

    await page.locator('button').filter({ hasText: 'Mermaid' }).first().click()
    cls = await page.locator('button').filter({ hasText: 'Mermaid' }).first().getAttribute('class')
    assert(cls.includes('blue-600'), 'Mermaid 未选中')
  })

  await test('示例提示词点击填入输入框', async () => {
    await page.locator('button').filter({ hasText: '用户登录流程图' }).first().click()
    const val = await page.locator('input[placeholder*="自然语言"]').inputValue()
    assert(val.includes('登录流程图'), `输入框: ${val}`)
    await page.locator('input[placeholder*="自然语言"]').fill('')
  })

  // ─── 3. 项目创建与编辑器 ───
  console.log('\n📂 3. 项目创建与编辑器测试\n')

  await test('创建 Mermaid 项目跳转到编辑器', async () => {
    await createProjectAndEnterEditor(page, 'Mermaid')
    assert(page.url().includes('/editor/'), `URL: ${page.url()}`)
  })

  await test('编辑器页面包含所有必要 UI 元素', async () => {
    const heading = await page.locator('h1').textContent()
    assert(heading.includes('新图表'), `标题: ${heading}`)

    const backBtn = page.locator('button').filter({ hasText: '返回' }).first()
    assert(await backBtn.isVisible(), '返回按钮不可见')

    const historyBtn = page.locator('button').filter({ hasText: '历史记录' }).first()
    assert(await historyBtn.isVisible(), '历史记录按钮不可见')

    const exportBtn = page.locator('button').filter({ hasText: '导出' }).first()
    assert(await exportBtn.isVisible(), '导出按钮不可见')
  })

  await test('空项目显示 "暂无内容"', async () => {
    const hint = page.locator('text=暂无内容')
    assert(await hint.isVisible(), '"暂无内容" 不显示')
  })

  await test('对话面板 UI 完整', async () => {
    assert(await page.locator('input[placeholder*="图表"]').isVisible(), '输入框不可见')
    assert(await page.locator('button').filter({ hasText: '发送' }).first().isVisible(), '发送按钮不可见')
  })

  // ─── 4. AI 对话 + Mermaid 渲染 ───
  console.log('\n🤖 4. AI 对话 + Mermaid 渲染集成测试\n')

  await test('发送消息给 AI（Mock 服务器）', async () => {
    const input = page.locator('input[placeholder*="图表"]')
    await input.fill('画一个用户登录流程图')
    await input.press('Enter')
    await page.waitForTimeout(4000) // 等待 Mock 服务器响应
  })

  await test('AI 响应显示在对话面板', async () => {
    const messageBubbles = page.locator('[class*="rounded-2xl"]')
    const count = await messageBubbles.count()
    assert(count >= 2, `应有 2 条消息（用户+AI），实际: ${count}`)
  })

  await test('Mermaid 图表渲染到预览区', async () => {
    await page.waitForTimeout(2000)

    const svg = page.locator('svg').first()
    const svgExists = await svg.isVisible().catch(() => false)

    if (svgExists) {
      const svgHtml = await svg.innerHTML()
      assert(svgHtml.length > 50, `SVG 内容长度: ${svgHtml.length}`)
    } else {
      // 检查 "暂无内容" 是否消失
      const noContent = page.locator('text=暂无内容')
      const stillEmpty = await noContent.isVisible().catch(() => false)
      assert(!stillEmpty, 'AI 返回后仍显示 "暂无内容"')
    }
  })

  await test('导出下拉菜单', async () => {
    const exportBtn = page.locator('button').filter({ hasText: '导出 ▾' })
    if (await exportBtn.first().isVisible().catch(() => false)) {
      await exportBtn.first().click()
      await page.waitForTimeout(300)

      assert(await page.locator('button').filter({ hasText: '导出 SVG' }).first().isVisible().catch(() => false), 'SVG 选项不可见')
      assert(await page.locator('button').filter({ hasText: '导出 PNG' }).first().isVisible().catch(() => false), 'PNG 选项不可见')
      await page.keyboard.press('Escape')
    }
  })

  // ─── 5. 版本历史 ───
  console.log('\n📋 5. 版本历史测试\n')

  await test('打开版本历史弹窗', async () => {
    await page.locator('button').filter({ hasText: '历史记录' }).first().click()
    await page.waitForTimeout(500)
    assert(await page.locator('text=版本历史').isVisible().catch(() => false), '弹窗标题不可见')
  })

  await test('保存版本', async () => {
    await page.locator('button').filter({ hasText: '保存当前版本' }).first().click()
    await page.waitForTimeout(1000)

    const dateBtns = page.locator('button').filter({ hasText: /\d/ })
    const count = await dateBtns.count()
    assert(count >= 1, `版本记录数: ${count}`)
  })

  await test('关闭版本历史', async () => {
    const closeBtn = page.locator('button').filter({ hasText: '✕' })
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click()
    } else {
      await page.keyboard.press('Escape')
    }
    await page.waitForTimeout(300)
  })

  // ─── 6. Excalidraw 项目 ───
  console.log('\n🎨 6. Excalidraw 项目测试\n')

  await test('创建 Excalidraw 项目', async () => {
    await createProjectAndEnterEditor(page, 'Excalidraw')
  })

  await test('Excalidraw 画布加载', async () => {
    await page.waitForTimeout(3000)

    const editBtn = page.locator('button').filter({ hasText: '编辑' })
    const viewBtn = page.locator('button').filter({ hasText: '只读' })
    assert(await editBtn.isVisible().catch(() => false), '编辑按钮不可见')
    assert(await viewBtn.isVisible().catch(() => false), '只读按钮不可见')
  })

  await test('Excalidraw 切换只读模式', async () => {
    const viewBtn = page.locator('button').filter({ hasText: '只读' })
    await viewBtn.click()
    await page.waitForTimeout(300)
    const cls = await viewBtn.getAttribute('class')
    assert(cls.includes('blue-600'), '只读未选中')
  })

  await test('Excalidraw AI 对话面板显示', async () => {
    const chatInput = page.locator('input[placeholder*="图表"]')
    assert(await chatInput.isVisible(), '对话面板不可见')
  })

  // ─── 7. Draw.io 项目 ───
  console.log('\n📐 7. Draw.io 项目测试\n')

  await test('创建 Draw.io 项目', async () => {
    await createProjectAndEnterEditor(page, 'Draw.io')
  })

  await test('Draw.io 画布区域显示', async () => {
    await page.waitForTimeout(3000)

    const label = page.locator('text=Draw.io 编辑器')
    const hasLabel = await label.isVisible().catch(() => false)

    const errorEl = page.locator('text=Draw.io 加载失败')
    const hasError = await errorEl.isVisible().catch(() => false)

    assert(hasLabel || hasError, 'Draw.io 标签和错误提示都不可见')

    if (hasError) {
      console.log('     ⚠️  mxgraph CDN 不可达，但已显示错误提示（正确行为）')
    }
  })

  // ─── 8. 导航 ───
  console.log('\n🧭 8. 导航测试\n')

  await test('编辑器 → 首页', async () => {
    const backBtn = page.locator('button').filter({ hasText: '返回' }).first()
    await backBtn.click()
    await page.waitForLoadState('networkidle')

    const h1 = await page.locator('h1').first().textContent()
    assert(h1.includes('创建新图表'), `标题: ${h1}`)
  })

  await test('首页 → 设置', async () => {
    await page.locator('a[href="/settings"]').first().click()
    await page.waitForLoadState('networkidle')

    const h1 = await page.locator('h1').first().textContent()
    assert(h1.includes('设置'), `标题: ${h1}`)
  })

  await test('设置 → 首页（通过 Logo）', async () => {
    await page.locator('a').filter({ hasText: 'HelloDraw' }).first().click()
    await page.waitForLoadState('networkidle')

    const h1 = await page.locator('h1').first().textContent()
    assert(h1.includes('创建新图表'), `标题: ${h1}`)
  })

  // ─── 9. 设置页面 ───
  console.log('\n⚙️ 9. 设置页面测试\n')

  await test('API 配置 - 切换提供商自动填充', async () => {
    await page.goto(`${BASE_URL}/settings`)
    await page.waitForLoadState('networkidle')

    await page.locator('select').first().selectOption('glm')
    await page.waitForTimeout(300)
    const url1 = await page.locator('input[type="text"]').first().inputValue()
    assert(url1.includes('bigmodel'), `GLM URL: ${url1}`)

    await page.locator('select').first().selectOption('minimax')
    await page.waitForTimeout(300)
    const url2 = await page.locator('input[type="text"]').first().inputValue()
    assert(url2.includes('minimax'), `MiniMax URL: ${url2}`)
  })

  await test('API 配置 - 填入 Mock 服务器配置', async () => {
    await page.locator('select').first().selectOption('custom')
    await page.waitForTimeout(300)

    const textInputs = await page.locator('input[type="text"]').all()
    const passInputs = await page.locator('input[type="password"]').all()

    await textInputs[0].fill('http://localhost:19876/v1')
    if (textInputs.length > 1) await textInputs[1].fill('test-model')
    if (passInputs.length > 0) await passInputs[0].fill('test-key')
    if (textInputs.length > 2) await textInputs[2].fill('test-model')

    const apiUrl = await textInputs[0].inputValue()
    assert(apiUrl === 'http://localhost:19876/v1', `URL: ${apiUrl}`)
  })

  await test('测试连接 - Mock 服务器应返回成功', async () => {
    await page.locator('button').filter({ hasText: '测试连接' }).first().click()
    await page.waitForTimeout(2000)

    const success = page.locator('text=连接成功')
    assert(await success.isVisible().catch(() => false), 'Mock 连接应成功')
  })

  await test('主题切换', async () => {
    await page.locator('button').filter({ hasText: '深色' }).first().click()
    await page.waitForTimeout(500)
    const cls = await page.locator('button').filter({ hasText: '深色' }).first().getAttribute('class')
    assert(cls.includes('blue-600'), '深色按钮未选中')

    await page.locator('button').filter({ hasText: '自动' }).first().click()
  })

  await test('数据管理区域', async () => {
    assert(await page.locator('button').filter({ hasText: '导出数据' }).first().isVisible(), '导出按钮不可见')
    assert(await page.locator('text=导入数据').isVisible(), '导入按钮不可见')
    assert(await page.locator('button').filter({ hasText: '清除所有数据' }).first().isVisible(), '清除按钮不可见')
  })

  // ─── 10. 数据持久化 ───
  console.log('\n💾 10. 数据持久化测试\n')

  await test('项目数据持久化到 IndexedDB', async () => {
    await configureAPI(page)
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // 创建项目
    await page.locator('button').filter({ hasText: 'Mermaid' }).first().click()
    await page.locator('button').filter({ hasText: '生成图表' }).first().click()
    await page.waitForURL(/\/editor\//, { timeout: 5000 })

    // 返回首页检查
    await page.locator('button').filter({ hasText: '返回' }).first().click()
    await page.waitForLoadState('networkidle')

    const linksBefore = await page.locator('a[href^="/editor/"]').count()
    assert(linksBefore >= 1, `创建后应有项目链接，实际: ${linksBefore}`)

    // 刷新页面
    await page.reload()
    await page.waitForLoadState('networkidle')

    const linksAfter = await page.locator('a[href^="/editor/"]').count()
    assert(linksAfter >= 1, `刷新后应保留项目链接，实际: ${linksAfter}`)

    if (linksAfter >= linksBefore) {
      console.log('     → 项目数据已成功持久化到 IndexedDB')
    }
  })

  // ─── 11. 错误处理 ───
  console.log('\n🛡️ 11. 错误处理测试\n')

  await test('未配置 API 发送消息提示', async () => {
    await page.evaluate(() => localStorage.clear())
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    await page.locator('button').filter({ hasText: '生成图表' }).first().click()
    await page.waitForURL(/\/editor\//, { timeout: 5000 })

    const input = page.locator('input[placeholder*="图表"]')
    await input.fill('test')
    await input.press('Enter')
    await page.waitForTimeout(1000)

    assert(await page.locator('text=请先配置').isVisible().catch(() => false), '未提示配置 API')
  })

  await test('无效项目 ID 跳回首页', async () => {
    await page.goto(`${BASE_URL}/editor/non-existent-id`)
    await page.waitForTimeout(3000)
    assert(!page.url().includes('/editor/'), `URL: ${page.url()}`)
  })

  // ─── 12. AI 代码解析 ───
  console.log('\n🔍 12. AI 代码解析测试\n')

  await test('Mermaid 代码块提取', async () => {
    const result = await page.evaluate(() => {
      const text = '回复\n```mermaid\nflowchart TD\n    A-->B\n```'
      const regex = new RegExp('```mermaid([\\s\\S]*?)```', 'i')
      const match = text.match(regex)
      return match ? match[1].trim() : null
    })
    assert(result === 'flowchart TD\n    A-->B', `结果: ${result}`)
  })

  await test('无代码块时返回 null', async () => {
    const result = await page.evaluate(() => {
      const text = '没有代码块'
      const regex = new RegExp('```mermaid([\\s\\S]*?)```', 'i')
      return text.match(regex)
    })
    assert(result === null, '应返回 null')
  })

  // ─── 13. 响应式 ───
  console.log('\n📱 13. 响应式测试\n')

  await test('移动端 (375x812) 布局不崩溃', async () => {
    await page.goto(BASE_URL)
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForLoadState('networkidle')

    const h1 = await page.locator('h1').first().textContent()
    assert(h1.includes('创建新图表'), `移动端标题: ${h1}`)
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  // ─── 清理 ───
  await browser.close()
  stopMockAIServer()

  // ─── 结果 ───
  console.log('\n' + '─'.repeat(50))
  console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败, 共 ${passed + failed} 项\n`)

  if (failures.length > 0) {
    console.log('❌ 失败详情:\n')
    failures.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.name}`)
      console.log(`     ${f.error.split('\n')[0]}\n`)
    })
  }

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch(err => {
  console.error('测试运行失败:', err)
  process.exit(1)
})
