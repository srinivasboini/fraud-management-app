'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AlertsTab from "./components/AlertsTab"
import TransactionsTab from "./components/TransactionsTab"
import CustomersTab from "./components/CustomersTab"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

export default function Home() {
  const [activeTab, setActiveTab] = useState('transactions')
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
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
            <UserButton afterSignOutUrl="/sign-in" />
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

