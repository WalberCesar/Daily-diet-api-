/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlawares/check-exists-session-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/:id', async (request) => {
    const getIdSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getIdSchema.parse(request.params)
    const meal = await knex('meals')
      .select('*')
      .where('id', id)
      .then((meal) => {
        return meal[0]
      })

    return meal
  })

  app.post('/', async (request, reply) => {
    const mealBodySchema = z.object({
      meal_name: z.string(),
      description: z.string(),
      meal_hour: z.string(),
      is_in_diet: z.boolean(),
    })

    const { description, is_in_diet, meal_name, meal_hour } =
      mealBodySchema.parse(request.body)

    const { session_id } = request.cookies

    await knex('meals').insert({
      id: randomUUID(),
      session_id,
      description,
      meal_hour,
      is_in_diet,
      meal_name,
    })

    return reply.status(201).send()
  })

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getIdSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getIdSchema.parse(request.params)
      const { session_id } = request.cookies

      await knex('meals').delete('*').where({ id, session_id })

      return reply.status(201).send()
    },
  )

  app.patch(
    '/:id',
    { preHandler: [checkSessionIdExists] },

    async (request, reply) => {
      const updateMealBodySchema = z.object({
        meal_name: z.string(),
        description: z.string(),
        meal_hour: z.string(),
        is_in_diet: z.boolean(),
      })

      const { description, is_in_diet, meal_name, meal_hour } =
        updateMealBodySchema.parse(request.body)

      const getIdSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getIdSchema.parse(request.params)

      const { session_id } = request.cookies
      console.log(request.body)

      await knex('meals').where({ id, session_id }).update({
        description,
        is_in_diet,
        meal_hour,
        meal_name,
      })

      reply.status(201).send()
    },
  )
}
