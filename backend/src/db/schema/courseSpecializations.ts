import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { courses } from './course'
import { specializations } from './specializations'

export const courseSpecializations = sqliteTable(
  'course_specializations',
  {
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    specializationId: integer('specialization_id')
      .notNull()
      .references(() => specializations.id, { onDelete: 'cascade' })
  },
  (table) => [primaryKey({ columns: [table.courseId, table.specializationId] })]
)

export type CourseSpecialization = typeof courseSpecializations.$inferSelect
export type NewCourseSpecialization = typeof courseSpecializations.$inferInsert
