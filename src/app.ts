import { mealsRoutes } from './routes/meals'
import { userRoutes } from './routes/users'
import fastify from 'fastify'

export const app = fastify()

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'users/:id/meals',
})
