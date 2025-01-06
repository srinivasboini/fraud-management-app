'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TransactionsTab from './components/TransactionsTab'
import CustomerTab from './components/CustomerTab'
import AlertsTab from './components/AlertsTab'

export default function FraudManagementApp() {
  const [activeTab, setActiveTab] = useState('transactions')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-4">
        <header className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Fraud Management Dashboard</h1>
          <p className="text-sm mt-2 text-primary-foreground/80">Monitor and manage potential fraudulent activities</p>
        </header>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-background rounded-lg shadow-md p-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="transactions" className="text-lg">Transactions</TabsTrigger>
            <TabsTrigger value="customers" className="text-lg">Customers</TabsTrigger>
            <TabsTrigger value="alerts" className="text-lg">Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>
          <TabsContent value="customers">
            <CustomerTab />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

