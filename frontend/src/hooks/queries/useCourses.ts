import { getCourses } from '@services/meicFeedbackAPI'
import { useQuery } from '@tanstack/react-query'
import { infrequentDataConfig } from './config'

export function useCourses(degreeId: number | null = null) {
  const options = {
    ...infrequentDataConfig,
    queryKey: ['degrees', degreeId, 'courses'],
    queryFn: () => (degreeId ? getCourses({ degreeId }) : Promise.resolve([]))
  }
  return useQuery(options)
}
