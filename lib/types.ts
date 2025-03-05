// lib/types.ts
export interface Topic {
  id: string
  name: string
  description?: string
  notes?: string
  knowledgeLevel: number
  dueDate: string
}

export interface Unit {
  id: string
  name: string
  number: number
  topics: Topic[]
}

export interface Course {
  id: string
  name: string
  units: Unit[]
}
