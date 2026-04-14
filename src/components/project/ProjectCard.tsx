import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { ENGINE_LABELS } from '../../utils/constants'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/editor/${project.id}`} className="block">
        <h3 className="font-medium text-gray-900 dark:text-white truncate mb-2">
          {project.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            {ENGINE_LABELS[project.engine]}
          </span>
          <span>{new Date(project.updatedAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault()
          onDelete(project.id)
        }}
        className="mt-3 text-sm text-red-500 hover:text-red-600"
      >
        删除
      </button>
    </div>
  )
}
