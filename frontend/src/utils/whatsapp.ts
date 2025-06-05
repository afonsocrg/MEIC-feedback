import { Course } from '@services/meicFeedbackAPI'
import { isMobile } from '@utils'
import { getReviewPath } from '@utils/routes'

export const whatsappUrls = {
  // For mobile devices - tries to open app directly
  mobile: `whatsapp://send`,
  // Fallback for mobile if app not installed
  mobileFallback: `https://wa.me/`,
  // For desktop - opens WhatsApp Web
  desktop: `https://web.whatsapp.com/send`
}

function getWhatsappShareUrl(baseUrl: string, message: string) {
  const searchParams = new URLSearchParams()
  searchParams.set('text', message)
  return `${baseUrl}?${searchParams.toString()}`
}

function openWhatsappFallback(message: string) {
  if (isMobile()) {
    // Try to open WhatsApp app directly
    window.location.href = getWhatsappShareUrl(whatsappUrls.mobile, message)

    // Fallback after a short delay if app doesn't open
    setTimeout(() => {
      window.open(
        getWhatsappShareUrl(whatsappUrls.mobileFallback, message),
        '_blank'
      )
    }, 1000)
  } else {
    // For desktop, open WhatsApp Web in new tab
    window.open(getWhatsappShareUrl(whatsappUrls.desktop, message), '_blank')
  }
}

export interface OpenWhatsappData {
  text: string
}
export async function openWhatsapp({ text }: OpenWhatsappData) {
  if (isMobile() && navigator.share) {
    try {
      await navigator.share({ text: text })
    } catch (err) {
      // If native share fails, fall back to WhatsApp direct
      console.log('Caught error', err)
      openWhatsappFallback(text)
    }
  } else {
    console.log('No navigator.share')
    openWhatsappFallback(text)
  }
}

export function getAskForFeedbackMessage(course: Course) {
  const feedbackUrl = `${window.location.origin}${getReviewPath({ courseId: course.id })}`
  const acronym = course.acronym
  return `Boas!! Podias dizer-me como foi a tua experiência a fazer ${acronym}?\n\n${feedbackUrl}\n\nObrigado!!!`
}
