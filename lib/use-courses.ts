// lib/use-courses.ts
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Course, Unit, Topic } from './types'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const storedCourses = localStorage.getItem('courses')
    return storedCourses ? JSON.parse(storedCourses) : []
  })

  const saveCourses = (updatedCourses: Course[]) => {
    setCourses(updatedCourses)
    localStorage.setItem('courses', JSON.stringify(updatedCourses))
  }

  const addCourse = (name: string): Course => {
    const newCourse: Course = {
      id: uuidv4(),
      name,
      units: []
    }
    const updatedCourses = [...courses, newCourse]
    saveCourses(updatedCourses)
    return newCourse
  }

  const getCourse = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId)
  }

  const getCourses = (): Course[] => {
    return courses
  }

  const deleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId)
    saveCourses(updatedCourses)
  }

  const addUnit = (courseId: string, unitName: string, unitNumber: number): Unit => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const newUnit: Unit = {
          id: uuidv4(),
          name: unitName,
          number: unitNumber,
          topics: []
        }
        return {
          ...course,
          units: [...course.units, newUnit]
        }
      }
      return course
    })

    saveCourses(updatedCourses)
    return updatedCourses.find(course => course.id === courseId)!.units.slice(-1)[0]
  }

  const addTopic = (courseId: string, unitId: string, topicData: Omit<Topic, 'id' | 'notes'>): Topic => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id === unitId) {
              const newTopic: Topic = {
                id: uuidv4(),
                ...topicData,
                notes: ''
              }
              return {
                ...unit,
                topics: [...unit.topics, newTopic]
              }
            }
            return unit
          })
        }
      }
      return course
    })

    saveCourses(updatedCourses)
    const targetCourse = updatedCourses.find(course => course.id === courseId)!
    const targetUnit = targetCourse.units.find(unit => unit.id === unitId)!
    return targetUnit.topics.slice(-1)[0]
  }

  const updateTopic = (courseId: string, unitId: string, topicId: string, updatedTopic: Topic) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id === unitId) {
              return {
                ...unit,
                topics: unit.topics.map(topic => 
                  topic.id === topicId ? updatedTopic : topic
                )
              }
            }
            return unit
          })
        }
      }
      return course
    })

    saveCourses(updatedCourses)
  }

  const deleteTopic = (courseId: string, unitId: string, topicId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id === unitId) {
              return {
                ...unit,
                topics: unit.topics.filter(topic => topic.id !== topicId)
              }
            }
            return unit
          })
        }
      }
      return course
    })

    saveCourses(updatedCourses)
  }

  return {
    getCourses,
    getCourse,
    addCourse,
    deleteCourse,
    addUnit,
    addTopic,
    updateTopic,
    deleteTopic
  }
}
