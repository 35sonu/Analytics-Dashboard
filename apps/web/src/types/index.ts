export interface Stats {
  totalSpend: number;
  totalInvoices: number;
  documentsUploaded: number;
  averageInvoiceValue: number;
}

export interface InvoiceTrend {
  month: string;
  count: number;
  total: number;
}

export interface VendorSpend {
  id: string;
  name: string;
  total: number;
  invoiceCount: number;
}

export interface CategorySpend {
  category: string;
  total: number;
}

export interface CashOutflow {
  week: string;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  totalAmount: number;
  status: string;
  category: string | null;
  vendor: {
    id: string;
    name: string;
  };
}

export interface InvoicesResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
