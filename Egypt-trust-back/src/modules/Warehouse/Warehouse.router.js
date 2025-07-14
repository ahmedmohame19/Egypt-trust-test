import { Router } from 'express'
import { isvalid } from '../../middleware/Validation.middleware.js'
import { ErrorCatch } from '../../utils/ErrorCatch.js'
import { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse, getWarehouseAdmins } from './Warehouse.controller.js'
import { createWarehouseSchema, updateWarehouseSchema, warehouseIdSchema, paginationSchema } from './Warehouse.validation.js'
import { CheckAdmin } from '../../middleware/Role.middleware.js'

const router = Router()

// Create warehouse 
router.post('/', CheckAdmin, isvalid(createWarehouseSchema), ErrorCatch(createWarehouse))

// for drop list to assign warehouse admin
router.get('/WarehouseAdmins', CheckAdmin, isvalid(paginationSchema), ErrorCatch(getWarehouseAdmins))

// Get all warehouses
router.get('/', ErrorCatch(getAllWarehouses))

// Get warehouse by id
router.get('/:id', isvalid(warehouseIdSchema), ErrorCatch(getWarehouseById))

// Update warehouse 
router.put('/:id', CheckAdmin, isvalid(updateWarehouseSchema), ErrorCatch(updateWarehouse))

// Delete warehouse 
router.delete('/:id', CheckAdmin, isvalid(warehouseIdSchema), ErrorCatch(deleteWarehouse))

export default router
