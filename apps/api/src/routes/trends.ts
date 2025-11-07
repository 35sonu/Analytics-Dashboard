import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// GET /api/invoice-trends - Returns monthly invoice trends
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        invoiceDate: true,
        totalAmount: true,
      },
    });

    // Group by month
    const monthlyData: { [key: string]: { count: number; total: number } } = {};

    invoices.forEach((invoice) => {
      const monthKey = new Date(invoice.invoiceDate).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { count: 0, total: 0 };
      }
      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].total += invoice.totalAmount;
    });

    const result = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        count: data.count,
        total: data.total,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    res.status(500).json({ error: 'Failed to fetch invoice trends' });
  }
});

// GET /api/category-spend - Returns spend by category
router.get('/category', async (_req: Request, res: Response) => {
  try {
    const categorySpend = await prisma.invoice.groupBy({
      by: ['category'],
      _sum: {
        totalAmount: true,
      },
      where: {
        category: {
          not: null,
        },
      },
    });

    const result = categorySpend.map((item) => ({
      category: item.category || 'Uncategorized',
      total: item._sum.totalAmount || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    res.status(500).json({ error: 'Failed to fetch category spend' });
  }
});

// GET /api/cash-outflow - Returns cash outflow forecast
router.get('/cash-outflow', async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const upcomingInvoices = await prisma.invoice.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: threeMonthsLater,
        },
        status: {
          in: ['pending', 'partial'],
        },
      },
      select: {
        dueDate: true,
        totalAmount: true,
      },
    });

    // Group by week
    const weeklyData: { [key: string]: number } = {};

    upcomingInvoices.forEach((invoice) => {
      if (invoice.dueDate) {
        const weekStart = new Date(invoice.dueDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().slice(0, 10);
        
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + invoice.totalAmount;
      }
    });

    const result = Object.entries(weeklyData)
      .map(([week, total]) => ({
        week,
        total,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    res.json(result);
  } catch (error) {
    console.error('Error fetching cash outflow:', error);
    res.status(500).json({ error: 'Failed to fetch cash outflow' });
  }
});

export default router;
