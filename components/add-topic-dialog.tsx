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
import { Textarea } from "@/components/ui/textarea"
import { useCourses } from "@/lib/use-courses"
import KnowledgeLevelSelector from "@/components/knowledge-level-selector"

interface AddTopicDialogProps {
  children: React.ReactNode
  courseId: string
}

export default function AddTopicDialog({ children, courseId }: AddTopicDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    unitNumber: "",
    description: "",
    dueDate: "",
    knowledgeLevel: 0,
  })
  const { addTopic } = useCourses()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.unitNumber.trim() && formData.dueDate.trim()) {
      addTopic(courseId, {
        name: formData.name.trim(),
        unitNumber: Number.parseInt(formData.unitNumber),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        knowledgeLevel: formData.knowledgeLevel,
        notes: "",
      })
      setFormData({
        name: "",
        unitNumber: "",
        description: "",
        dueDate: "",
        knowledgeLevel: 0,
      })
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
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>Enter the details for your new topic.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Topic Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Calculus, World War II"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  name="unitNumber"
                  type="number"
                  min="1"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the topic..."
                className="resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label>Knowledge Level (0-5)</Label>
              <KnowledgeLevelSelector
                value={formData.knowledgeLevel}
                onChange={(level) => setFormData((prev) => ({ ...prev, knowledgeLevel: level }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!formData.name.trim() || !formData.unitNumber.trim() || !formData.dueDate.trim()}
            >
              Add Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

