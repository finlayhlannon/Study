"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Book } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddUnitDialog from "@/components/add-unit-dialog"
import { useCourses } from "@/lib/use-courses"
import type { Course } from "@/lib/types"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { getCourse, deleteCourse } = useCourses()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    const courseData = getCourse(courseId)
    if (!courseData) {
      router.push("/")
      return
    }
    setCourse(courseData)
  }, [courseId, getCourse, router])

  const handleDeleteCourse = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(courseId)
      router.push("/")
    }
  }

  if (!course) {
    return <div className="container p-4">Loading course...</div>
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Units</h2>
          <AddUnitDialog courseId={courseId}>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Unit
            </Button>
          </AddUnitDialog>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.units.length === 0 ? (
            <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No units yet. Add your first unit to get started.
            </div>
          ) : (
            course.units.map((unit) => (
              <Link key={unit.id} href={`/courses/${courseId}/units/${unit.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      {unit.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {unit.topics.length} {unit.topics.length === 1 ? "topic" : "topics"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
