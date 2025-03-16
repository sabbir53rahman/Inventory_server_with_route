import { z } from "zod"

const createValidation=z.object({
    name:z.string(),
    email:z.string(),
    password:z.string()
   })
   export const userValidation={
    createValidation
   }