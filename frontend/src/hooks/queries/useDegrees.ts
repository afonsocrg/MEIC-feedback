import { getDegrees } from '@services/meicFeedbackAPI'
import { useQuery } from '@tanstack/react-query'
import { infrequentDataConfig } from './config'

export function useDegrees() {
  return useQuery({
    queryKey: ['degrees'],
    queryFn: () => getDegrees(),
    ...infrequentDataConfig
  })
}
