import { HOUR, MINUTE } from '@utils/time_ms'

export const infrequentDataConfig = {
  staleTime: 24 * HOUR,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false
}

export const frequentDataConfig = {
  staleTime: 10 * MINUTE,
  // refetchInterval: 5 * MINUTE
  refetchOnMount: false,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true
}
