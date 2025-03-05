"use client"

import { useEffect, useState } from "react"
import { useCourses } from "@/lib/use-courses"
import CourseCard from "@/components/course-card"

export default function CourseList() {
  const { getCourses } = useCourses()
  const [courses, setCourses] = useState<Array<{ id: string; name: string; topics: any[] }>>([])

  useEffect(() => {
    setCourses(getCourses())
  }, [getCourses])

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        No courses yet. Add your first course to get started.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

