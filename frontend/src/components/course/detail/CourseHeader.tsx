import { Chip } from '@components'
import { type CourseDetail } from '@services/meicFeedbackAPI'
export interface CourseHeaderProps {
  course: CourseDetail
}
export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-istBlue mb-4">{course.name}</h1>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <p className="text-gray-600">{course.acronym}</p>
        {course.terms && (
          <div className="flex items-center gap-2">
            {course.terms.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </div>
        )}
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-700">
            {(course.rating ?? 0).toFixed(1)}
          </span>
          <span className="text-gray-500 ml-2">
            ({course.feedbackCount} reviews)
          </span>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-istBlue hover:underline cursor-pointer"
        >
          Fénix
        </a>
      </div>
    </>
  )
}
