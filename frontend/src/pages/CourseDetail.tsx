import { cn } from '@/utils'
import {
  CourseAssessment,
  CourseDescription,
  CourseDetailSkeleton,
  CourseHeader,
  CourseReviews
} from '@components'
import {
  getCourse,
  getCourseFeedback,
  type CourseDetail,
  type Feedback
} from '@services/meicFeedbackAPI'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300 }
  }
}

export function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        const courseId = parseInt(id!, 10)
        const courseData = await getCourse(courseId)
        const feedbackData = await getCourseFeedback(courseId)
        setCourse(courseData)
        setFeedback(feedbackData)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load course data'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [id])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Course not found</div>
      </div>
    )
  }

  const tabClasses = cn(
    'px-4 py-2 cursor-pointer',
    'font-medium',
    'rounded-none border-b-2 border-transparent',
    'data-[state=active]:border-b-istBlue data-[state=active]:text-istBlue',
    'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
    'hover:text-istBlue'
  )

  return (
    <motion.main
      className="container mx-auto px-4 py-8 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <CourseHeader {...{ course }} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="inline-flex justify-start bg-transparent border-b border-gray-200 w-full rounded-none">
            <TabsTrigger value="description" className={tabClasses}>
              What's this course about?
            </TabsTrigger>
            <TabsTrigger value="reviews" className={tabClasses}>
              Reviews
            </TabsTrigger>
            <TabsTrigger value="assessment" className={tabClasses}>
              Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <CourseDescription {...{ course }} />
          </TabsContent>

          <TabsContent value="assessment" className="mt-6">
            <CourseAssessment {...{ course }} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <CourseReviews {...{ course, feedback }} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.main>
  )
}
