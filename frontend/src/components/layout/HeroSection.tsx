import { useApp } from '@/hooks'
import { ActionButton } from '@components'
import posthog from 'posthog-js'
import { useNavigate } from 'react-router-dom'

export function HeroSection() {
  const navigate = useNavigate()
  const { selectedDegree } = useApp()

  return (
    <div className="bg-blue-50 py-12 px-4 md:px-0 shadow-sm">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-istBlue mb-4">
          Find the best {selectedDegree?.acronym ?? 'IST'} courses
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl">
          Honest, anonymous student reviews to help you choose the right
          courses.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-2 items-center justify-center">
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
            label="Give a review"
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
