'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AlertsTab from "./components/AlertsTab"
import TransactionsTab from "./components/TransactionsTab"
import CustomersTab from "./components/CustomersTab"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { SignInButton, useUser, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function FraudManagementApp() {
  const [activeTab, setActiveTab] = useState('transactions')
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto p-4">
        <header className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Fraud Management Dashboard</h1>
            <p className="text-sm mt-2 text-primary-foreground/80">Monitor and manage potential fraudulent activities</p>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
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
            <CustomersTab />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

