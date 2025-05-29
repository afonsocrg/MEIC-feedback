import { API_BASE_URL } from './config'
import { Degree } from './types'

export async function getDegrees(): Promise<Degree[]> {
  const response = await fetch(`${API_BASE_URL}/degrees`)
  if (!response.ok) {
    throw new Error('Failed to fetch degrees')
  }
  return response.json()
}
