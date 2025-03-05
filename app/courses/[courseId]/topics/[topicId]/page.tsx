"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Hash, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import KnowledgeLevelSelector from "@/components/knowledge-level-selector"
import { useCourses } from "@/lib/use-courses"
import type { Topic } from "@/lib/types"

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const topicId = params.topicId as string

  const { getCourse, updateTopic, deleteTopic } = useCourses()
  const [course, setCourse] = useState<{ id: string; name: string } | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [notes, setNotes] = useState("")
  
  // New state for sorting
  const [sortBy, setSortBy] = useState<'unitNumber' | 'knowledgeLevel'>('unitNumber')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const courseData = getCourse(courseId)
    if (!courseData) {
      router.push("/")
      return
    }

    // Sort topics based on current sort settings
    const sortedTopics = [...courseData.topics].sort((a, b) => {
      const comparison = sortBy === 'unitNumber' 
        ? a.unitNumber - b.unitNumber 
        : a.knowledgeLevel - b.knowledgeLevel;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    const topicData = sortedTopics.find((t) => t.id === topicId)
    if (!topicData) {
      router.push(`/courses/${courseId}`)
      return
    }

    setCourse({ id: courseData.id, name: courseData.name })
    setTopic(topicData)
    setNotes(topicData.notes || "")
  }, [courseId, topicId, getCourse, router, sortBy, sortDirection])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
    if (topic) {
      updateTopic(courseId, topicId, { ...topic, notes: e.target.value })
    }
  }

  const handleKnowledgeLevelChange = (level: number) => {
    if (topic) {
      const updatedTopic = { ...topic, knowledgeLevel: level }
      setTopic(updatedTopic)
      updateTopic(courseId, topicId, updatedTopic)
    }
  }

  const handleDeleteTopic = () => {
    if (confirm("Are you sure you want to delete this topic?")) {
      deleteTopic(courseId, topicId)
      router.push(`/courses/${courseId}`)
    }
  }

  const handleSortChange = (newSortBy: 'unitNumber' | 'knowledgeLevel') => {
    // If sorting by the same column, toggle direction
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If sorting by a new column, reset to ascending
      setSortBy(newSortBy)
      setSortDirection('asc')
    }
  }

  if (!course || !topic) {
    return <div className="container p-4">Loading topic...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href={`/courses/${courseId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-medium">{topic.name}</h1>
              <p className="text-sm text-muted-foreground">{course.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort By: {sortBy === 'unitNumber' ? 'Unit Number' : 'Knowledge Level'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSortChange('unitNumber')}>
                  Unit Number {sortBy === 'unitNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('knowledgeLevel')}>
                  Knowledge Level {sortBy === 'knowledgeLevel' && (sortDirection === 'asc' ? '▲' : '▼')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" onClick={handleDeleteTopic}>
              Delete Topic
            </Button>
          </div>
        </div>
      </header>
      <main className="container grid gap-6 px-4 py-8 sm:px-6 md:py-12">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Unit {topic.unitNumber}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Due: {topic.dueDate}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <span className="text-sm font-medium">Knowledge Level:</span>
            <KnowledgeLevelSelector value={topic.knowledgeLevel} onChange={handleKnowledgeLevelChange} />
          </div>
        </div>

        {topic.description && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{topic.description}</p>
          </div>
        )}

        <div>
          <h3 className="mb-2 font-medium">Notes</h3>
          <Textarea
            className="min-h-[300px] font-mono"
            placeholder="Start typing your notes here..."
            value={notes}
            onChange={handleNotesChange}
          />
        </div>
      </main>
    </div>
  )
}
