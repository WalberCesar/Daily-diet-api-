/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable eqeqeq */
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

    var bestSequencyOfMeals = <object[]>[]
    var metrics = getAllMealsOfUser.reduce(
      (acc, meal) => {
        if (meal.is_in_diet == true) {
          acc.totalMealsInDiet++
          const { meal_name, description, meal_hour } = meal
          bestSequencyOfMeals.push({
            meal_name,
            description,
            meal_hour,
          })

          if (bestSequencyOfMeals.length > acc.bestSequency.length) {
            acc.bestSequency = bestSequencyOfMeals
          }
        } else {
          acc.totalMealsOutDiet++
          bestSequencyOfMeals = []
        }

        return acc
      },
      {
        totalMealsregistred: getAllMealsOfUser.length,
        totalMealsInDiet: 0,
        totalMealsOutDiet: 0,
        bestSequency: <object[]>[],
      },
    )

    const [user] = await knex('users')
      .select('name')
      .where('session_id', sessionId)

    return {
      user,
      metrics,
    }
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
