import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../../middleware/AuthMiddleware';

const prisma = new PrismaClient();

class ProductController {
  async getAllProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10, category } = req.query;
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      const whereClause: any = { status: 'active' };
      if (category) {
        whereClause.category = category as string;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: whereClause,
          skip,
          take: limitNumber,
        }),
        prisma.product.count({ where: whereClause }),
      ]);

      res.json({
        products,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber),
        },
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      // Pastikan req.user ada
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { name, description, category, price, features, image } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          price,
          features,
          image,
          createdBy: req.user.id,
        },
      });

      res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      // Pastikan req.user ada
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      const updateData = req.body;

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      // Pastikan req.user ada
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;

      // Soft delete (update status)
      await prisma.product.update({
        where: { id: parseInt(id) },
        data: { status: 'deleted' },
      });

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default new ProductController();