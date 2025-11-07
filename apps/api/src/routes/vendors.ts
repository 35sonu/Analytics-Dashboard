import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/vendors/top10 - Returns top 10 vendors by spend
router.get('/top10', async (_req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        invoices: {
          select: {
            totalAmount: true,
          },
        },
      },
    });

    const vendorSpend = vendors
      .map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        total: vendor.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
        invoiceCount: vendor.invoices.length,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    res.json(vendorSpend);
  } catch (error) {
    console.error('Error fetching top vendors:', error);
    res.status(500).json({ error: 'Failed to fetch top vendors' });
  }
});

// GET /api/vendors - Returns all vendors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });

    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

export default router;
