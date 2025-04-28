import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
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
