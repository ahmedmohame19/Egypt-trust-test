import joi from 'joi'

export const createBranchSchema = joi.object({
  name: joi.string().min(3).required(),
  location: joi.string().min(5).required(),
  phoneNumber: joi.string().required(),
  email: joi.string().email().required(),
  branchAdmin: joi.string().required()
})

export const updateBranchSchema = joi.object({
  name: joi.string().min(3),
  location: joi.string().min(5),
  phoneNumber: joi.string(),
  email: joi.string().email(),
  branchAdmin: joi.string(),
  isActive: joi.boolean()
})

export const branchIdSchema = joi.object({
  id: joi.string().required()
}) 