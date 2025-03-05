"use client"

import { useCallback, useEffect, useState } from "react"
import type { Course, Topic } from "./types"

export function useCourses() {
  const [initialized, setInitialized] = useState(false)

  // Initialize local storage with empty courses array if it doesn't exist
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      const storedCourses = localStorage.getItem("courses")
      if (!storedCourses) {
        localStorage.setItem("courses", JSON.stringify([]))
      }
      setInitialized(true)
    }
  }, [initialized])

  // Get all courses
  const getCourses = useCallback((): Course[] => {
    if (typeof window === "undefined") return []
    const storedCourses = localStorage.getItem("courses")
    return storedCourses ? JSON.parse(storedCourses) : []
  }, [])

  // Get a specific course by ID
  const getCourse = useCallback(
    (courseId: string): Course | null => {
      const courses = getCourses()
      return courses.find((course) => course.id === courseId) || null
    },
    [getCourses],
  )

  // Add a new course
  const addCourse = useCallback(
    (name: string): Course => {
      const courses = getCourses()
      const newCourse: Course = {
        id: crypto.randomUUID(),
        name,
        topics: [],
      }
      localStorage.setItem("courses", JSON.stringify([...courses, newCourse]))
      return newCourse
    },
    [getCourses],
  )

  // Delete a course
  const deleteCourse = useCallback(
    (courseId: string): void => {
      const courses = getCourses()
      const updatedCourses = courses.filter((course) => course.id !== courseId)
      localStorage.setItem("courses", JSON.stringify(updatedCourses))
    },
    [getCourses],
  )

  // Add a topic to a course
  const addTopic = useCallback(
    (courseId: string, topicData: Omit<Topic, "id">): Topic | null => {
      const courses = getCourses()
      const courseIndex = courses.findIndex((course) => course.id === courseId)

      if (courseIndex === -1) return null

      const newTopic: Topic = {
        id: crypto.randomUUID(),
        ...topicData,
      }

      courses[courseIndex].topics.push(newTopic)
      localStorage.setItem("courses", JSON.stringify(courses))

      return newTopic
    },
    [getCourses],
  )

  // Update a topic
  const updateTopic = useCallback(
    (courseId: string, topicId: string, topicData: Partial<Topic>): boolean => {
      const courses = getCourses()
      const courseIndex = courses.findIndex((course) => course.id === courseId)

      if (courseIndex === -1) return false

      const topicIndex = courses[courseIndex].topics.findIndex((topic) => topic.id === topicId)

      if (topicIndex === -1) return false

      courses[courseIndex].topics[topicIndex] = {
        ...courses[courseIndex].topics[topicIndex],
        ...topicData,
      }

      localStorage.setItem("courses", JSON.stringify(courses))
      return true
    },
    [getCourses],
  )

  // Delete a topic
  const deleteTopic = useCallback(
    (courseId: string, topicId: string): boolean => {
      const courses = getCourses()
      const courseIndex = courses.findIndex((course) => course.id === courseId)

      if (courseIndex === -1) return false

      courses[courseIndex].topics = courses[courseIndex].topics.filter((topic) => topic.id !== topicId)

      localStorage.setItem("courses", JSON.stringify(courses))
      return true
    },
    [getCourses],
  )

  return {
    getCourses,
    getCourse,
    addCourse,
    deleteCourse,
    addTopic,
    updateTopic,
    deleteTopic,
  }
}

