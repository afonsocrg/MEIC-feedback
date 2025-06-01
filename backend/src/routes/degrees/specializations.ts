import { degrees, getDb, specializations } from '@db'
import { OpenAPIRoute } from 'chanfana'
import { eq, sql } from 'drizzle-orm'
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

export class GetDegreeSpecializations extends OpenAPIRoute {
  schema = {
    tags: ['Degrees'],
    summary: 'Get all specializations of the given degree',
    description: 'Returns a list of all specializations',
    request: {
      params: z.object({
        id: z.number()
      })
    },
    responses: {
      '200': {
        description: 'List of degrees with aggregated feedback data',
        content: {
          'application/json': {
            schema: DegreeResponseSchema.array()
          }
        }
      },
      '404': {
        description: 'Degree not found'
      }
    }
  }

  async handle(request: IRequest, env: any, context: any) {
    const db = getDb(env)

    const data = await this.getValidatedData<typeof this.schema>()

    const { id: degreeId } = data.params

    // Assert degree exists
    const degree = await db
      .select()
      .from(degrees)
      .where(eq(degrees.id, degreeId))
      .limit(1)
      .then(([degree]) => degree)

    if (!degree) {
      return Response.json({ error: 'Degree not found' }, { status: 404 })
    }

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
      .where(eq(specializations.degreeId, degreeId))

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
