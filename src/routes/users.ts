import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const table = await knex('users').select('')
    console.log(table[8].metrics)
    return {
      table,
    }
  })

  app.get('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await knex('users').select('*').where('id', id)

    return user
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      metrics: z
        .object({
          totalMealsRegistred: z.number(),
          totalMealsInDiet: z.number(),
          totalMealsOutDiet: z.number(),
          bestSequencyMeals: z.string().array(),
        })
        .nullable(),
    })

    const { email, name, metrics } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      metrics,
    })

    return reply.status(201).send()
  })
}
