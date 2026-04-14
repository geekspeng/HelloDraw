import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '../../stores/projectStore'

export default function Sidebar() {
  const { projects } = useProjectStore()
  const location = useLocation()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
          最近项目
        </h2>
      </div>
      <ul className="space-y-2">
        {projects.slice(0, 10).map((project) => (
          <li key={project.id}>
            <Link
              to={`/editor/${project.id}`}
              className={`block p-2 rounded-lg text-sm truncate transition-colors ${
                location.pathname === `/editor/${project.id}`
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {project.name}
            </Link>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-sm text-gray-400 dark:text-gray-500">暂无项目</li>
        )}
      </ul>
    </aside>
  )
}
