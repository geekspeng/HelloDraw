import { test, expect } from '@playwright/test';

test.describe('HelloDraw E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('首页加载正确', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/HelloDraw/);

    // 检查主要元素
    await expect(page.locator('text=HelloDraw')).toBeVisible();
    await expect(page.locator('text=创建新图表')).toBeVisible();

    // 检查三种引擎选择
    await expect(page.locator('text=Mermaid')).toBeVisible();
    await expect(page.locator('text=Excalidraw')).toBeVisible();
    await expect(page.locator('text=Draw.io')).toBeVisible();

    // 检查快速生成输入框
    await expect(page.locator('input[placeholder*="自然语言"]')).toBeVisible();
    await expect(page.locator('button:has-text("生成图表")')).toBeVisible();
  });

  test('引擎选择功能正常', async ({ page }) => {
    // 点击 Mermaid 引擎
    const mermaidBtn = page.locator('button:has-text("Mermaid")').first();
    await mermaidBtn.click();
    await expect(mermaidBtn).toHaveClass(/border-blue-600/);

    // 点击 Excalidraw 引擎
    const excalidrawBtn = page.locator('button:has-text("Excalidraw")').first();
    await excalidrawBtn.click();
    await expect(excalidrawBtn).toHaveClass(/border-blue-600/);

    // 点击 Draw.io 引擎
    const drawioBtn = page.locator('button:has-text("Draw.io")').first();
    await drawioBtn.click();
    await expect(drawioBtn).toHaveClass(/border-blue-600/);
  });

  test('快速生成创建项目', async ({ page }) => {
    // 输入描述
    await page.fill('input[placeholder*="自然语言"]', '画一个用户登录流程图');

    // 点击生成
    await page.click('button:has-text("生成图表")');

    // 应该跳转到编辑器
    await expect(page).toHaveURL(/\/editor\/.+/);

    // 编辑器应该有返回按钮
    await expect(page.locator('button:has-text("← 返回")')).toBeVisible();
  });

  test('侧边栏显示', async ({ page }) => {
    // 检查侧边栏存在
    await expect(page.locator('text=最近项目')).toBeVisible();
  });

  test('设置页面可访问', async ({ page }) => {
    // 点击设置链接
    await page.click('a:has-text("设置")');

    // 检查设置页面元素
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.locator('text=API 配置')).toBeVisible();
    await expect(page.locator('text=外观')).toBeVisible();
  });

  test('API配置表单元素完整', async ({ page }) => {
    await page.click('a:has-text("设置")');

    // 检查 AI 提供商选择
    await expect(page.locator('text=AI 提供商')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();

    // 检查 API 地址输入
    await expect(page.locator('text=API 地址')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();

    // 检查 API Key 输入
    await expect(page.getByText('API Key', { exact: true })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // 检查测试连接按钮
    await expect(page.locator('button:has-text("测试连接")')).toBeVisible();
  });

  test('主题切换功能正常', async ({ page }) => {
    await page.click('a:has-text("设置")');

    // 点击深色主题
    await page.click('button:has-text("深色")');

    // 验证深色主题已激活
    await expect(page.locator('button:has-text("深色")')).toHaveClass(/bg-blue-600/);
  });

  test('示例提示词点击', async ({ page }) => {
    // 点击示例提示词
    await page.click('button:has-text("画一个用户登录流程图")');

    // 输入框应该被填充
    const input = page.locator('input[placeholder*="自然语言"]');
    await expect(input).toHaveValue('画一个用户登录流程图');
  });

  test('编辑器页面元素', async ({ page }) => {
    // 先创建一个项目
    await page.fill('input[placeholder*="自然语言"]', '测试图表');
    await page.click('button:has-text("生成图表")');

    // 等待跳转到编辑器
    await expect(page).toHaveURL(/\/editor\/.+/);

    // 检查编辑器元素
    await expect(page.locator('text=历史记录')).toBeVisible();
    await expect(page.locator('text=导出')).toBeVisible();
  });

  test('版本历史弹窗', async ({ page }) => {
    // 创建项目并进入编辑器
    await page.fill('input[placeholder*="自然语言"]', '测试图表');
    await page.click('button:has-text("生成图表")');
    await expect(page).toHaveURL(/\/editor\/.+/);

    // 点击历史记录按钮
    await page.click('button:has-text("历史记录")');

    // 检查弹窗
    await expect(page.locator('text=版本历史')).toBeVisible();
    await expect(page.locator('button:has-text("保存当前版本")')).toBeVisible();

    // 关闭弹窗
    await page.locator('button:text-is("✕")').click();
  });
});
