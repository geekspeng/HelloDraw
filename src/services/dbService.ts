import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { DB_NAME, DB_VERSION, STORES } from '../utils/constants'
import type { Project, Version } from '../types'

interface HelloDrawDB extends DBSchema {
  projects: {
    key: string
    value: Project
    indexes: { 'by-updated': number }
  }
  versions: {
    key: string
    value: Version
    indexes: { 'by-project': string; 'by-created': number }
  }
}

let dbInstance: IDBPDatabase<HelloDrawDB> | null = null

export async function getDB(): Promise<IDBPDatabase<HelloDrawDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<HelloDrawDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Projects store
      if (!db.objectStoreNames.contains(STORES.PROJECTS)) {
        const projectStore = db.createObjectStore(STORES.PROJECTS, { keyPath: 'id' })
        projectStore.createIndex('by-updated', 'updatedAt')
      }

      // Versions store
      if (!db.objectStoreNames.contains(STORES.VERSIONS)) {
        const versionStore = db.createObjectStore(STORES.VERSIONS, { keyPath: 'id' })
        versionStore.createIndex('by-project', 'projectId')
        versionStore.createIndex('by-created', 'createdAt')
      }
    },
  })

  return dbInstance
}

// Project operations
export async function getAllProjects(): Promise<Project[]> {
  const db = await getDB()
  const projects = await db.getAllFromIndex(STORES.PROJECTS, 'by-updated')
  return projects.reverse() // newest first
}

export async function getProject(id: string): Promise<Project | undefined> {
  const db = await getDB()
  return db.get(STORES.PROJECTS, id)
}

export async function saveProject(project: Project): Promise<void> {
  const db = await getDB()
  await db.put(STORES.PROJECTS, project)
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORES.PROJECTS, id)
  // Also delete associated versions
  const versions = await db.getAllFromIndex(STORES.VERSIONS, 'by-project', id)
  const tx = db.transaction(STORES.VERSIONS, 'readwrite')
  await Promise.all([...versions.map((v) => tx.store.delete(v.id)), tx.done])
}

// Version operations
export async function getVersionsByProject(projectId: string): Promise<Version[]> {
  const db = await getDB()
  const versions = await db.getAllFromIndex(STORES.VERSIONS, 'by-project', projectId)
  return versions.sort((a, b) => b.createdAt - a.createdAt)
}

export async function saveVersion(version: Version): Promise<void> {
  const db = await getDB()
  await db.put(STORES.VERSIONS, version)
}

export async function deleteVersion(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORES.VERSIONS, id)
}
