'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { analyticsApi } from '@/lib/api';
import { Send, Loader2, Code, Table as TableIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  error?: string;
}

export function ChatWithData() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hi! I'm your AI analytics assistant. Ask me anything about your invoice data. For example:\n\n• What's the total spend in the last 90 days?\n• List top 5 vendors by spend\n• Show overdue invoices as of today\n• What's the average invoice value?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await analyticsApi.chatWithData(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.error
          ? `I encountered an error: ${response.error}`
          : 'Here are the results for your query:',
        sql: response.sql,
        results: response.results,
        error: response.error,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        error: error.message,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = (results: any[]) => {
    if (!results || results.length === 0) {
      return <div className="text-sm text-muted-foreground">No results found.</div>;
    }

    const columns = Object.keys(results[0]);

    return (
      <div className="border rounded-md overflow-auto max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col} className="font-semibold">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col}>{formatCellValue(row[col])}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Chat with Your Data</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask questions in natural language and get instant insights from your invoice data.
          </p>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {/* SQL Display */}
                  {message.sql && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <Code className="h-3 w-3" />
                        Generated SQL
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {message.sql}
                      </pre>
                    </div>
                  )}

                  {/* Results Display */}
                  {message.results && message.results.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <TableIcon className="h-3 w-3" />
                        Results ({message.results.length} rows)
                      </div>
                      {renderResults(message.results)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your data..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>

          {/* Example Queries */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "What's the total spend in the last 90 days?",
                'List top 5 vendors by spend',
                'Show overdue invoices',
                'Average invoice value by category',
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(example)}
                  disabled={loading}
                  className="text-xs"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
