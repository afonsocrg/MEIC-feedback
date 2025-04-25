const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`

export interface Course {
  id: number
  name: string
  acronym: string
  url: string
  rating: number
  feedbackCount: number
  period: string
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

interface GetCoursesParams {
  acronym?: string
}
export async function getCourses({ acronym }: GetCoursesParams = {}): Promise<
  Course[]
> {
  const url = new URL(`${API_BASE_URL}/courses`)
  if (acronym) {
    url.searchParams.append('acronym', acronym)
  }
  const response = await fetch(url.toString())
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

export async function getCourseIdFromAcronym(acronym: string): Promise<number> {
  const courses = await getCourses({ acronym })
  if (courses.length === 0) {
    throw new Error('Course not found')
  } else if (courses.length > 1) {
    console.warn('Multiple courses found for acronym', acronym)
    // throw new Error('Multiple courses found for acronym')
  }
  return courses[0].id
}
