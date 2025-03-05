export interface Unit {
  id: string;
  name: string;
  courseId: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  unitId: string;
  description?: string;
  dueDate: string;
  knowledgeLevel: number;
  notes?: string;
}

export interface Course {
  id: string;
  name: string;
  units: Unit[];
}
