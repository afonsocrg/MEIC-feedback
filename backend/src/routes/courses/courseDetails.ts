import { courses, feedback, getDb } from '@db'
import { OpenAPIRoute } from 'chanfana'
import { eq, sql } from 'drizzle-orm'
import { IRequest } from 'itty-router'
import { z } from 'zod'

const CourseDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  description: z.string(),
  url: z.string(),
  rating: z.number(),
  feedbackCount: z.number(),
  period: z.string(),
  evaluationMethod: z.string()
})

export class GetCourse extends OpenAPIRoute {
  schema = {
    tags: ['Courses'],
    summary: 'Get detailed information about a course',
    description:
      'Returns detailed information about a specific course including its average rating and feedback count',
    request: {
      params: z.object({
        id: z.number()
      })
    },
    responses: {
      '200': {
        description: 'Course details with aggregated feedback data',
        content: {
          'application/json': {
            schema: CourseDetailSchema
          }
        }
      },
      '404': {
        description: 'Course not found'
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    const db = getDb(env)
    const courseId = parseInt(request.params.id)

    const result = await db
      .select({
        id: courses.id,
        name: courses.name,
        acronym: courses.acronym,
        description: courses.description,
        url: courses.url,
        rating: sql<number>`ifnull(avg(${feedback.rating}), 0)`.as('rating'),
        feedbackCount: sql<number>`ifnull(count(${feedback.id}), 0)`.as(
          'feedback_count'
        ),
        period: courses.period,
        evaluationMethod: courses.evaluationMethod
      })
      .from(courses)
      .leftJoin(feedback, eq(courses.id, feedback.courseId))
      .where(eq(courses.id, courseId))
      .groupBy(courses.id)

    if (result.length === 0) {
      return Response.json({ error: 'Course not found' }, { status: 404 })
    }

    return Response.json(result[0])
  }
}
