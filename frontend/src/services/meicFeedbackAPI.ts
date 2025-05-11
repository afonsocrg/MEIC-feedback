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
  description: string | null
  evaluationMethod: string | null
}

export interface Feedback {
  id: number
  courseId: number
  email: string
  schoolYear: number
  rating: number
  workloadRating: number
  comment?: string
  createdAt: string
}

export type FeedbackSubmission = Omit<Feedback, 'id' | 'createdAt'>

export interface Specialization {
  id: number
  name: string
  courseIds: number[]
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

export async function getSpecializations(): Promise<Specialization[]> {
  const response = await fetch(`${API_BASE_URL}/specializations`)
  if (!response.ok) {
    throw new Error('Failed to fetch specializations')
  }
  return response.json()
}

export async function submitFeedback({
  email,
  schoolYear,
  courseId,
  rating,
  workloadRating,
  comment
}: FeedbackSubmission) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ email, schoolYear, rating, workloadRating, comment })
  })
  if (!response.ok) {
    throw new Error('Failed to submit feedback')
  }
  return response.json()
}
