export interface Degree {
  id: number
  name: string
  acronym: string
}

export interface Specialization {
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
