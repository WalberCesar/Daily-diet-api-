import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
  app.get('/:id/metrics', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)
    const [getSessionId] = await knex('users')
      .select('session_id')
      .where('id', id)

    const sessionId = getSessionId.session_id

    const getAllMealsOfUser = await knex('meals')
      .select('*')
      .where('session_id', sessionId)
    const totalMealsRegistred = getAllMealsOfUser.length

    const metrics = getAllMealsOfUser.map((meal) => {
      let totalMealsInDiet = 0
      const totalMealsOutDiet = 0
      if (meal.is_in_diet === true) {
        return (totalMealsInDiet = totalMealsInDiet + 1)
      } else {
        return totalMealsInDiet
      }
    })

    console.log(metrics)
  })

  app.get('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)
    const [getSessionId] = await knex('users')
      .select('session_id')
      .where('id', id)

    const sessionId = getSessionId.session_id

    const getAllMealsOfUser = await knex('meals')
      .select('*')
      .where('session_id', sessionId)

    if (getAllMealsOfUser.length <= 0) {
      return reply.send({
        message: 'Não há refeições cadastradas',
      })
    } else {
      return getAllMealsOfUser
    }
  })

  app.get('/', async () => {
    const table = await knex('users').select('')
    return {
      table,
    }
  })

  app.delete('/', async (request, reply) => {
    await knex('users').delete('*')
    return reply.status(201).send()
  })

  // app.get('/:id', async (request, reply) => {
  //   const getUserParamsSchema = z.object({
  //     id: z.string().uuid(),
  //   })

  //   const { id } = getUserParamsSchema.parse(request.params)

  //   const user = await knex('users').select('*').where('id', id)

  //   return user
  // })

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

    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('session_id', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 7, // 7dias
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      email,
      metrics,
    })

    return reply.status(201).send()
  })
}
