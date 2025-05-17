import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { courses } from './course'
import { degrees } from './degree'

export const coursesDegrees = sqliteTable(
  'courses_degrees',
  {
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    degreeId: integer('degree_id')
      .notNull()
      .references(() => degrees.id, { onDelete: 'cascade' })
  },
  (table) => [primaryKey({ columns: [table.courseId, table.degreeId] })]
)

export type CourseDegree = typeof coursesDegrees.$inferSelect
export type NewCourseDegree = typeof coursesDegrees.$inferInsert
