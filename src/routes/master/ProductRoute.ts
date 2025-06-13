import { Router } from 'express'
import ProductController from '../../controllers/master/ProductController'
import { authenticate, adminOnly } from '../../middleware/AuthMiddleware'

const router = Router()

// Public routes
router.get('/', ProductController.getAllProducts)

// Admin-only routes
router.post('/', authenticate, adminOnly, ProductController.createProduct)
router.put('/:id', authenticate, adminOnly, ProductController.updateProduct)
router.delete('/:id', authenticate, adminOnly, ProductController.deleteProduct)

export default router