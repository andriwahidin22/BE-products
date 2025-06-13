import { Router } from 'express'
import authRoutes from './auth/AuthRoute'
import productRoutes from './master/ProductRoute'

const router = Router()

// Auth routes
router.use('/auth', authRoutes)

// Product routes
router.use('/products', productRoutes)

export default router