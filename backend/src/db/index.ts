import { drizzle } from 'drizzle-orm/d1'
import { courses, feedback } from './schema'

export type Database = typeof courses | typeof feedback

export function getDb(env: any) {
  return drizzle(env.DB, { schema: { courses, feedback } })
}

export { courses, feedback }
