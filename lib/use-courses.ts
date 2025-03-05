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

  const getCourses = () => courses

  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId)
  }

  const addCourse = (name: string) => {
    const newCourse: Course = {
      id: uuidv4(),
      name,
      units: []
    }
    const updatedCourses = [...courses, newCourse]
    saveCourses(updatedCourses)
    return newCourse
  }

  const deleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId)
    saveCourses(updatedCourses)
  }

  const addUnit = (courseId: string, name: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const newUnit: Unit = {
          id: uuidv4(),
          name,
          courseId,
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
  }

  const deleteUnit = (courseId: string, unitId: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.filter(unit => unit.id !== unitId)
        }
      }
      return course
    })
    saveCourses(updatedCourses)
  }

  const addTopic = (courseId: string, unitId: string, topicData: Omit<Topic, 'id' | 'unitId'>) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id === unitId) {
              const newTopic: Topic = {
                id: uuidv4(),
                unitId,
                ...topicData
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

  const updateTopic = (courseId: string, unitId: string, topicId: string, updatedTopic: Partial<Topic>) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          units: course.units.map(unit => {
            if (unit.id === unitId) {
              return {
                ...unit,
                topics: unit.topics.map(topic => 
                  topic.id === topicId ? { ...topic, ...updatedTopic } : topic
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

  return {
    getCourses,
    getCourse,
    addCourse,
    deleteCourse,
    addUnit,
    deleteUnit,
    addTopic,
    deleteTopic,
    updateTopic
  }
}
