import { Course } from '@services/meicFeedbackAPI'
import { getReviewPath } from '@utils/routes'

const BASE_URL = `https://wa.me`

export function askForFeedbackUrl(course: Course) {
  const feedbackUrl = `${window.location.origin}${getReviewPath({ courseId: course.id })}`
  const acronym = course.acronym
  const message = `Boas!! Podias dizer-me como foi a tua experiência a fazer ${acronym}?\n\n${feedbackUrl}\n\nOrbigado!!!`

  const whatsappUrl = `${BASE_URL}/?text=${encodeURIComponent(message)}`
  return whatsappUrl
}
