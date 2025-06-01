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
  period: z.array(z.string())
})

export class GetCourses extends OpenAPIRoute {
  schema = {
    tags: ['Courses'],
    summary: 'Get all courses with aggregated feedback data',
    description:
      'Returns a list of all courses with their average rating and feedback count',
    request: {
      query: z.object({
        acronym: z.string().optional(),
        degreeId: z.number().optional()
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

    const data = await this.getValidatedData<typeof this.schema>()
    const {
      query: { acronym, degreeId }
    } = data

    const conditions = []
    if (acronym) {
      conditions.push(sql`lower(${courses.acronym}) = lower(${acronym})`)
    }

    if (degreeId) {
      conditions.push(eq(courses.degreeId, degreeId))
    }

    // Base query with feedback join
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
        degreeId: courses.degreeId,
        period: courses.period
      })
      .from(courses)
      .leftJoin(
        feedback,
        and(eq(courses.id, feedback.courseId), isNotNull(feedback.approvedAt))
      )
      .groupBy(courses.id)

    const query = baseQuery.where(
      conditions.length > 0 ? and(...conditions) : undefined
    )

    const result = await query

    return Response.json(result)
  }
}
