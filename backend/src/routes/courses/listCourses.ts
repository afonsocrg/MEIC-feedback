import { courses, feedback, getDb } from '@db'
import { OpenAPIRoute } from 'chanfana'
import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { IRequest } from 'itty-router'
import { z } from 'zod'

const CourseResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  url: z.string(),
  rating: z.number(),
  feedbackCount: z.number(),
  period: z.string()
})

export class GetCourses extends OpenAPIRoute {
  schema = {
    tags: ['Courses'],
    summary: 'Get all courses with aggregated feedback data',
    description:
      'Returns a list of all courses with their average rating and feedback count',
    request: {
      query: z.object({
        acronym: z.string().optional()
      })
    },
    responses: {
      '200': {
        description: 'List of courses with aggregated feedback data',
        content: {
          'application/json': {
            schema: CourseResponseSchema.array()
          }
        }
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    const db = getDb(env)

    const acronym = request.query.acronym as string | undefined
    const baseQuery = db
      .select({
        id: courses.id,
        name: courses.name,
        acronym: courses.acronym,
        url: courses.url,
        rating: sql<number>`ifnull(avg(${feedback.rating}), 0)`.as('rating'),
        feedbackCount: sql<number>`ifnull(count(${feedback.id}), 0)`.as(
          'feedback_count'
        ),
        period: courses.period
      })
      .from(courses)
      .leftJoin(
        feedback,
        and(eq(courses.id, feedback.courseId), isNotNull(feedback.approvedAt))
      )
      .groupBy(courses.id)

    const query = acronym
      ? baseQuery.where(sql`lower(${courses.acronym}) = lower(${acronym})`)
      : baseQuery

    const result = await query

    return Response.json(result)
  }
}
