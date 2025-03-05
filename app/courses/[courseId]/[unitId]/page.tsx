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

export default function AddUnitDialog({ 
  children, 
  courseId 
}: { 
  children: React.ReactNode, 
  courseId: string 
}) {
  const [open, setOpen] = useState(false)
  const [unitName, setUnitName] = useState("")
  const { addUnit } = useCourses()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (unitName.trim()) {
      addUnit(courseId, unitName.trim())
      setUnitName("")
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
            <DialogTitle>Add New Unit</DialogTitle>
            <DialogDescription>Enter the name of your unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Unit Name</Label>
              <Input
                id="name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="e.g., Molar Mass, Chemical Reactions"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!unitName.trim()}>
              Add Unit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
