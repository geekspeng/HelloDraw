import { create } from 'zustand'
import type { Project, EngineType } from '../types'
import { v4 as uuidv4 } from 'uuid'
import * as dbService from '../services/dbService'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  initialized: boolean
  init: () => Promise<void>
  addProject: (name: string, engine: EngineType, content?: string) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
  getProject: (id: string) => Project | undefined
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return
    try {
      const projects = await dbService.getAllProjects()
      set({ projects, initialized: true })
    } catch {
      // IndexedDB 不可用时降级为内存模式
      set({ initialized: true })
    }
  },

  addProject: async (name, engine, content = '') => {
    const project: Project = {
      id: uuidv4(),
      name,
      engine,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => ({ projects: [...state.projects, project] }))
    try {
      await dbService.saveProject(project)
    } catch {
      // 降级：仅在内存中
    }
    return project
  },

  updateProject: async (id, updates) => {
    let updatedProject: Project | null = null
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id === id) {
          updatedProject = { ...p, ...updates, updatedAt: Date.now() }
          return updatedProject!
        }
        return p
      })
      const currentProject =
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
          : state.currentProject
      return { projects, currentProject }
    })
    if (updatedProject) {
      try {
        await dbService.saveProject(updatedProject)
      } catch {
        // 降级
      }
    }
  },

  deleteProject: async (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }))
    try {
      await dbService.deleteProject(id)
    } catch {
      // 降级
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  getProject: (id) => get().projects.find((p) => p.id === id),
}))
