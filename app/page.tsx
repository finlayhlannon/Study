import { Suspense } from "react"
import { Plus } from "lucide-react"
import CourseList from "@/components/course-list"
import AddCourseDialog from "@/components/add-course-dialog"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-xl font-medium">Study Tracker</h1>
        </div>
      </header>
      <main className="container px-4 py-8 sm:px-6 md:py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Your Courses</h2>
          <AddCourseDialog>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Course
            </Button>
          </AddCourseDialog>
        </div>
        <div className="mt-6">
          <Suspense fallback={<div>Loading courses...</div>}>
            <CourseList />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

