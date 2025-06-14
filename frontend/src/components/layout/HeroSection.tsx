import { useApp } from '@/hooks'
import { ActionButton } from '@components'
import posthog from 'posthog-js'
import { useNavigate } from 'react-router-dom'

export function HeroSection() {
  const navigate = useNavigate()
  const { selectedDegree } = useApp()

  return (
    <div className="bg-blue-50 py-6 md:py-12 px-2 md:px-4 shadow-sm">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-istBlue mb-2 md:mb-4">
          Find the best {selectedDegree?.acronym ?? 'IST'} courses
        </h1>
        <p className="text-base md:text-lg text-gray-500 mb-4 md:mb-8 max-w-md md:max-w-2xl">
          Honest, anonymous student reviews to help you choose the right
          courses.
        </p>
        <div className="flex flex-row gap-2 md:gap-8 mb-2 items-center justify-center w-full md:w-auto">
          <ActionButton
            label="Browse Courses"
            description="See what students really think about each course."
            onClick={() => {
              const el = document.getElementById('course-list')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            variant="primary"
          />
          <ActionButton
            label="Give feedback"
            description="Help your peers by sharing your honest review!"
            onClick={() => {
              posthog.capture('review_form_open', {
                source: 'hero_section'
              })
              navigate('/feedback/new')
            }}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}
