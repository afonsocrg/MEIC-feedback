import { formatSchoolYearString } from '@lib/schoolYear'

// Telegram
async function sendToTelegram(env: Env, message: string) {
  // Escape special characters for MarkdownV2 format
  message = message.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\$1')

  var url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`
  var payload = {
    chat_id: env.TELEGRAM_CHAT_ID,
    text: message.slice(0, 4096)
  }

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  // console.log('Sending telegram request', options)
  const response = await fetch(url, options)
  // console.log('Got telegram response', response)

  return response
}

function getStarsString(rating: number) {
  return '⭐️'.repeat(rating) + ` (${rating})`
}

interface SendCourseReviewReceivedArgs {
  schoolYear: number
  acronym: string
  rating: number
  workloadRating: number
  comment: string | null
}

export async function sendCourseReviewReceived(
  env: Env,
  args: SendCourseReviewReceivedArgs
) {
  const { schoolYear, acronym, rating, workloadRating, comment } = args

  const ratingStars = getStarsString(rating)
  const workloadRatingStars = getStarsString(workloadRating)

  let message = `[New Course Review]\n[${formatSchoolYearString(schoolYear, { yearFormat: 'long' })}] ${acronym}:\nOverall: ${ratingStars}\nWorkload: (${workloadRatingStars})`
  if (comment) {
    message += `\n\n${comment}`
  }
  return sendToTelegram(env, message)
}
