import { mealsRoutes } from './routes/meals'
import { userRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import fastify from 'fastify'

export const app = fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})
