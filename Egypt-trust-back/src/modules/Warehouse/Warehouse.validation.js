import joi from 'joi'

export const createWarehouseSchema = joi.object({
  name: joi.string().min(3).required(),
  location: joi.string().min(5).required(),
  warehouseAdmin: joi.string().required()
})

export const updateWarehouseSchema = joi.object({
  id: joi.string().required(),
  name: joi.string().min(3).optional(),
  location: joi.string().min(5).optional(),
  warehouseAdmin: joi.string().optional()
})

export const warehouseIdSchema = joi.object({
  id: joi.string().required()
})

export const paginationSchema = joi.object({
  page: joi.number().integer().min(1).optional(),
  limit: joi.number().integer().min(1).max(100).optional(),
  search: joi.string().min(1).optional()
})
