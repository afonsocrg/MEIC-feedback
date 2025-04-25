import { getDb, specializations } from '@db'
import { OpenAPIRoute } from 'chanfana'
import { sql } from 'drizzle-orm'
import { IRequest } from 'itty-router'
import { z } from 'zod'

const SpecializationResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  courseIds: z.array(z.number())
})

export class GetSpecializations extends OpenAPIRoute {
  schema = {
    tags: ['Specializations'],
    summary: 'Get all specializations with their associated course IDs',
    description:
      'Returns a list of all specializations and the courses that belong to each one',
    responses: {
      '200': {
        description: 'List of specializations with their course IDs',
        content: {
          'application/json': {
            schema: SpecializationResponseSchema.array()
          }
        }
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    const db = getDb(env)

    const result = await db
      .select({
        id: specializations.id,
        name: specializations.name,
        courseIds: sql<string>`(
          SELECT group_concat(course_id)
          FROM course_specializations
          WHERE specialization_id = specializations.id
        )`.as('course_ids')
      })
      .from(specializations)

    // Convert the comma-separated string of IDs to an array of numbers
    const formattedResult = result.map((specialization) => ({
      ...specialization,
      courseIds: specialization.courseIds
        ? specialization.courseIds.split(',').map(Number)
        : []
    }))

    return Response.json(formattedResult)
  }
}
