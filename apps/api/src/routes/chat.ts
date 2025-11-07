import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const VANNA_API_URL = process.env.VANNA_API_BASE_URL || 'http://localhost:8000';

// POST /api/chat-with-data - Chat with data using Vanna AI
router.post('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Forward request to Vanna AI service
    const response = await axios.post(`${VANNA_API_URL}/api/query`, {
      question: query,
    });

    res.json({
      query,
      sql: response.data.sql,
      results: response.data.results,
      error: response.data.error,
    });
  } catch (error: any) {
    console.error('Error processing chat query:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error || 'Failed to process query',
      });
    }

    res.status(500).json({ error: 'Failed to connect to AI service' });
  }
});

export default router;
