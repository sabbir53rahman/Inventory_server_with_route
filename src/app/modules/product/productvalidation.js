import { z } from "zod"

const createValidation=z.object({
    name:z.string(),
    price:z.number(),
    description:z.string(),
    quantity:z.number(), 
    //category:z.string().optional().nullable(),
    //isMarried:z.boolean().default(false),
    //favColor:z.enum([1,"blue","green"])
   })
   export const productValidation={
    createValidation
   }