import axios from 'axios';
import type {
  Stats,
  InvoiceTrend,
  VendorSpend,
  CategorySpend,
  CashOutflow,
  InvoicesResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const VANNA_URL = process.env.NEXT_PUBLIC_VANNA_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyticsApi = {
  // Get overview statistics
  getStats: async (): Promise<Stats> => {
    const { data } = await api.get('/api/stats');
    return data;
  },

  // Get invoice trends
  getInvoiceTrends: async (): Promise<InvoiceTrend[]> => {
    const { data } = await api.get('/api/invoice-trends');
    return data;
  },

  // Get top 10 vendors by spend
  getTopVendors: async (): Promise<VendorSpend[]> => {
    const { data } = await api.get('/api/vendors/top10');
    return data;
  },

  // Get spend by category
  getCategorySpend: async (): Promise<CategorySpend[]> => {
    const { data } = await api.get('/api/invoice-trends/category');
    return data;
  },

  // Get cash outflow forecast
  getCashOutflow: async (): Promise<CashOutflow[]> => {
    const { data } = await api.get('/api/invoice-trends/cash-outflow');
    return data;
  },

  // Get invoices with filters
  getInvoices: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<InvoicesResponse> => {
    const { data } = await api.get('/api/invoices', { params });
    return data;
  },

  // Chat with data
  chatWithData: async (query: string) => {
    const { data } = await api.post('/api/chat-with-data', { query });
    return data;
  },
};
