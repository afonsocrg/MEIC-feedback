import { CourseGrid, DegreeSelector, SearchBar } from '@components'
import { useApp } from '@hooks'
import { getCourses, type Course } from '@services/meicFeedbackAPI'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type SortOption = 'rating' | 'alphabetical' | 'reviews'

// For now not persisting in local storage
// const STORAGE_KEYS = {
//   PERIOD: 'meic-feedback-period',
//   SPECIALIZATION: 'meic-feedback-specialization',
//   SORT: 'meic-feedback-sort'
// }

export function CourseExplorer() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDegreeSelectorOpen, setIsDegreeSelectorOpen] = useState(false)

  const [courses, setCourses] = useState<Course[]>([])

  // Get initial values from URL parameters
  const [searchParams] = useSearchParams()

  const initialValues = getInitialValues(searchParams)
  const [searchQuery, setSearchQuery] = useState(initialValues.searchQuery)
  const [selectedPeriod, setSelectedPeriod] = useState(initialValues.period)
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    number | null
  >(initialValues.specialization)
  const [sortBy, setSortBy] = useState<SortOption>(initialValues.sortBy)

  const { selectedDegree, specializations } = useApp()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDegree === null) {
          return
        }

        const coursesData = await getCourses({
          degreeId: selectedDegree.id
        })

        setCourses(coursesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedDegree])

  const availablePeriods = useMemo(() => {
    return [...new Set(courses.map((course) => course.period))].sort()
  }, [courses])

  useEffect(() => {
    // Chrome converts search parameters to lowercase
    // So we need to do a case insensitive search
    // and then use the found period
    const period = searchParams.get('period')
    if (!period) return

    const foundPeriod = availablePeriods.find(
      (p) => p.toLowerCase() === period.toLowerCase()
    )
    if (foundPeriod) {
      setSelectedPeriod(foundPeriod)
    }
  }, [availablePeriods, searchParams])

  const filteredCourses = useMemo(
    () =>
      courses
        .filter((course) => {
          const searchLower = searchQuery.toLowerCase()
          const matchesSearch =
            course.name.toLowerCase().includes(searchLower) ||
            course.acronym.toLowerCase().includes(searchLower)
          const matchesPeriod =
            !selectedPeriod || course.period === selectedPeriod
          const matchesSpecialization =
            !selectedSpecialization ||
            specializations
              .find((s) => s.id === selectedSpecialization)
              ?.courseIds.includes(course.id)
          return matchesSearch && matchesPeriod && matchesSpecialization
        })
        .sort((a, b) => {
          switch (sortBy as SortOption) {
            case 'rating':
              return (b.rating || 0) - (a.rating || 0)
            case 'alphabetical':
              return a.name.localeCompare(b.name)
            case 'reviews':
              return (b.feedbackCount || 0) - (a.feedbackCount || 0)
            default:
              return 0
          }
        }),
    [
      courses,
      searchQuery,
      selectedPeriod,
      selectedSpecialization,
      sortBy,
      specializations
    ]
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300 }
    }
  }
  return (
    <motion.main
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-sm text-gray-500 mb-4">
        Currently viewing courses for{' '}
        <button
          onClick={() => setIsDegreeSelectorOpen(true)}
          className="hover:text-gray-700 transition-colors underline decoration-dotted cursor-pointer"
        >
          {selectedDegree ? selectedDegree.acronym : 'all degrees'}
        </button>
      </div>
      <DegreeSelector
        isOpen={isDegreeSelectorOpen || selectedDegree === null}
        onClose={() => setIsDegreeSelectorOpen(false)}
      />
      {selectedDegree && (
        <>
          <motion.div variants={itemVariants} id="course-list">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={setSelectedSpecialization}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availablePeriods={availablePeriods}
              specializations={specializations}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : filteredCourses.length > 0 ? (
              <CourseGrid courses={filteredCourses} />
            ) : (
              <div className="text-gray-600 text-center py-8">
                {searchQuery || selectedPeriod
                  ? 'No courses match your filters.'
                  : 'No courses loaded yet. Please try again later.'}
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.main>
  )
}

function getInitialValues(searchParams: URLSearchParams) {
  const searchQuery = searchParams.get('q') || ''
  const period = searchParams.get('period') || ''
  const specialization = null
  // const specialization = searchParams.get('specialization')
  //   ? Number(searchParams.get('specialization'))
  //   : null

  const sortValue = searchParams.get('sort')
  const sortBy = (
    sortValue && ['rating', 'alphabetical', 'reviews'].includes(sortValue)
      ? sortValue
      : 'alphabetical'
  ) as SortOption

  return {
    searchQuery,
    period,
    specialization,
    sortBy
  }
}
