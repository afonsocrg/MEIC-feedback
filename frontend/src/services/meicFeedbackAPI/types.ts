export interface Degree {
  id: number
  name: string
  acronym: string
}

export interface CourseGroup {
  id: number
  name: string
  courseIds: number[]
}

export interface Course {
  id: number
  name: string
  acronym: string
  url: string
  rating: number
  feedbackCount: number
  terms: string[]
}

export interface CourseDetail extends Course {
  description: string | null
  assessment: string | null
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
