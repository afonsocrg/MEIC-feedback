import { degrees, getDb } from '@db'
import { courses } from '@db/schema/course'
import { OpenAPIRoute } from 'chanfana'
import { eq } from 'drizzle-orm'
import { IRequest } from 'itty-router'
import { z } from 'zod'

const DegreeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  url: z.string(),
  rating: z.number(),
  feedbackCount: z.number(),
  period: z.string()
})

export class GetDegrees extends OpenAPIRoute {
  schema = {
    tags: ['Degrees'],
    summary: 'Get all degrees with aggregated feedback data',
    description:
      'Returns a list of all courses with their average rating and feedback count',
    // request: {
    //   query: z.object({
    //     acronym: z.string().optional(),
    //     degreeId: z.number().optional()
    //   })
    // },
    responses: {
      '200': {
        description: 'List of degrees with aggregated feedback data',
        content: {
          'application/json': {
            schema: DegreeResponseSchema.array()
          }
        }
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    const db = getDb(env)
    const { onlyWithCourses = true } = request.query

    const baseQuery = db
      .select({
        id: degrees.id,
        externalId: degrees.externalId,
        type: degrees.type,
        name: degrees.name,
        acronym: degrees.acronym
      })
      .from(degrees)

    const result = onlyWithCourses
      ? await baseQuery
          .innerJoin(courses, eq(courses.degreeId, degrees.id))
          .groupBy(degrees.id)
      : await baseQuery

    return Response.json(result)
  }
}
