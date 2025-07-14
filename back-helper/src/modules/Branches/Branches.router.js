import { Router } from 'express'
import { isvalid } from '../../middleware/Validation.middleware.js'
import { ErrorCatch } from '../../utils/ErrorCatch.js'
import { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch, getBranchInventory, getBranchRequestsHistory, getBranchAdmins } from './Branches.controller.js'
import { createBranchSchema, updateBranchSchema, branchIdSchema } from './Branches.validation.js'
import { CheckAdmin, CheckAdminOrBranchAdmin } from '../../middleware/Role.middleware.js'

const router = Router()

// Create branch Admin only
router.post('/', CheckAdmin, isvalid(createBranchSchema), ErrorCatch(createBranch)
)
// for drop list to assign branch admin
router.get('/BranchAdmins', CheckAdmin, ErrorCatch(getBranchAdmins))

// Get all branches
router.get('/', ErrorCatch(getAllBranches))

// Get branch by id
router.get('/:id', isvalid(branchIdSchema), ErrorCatch(getBranchById)
)

// Update branch
router.put('/:id', CheckAdmin, isvalid(updateBranchSchema), ErrorCatch(updateBranch)
)

// Delete branch 
router.delete('/:id', CheckAdmin, isvalid(branchIdSchema), ErrorCatch(deleteBranch)
)

// Get branch inventory
router.get('/:id/inventory', CheckAdminOrBranchAdmin, isvalid(branchIdSchema), ErrorCatch(getBranchInventory)
)

// Get branch requests history
router.get('/:id/requests-history', CheckAdminOrBranchAdmin, isvalid(branchIdSchema), ErrorCatch(getBranchRequestsHistory)
)

export default router
