import { Joi } from "express-validation"

export const validateUser = {

    body: Joi.object({        
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        confPassword: Joi.string().required().equal(Joi.ref('password')),
      })

      
}