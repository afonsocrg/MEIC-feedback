import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const specializations = sqliteTable('specializations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date()
  )
})

export type Specialization = typeof specializations.$inferSelect
export type NewSpecialization = typeof specializations.$inferInsert
