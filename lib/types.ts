export interface Topic {
  id: string
  unitNumber: number
  name: string
  description: string
  dueDate: string
  knowledgeLevel: number
  notes: string
}

export interface Course {
  id: string
  name: string
  topics: Topic[]
}

