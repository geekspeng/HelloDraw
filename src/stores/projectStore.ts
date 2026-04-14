import { create } from 'zustand'
import type { Project, EngineType } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  addProject: (name: string, engine: EngineType, content?: string) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  getProject: (id: string) => Project | undefined
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,

  addProject: (name, engine, content = '') => {
    const project: Project = {
      id: uuidv4(),
      name,
      engine,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    set((state) => ({ projects: [...state.projects, project] }))
    return project
  },

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      ),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates, updatedAt: Date.now() }
          : state.currentProject,
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setCurrentProject: (project) => set({ currentProject: project }),

  getProject: (id) => get().projects.find((p) => p.id === id),
}))
