import { Router } from 'express'
import { isvalid } from '../../middleware/Validation.middleware.js'
import { login, signup, createAdminAccount, deleteAdminAccount } from './Auth.controller.js'
import { signupschema, loginschema, createAdminAccountSchema } from './Auth.validation.js'
import { ErrorCatch } from '../../utils/ErrorCatch.js'
import { CheckAdmin } from '../../middleware/Role.middleware.js'

const router = Router()

// first Admin only or superadmin role
router.post('/register', isvalid(signupschema), ErrorCatch(signup))

// Login
router.post('/login', isvalid(loginschema), ErrorCatch(login))

//  creates WarehouseAdmin and BranchAdmin
router.post('/create-admin', CheckAdmin, isvalid(createAdminAccountSchema), ErrorCatch(createAdminAccount))

// Admin delete
router.delete('/delete-admin', CheckAdmin, ErrorCatch(deleteAdminAccount))

export default router
