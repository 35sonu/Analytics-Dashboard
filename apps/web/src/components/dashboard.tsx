'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from './analytics-dashboard';
import { ChatWithData } from './chat-with-data';
import { BarChart3, MessageSquare, FileText, FolderOpen, Users, Settings } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gradient-to-b from-purple-600 to-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Buchhaltung</h1>
              <p className="text-xs text-purple-200">12 members</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-purple-200 mb-3 px-3">GENERAL</div>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-purple-700 text-white'
                : 'text-purple-100 hover:bg-purple-700/50'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-700/50 transition-colors">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Invoice</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-700/50 transition-colors">
            <FolderOpen className="h-5 w-5" />
            <span className="font-medium">Other files</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-700/50 transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">Departments</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-700/50 transition-colors">
            <Users className="h-5 w-5" />
            <span className="font-medium">Users</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-100 hover:bg-purple-700/50 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === 'chat'
                ? 'bg-purple-700 text-white'
                : 'text-purple-100 hover:bg-purple-700/50'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Chat with Data</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="analytics" className="m-0 p-0">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="chat" className="m-0 p-6">
            <ChatWithData />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
