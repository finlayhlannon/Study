"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCourses } from "@/lib/use-courses"

export default function AddCourseDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [courseName, setCourseName] = useState("")
  const { addCourse } = useCourses()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (courseName.trim()) {
      const newCourse = addCourse(courseName.trim())
      setCourseName("")
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Enter the name of your course. You can add topics to it later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Mathematics, History, Computer Science"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!courseName.trim()}>
              Add Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

