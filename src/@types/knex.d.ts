// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* 
- Quantidade total de refeições registradas
- Quantidade total de refeições dentro da dieta
- Quantidade total de refeições fora da dieta
- Melhor sequência de refeições dentro da dieta
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      metrics: {
        totalMealsRegistred: number
        totalMealsInDiet: number
        totalMealsOutDiet: number
        bestSequencyMeals: string[]
      } | null

      meals:
        | {
            meal_name: string
            description: string
            created_at: string
            isInDiet: boolean
          }[]
        | null
    }
  }
}
