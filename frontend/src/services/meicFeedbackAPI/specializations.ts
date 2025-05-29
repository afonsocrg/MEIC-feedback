import { API_BASE_URL } from './config'
import { Specialization } from './types'

export async function getSpecializations(): Promise<Specialization[]> {
  const response = await fetch(`${API_BASE_URL}/specializations`)
  if (!response.ok) {
    throw new Error('Failed to fetch specializations')
  }
  return response.json()
}
