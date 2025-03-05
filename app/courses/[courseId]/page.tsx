"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import TopicCard from "@/components/topic-card"
import AddTopicDialog from "@/components/add-topic-dialog"
import { useCourses } from "@/lib/use-courses"
import type { Topic } from "@/lib/types"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { getCourse, deleteCourse } = useCourses()
  const [course, setCourse] = useState<{ id: string; name: string; topics: Topic[] } | null>(null)

  useEffect(() => {
    const courseData = getCourse(courseId)
    if (!courseData) {
      router.push("/")
      return
    }
    setCourse(courseData)
  }, [courseId, getCourse, router])

  if (!course) {
    return <div className="container p-4">Loading course...</div>
  }

  const handleDeleteCourse = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(courseId)
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">{course.name}</h1>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDeleteCourse}>
            Delete Course
          </Button>
        </div>
      </header>
      <main className="container px-4 py-8 sm:px-6 md:py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Topics</h2>
          <AddTopicDialog courseId={courseId}>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Topic
            </Button>
          </AddTopicDialog>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.topics.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No topics yet. Add your first topic to get started.
            </div>
          ) : (
            course.topics.map((topic) => <TopicCard key={topic.id} courseId={courseId} topic={topic} />)
          )}
        </div>
      </main>
    </div>
  )
}

