import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // This value changes every year. Fenix has one ID per course execution,
  // but here we're simplifying it to one ID per course.
  // Every year (between academic years) we need to update this value.
  externalId: text('external_id'),
  name: text('name').notNull(),
  acronym: text('acronym').notNull().unique(),
  description: text('description'),
  url: text('url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
  period: text('period'),
  evaluationMethod: text('evaluation_method')
})

export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
