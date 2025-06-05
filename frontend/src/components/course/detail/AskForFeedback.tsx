import { getAskForFeedbackMessage, openWhatsapp } from '@/utils/whatsapp'
import { CopyButton } from '@components'
import { type CourseDetail } from '@services/meicFeedbackAPI'
import { Button } from '@ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover'
import { Share2 } from 'lucide-react'
import posthog from 'posthog-js'
import { useCallback } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

interface AskForFeedbackProps {
  reviewFormUrl: string
  course: CourseDetail
}
export function AskForFeedback({ reviewFormUrl, course }: AskForFeedbackProps) {
  const handleWhatsapp = useCallback(() => {
    posthog.capture('request_feedback', {
      medium: 'whatsapp',
      course_id: course.id,
      course_acronym: course.acronym
    })

    openWhatsapp({
      text: getAskForFeedbackMessage(course)
    })
  }, [course])

  const handleCopyUrl = useCallback(() => {
    posthog.capture('request_feedback', {
      medium: 'copy_url',
      course_id: course.id,
      course_acronym: course.acronym
    })
    const url = `${window.location.origin}${reviewFormUrl}`
    navigator.clipboard.writeText(url)
  }, [course, reviewFormUrl])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 active:bg-gray-100 dark:active:bg-gray-800"
        >
          <Share2 className="size-4" />
          Ask for feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2">
          <Button popover variant="ghost" onClick={handleWhatsapp}>
            <FaWhatsapp className="size-4" />
            WhatsApp
          </Button>
          {navigator.clipboard && (
            <CopyButton popover variant="ghost" onClick={handleCopyUrl} />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
