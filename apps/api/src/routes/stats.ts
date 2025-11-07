import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/stats - Returns overview statistics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    // Total Spend (YTD)
    const totalSpend = await prisma.invoice.aggregate({
      where: {
        invoiceDate: {
          gte: yearStart,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Total Invoices Processed
    const totalInvoices = await prisma.invoice.count();

    // Documents Uploaded (assuming each invoice has a document)
    const documentsUploaded = await prisma.invoice.count({
      where: {
        documentUrl: {
          not: null,
        },
      },
    });

    // Average Invoice Value
    const avgInvoice = await prisma.invoice.aggregate({
      _avg: {
        totalAmount: true,
      },
    });

    res.json({
      totalSpend: totalSpend._sum.totalAmount || 0,
      totalInvoices,
      documentsUploaded,
      averageInvoiceValue: avgInvoice._avg.totalAmount || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
