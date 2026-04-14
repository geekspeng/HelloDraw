import { useSettingsStore } from '../stores/settingsStore'
import ApiConfigForm from '../components/settings/ApiConfigForm'

export default function Settings() {
  const { settings, updateTheme } = useSettingsStore()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        设置
      </h1>

      <div className="space-y-8">
        {/* API 配置 */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API 配置
          </h2>
          <ApiConfigForm />
        </section>

        {/* 主题 */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            外观
          </h2>
          <div className="flex gap-4">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => updateTheme(theme)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.theme === theme
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {theme === 'light' ? '浅色' : theme === 'dark' ? '深色' : '自动'}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
