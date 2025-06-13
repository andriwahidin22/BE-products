import { Router } from 'express'
import AuthController from '../../controllers/auth/AuthController'
import { authenticate } from '../../middleware/AuthMiddleware'

const router = Router()

// Public routes
router.post('/login', AuthController.login)

// Protected routes
router.post('/logout', authenticate, AuthController.logout)
router.get('/profile', authenticate, AuthController.profile)

export default router