import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">HelloDraw</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link
          to="/settings"
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
        >
          设置
        </Link>
      </nav>
    </header>
  )
}
