const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

export interface Course {
  id: number
  name: string
  acronym: string
  url: string
  rating: number
  feedbackCount: number
}

export interface CourseDetail extends Course {
  description: string
}

export interface Feedback {
  id: number
  courseId: number
  rating: number
  comment: string | null
  createdAt: string
}

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/courses`)
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }
  return response.json()
}

export async function getCourse(id: number): Promise<CourseDetail> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch course')
  }
  return response.json()
}

export async function getCourseFeedback(id: number): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}/feedback`)
  if (!response.ok) {
    throw new Error('Failed to fetch course feedback')
  }
  return response.json()
}
