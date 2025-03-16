import { z } from "zod"

const createValidation=z.object({
    name:z.string(),
    email:z.email(),
    password:z.number()
   })
   export const userValidation={
    createValidation
   }