import joi from 'joi'

export const signupschema = joi.object({
  name: joi.string().min(4).required(),
  email: joi.string().email().required(),
  password: joi.string().required()
})

// loginschema
export const loginschema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})

// createAdminAccountSchema
export const createAdminAccountSchema = joi.object({
  name: joi.string().min(4).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid('WarehouseAdmin', 'BranchAdmin').required(),
  phoneNumber: joi.string().allow(null, '').optional()
})
