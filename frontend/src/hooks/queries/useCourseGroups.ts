import { getCourseGroups } from '@services/meicFeedbackAPI'
import { useQuery } from '@tanstack/react-query'
import { infrequentDataConfig } from './config'

export function useCourseGroups(degreeId: number) {
  return useQuery({
    queryKey: ['degrees', degreeId, 'courseGroups'],
    queryFn: () => getCourseGroups(degreeId),
    ...infrequentDataConfig
  })
}
