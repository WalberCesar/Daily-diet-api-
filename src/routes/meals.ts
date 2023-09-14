import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const mealBodySchema = z.object({
      meal_name: z.string(),
      description: z.string(),
      created_at: z.string(),
      isInDiet: z.boolean(),
    })

    const meal = mealBodySchema.parse(request.body)

    const getParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getParamsSchema.parse(request.params)

    const [user] = await await knex('users').select('*').where('id', id)

    return reply.status(201).send()
  })
}
