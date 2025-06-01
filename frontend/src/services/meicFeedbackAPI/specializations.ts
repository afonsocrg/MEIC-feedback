import { API_BASE_URL } from './config'
import { Specialization } from './types'

export async function getSpecializations(
  degreeId: number
): Promise<Specialization[]> {
  const response = await fetch(
    `${API_BASE_URL}/degrees/${degreeId}/specializations`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch specializations')
  }
  return response.json()
}
