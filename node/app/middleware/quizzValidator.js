import { Joi } from "express-validation"

export const validateQuizz = {

    body: Joi.object({
        title: Joi.string().required(),
        questions: Joi.object().min(1)
      })

      
}