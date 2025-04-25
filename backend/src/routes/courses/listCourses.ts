import { courses, feedback, getDb } from '@db'
import { OpenAPIRoute } from 'chanfana'
import { eq, sql } from 'drizzle-orm'
import { IRequest } from 'itty-router'
import { z } from 'zod'

const CourseResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  url: z.string(),
  rating: z.number(),
  feedbackCount: z.number()
})

export class GetCourses extends OpenAPIRoute {
  schema = {
    tags: ['Courses'],
    summary: 'Get all courses with aggregated feedback data',
    description:
      'Returns a list of all courses with their average rating and feedback count',
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

    const result = await db
      .select({
        id: courses.id,
        name: courses.name,
        acronym: courses.acronym,
        url: courses.url,
        rating: sql<number>`ifnull(avg(${feedback.rating}), 0)`.as('rating'),
        feedbackCount: sql<number>`ifnull(count(${feedback.id}), 0)`.as(
          'feedback_count'
        )
      })
      .from(courses)
      .leftJoin(feedback, eq(courses.id, feedback.courseId))
      .groupBy(courses.id)

    return Response.json(result)
  }
}
