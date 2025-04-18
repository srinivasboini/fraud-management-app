'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"
import { User, Shield, CreditCard } from "lucide-react"

interface Customer {
  customerId: string
  name: string
  riskProfile: 'Low' | 'Medium' | 'High'
  kycStatus: 'Verified' | 'Pending' | 'Failed'
  accounts: string[]
  createdAt: string
  lastUpdated: string
}

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        console.log('Token:', token) // Debug log 
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': 'my-secret-key'
          }
        })

        console.log('Response status:', response.status) // Debug log
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error response:', errorData) // Debug log
          throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Response data:', data) // Debug log
        setCustomers(data)
        setError(null)
      } catch (err) {
        console.error('Fetch error:', err) // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred while fetching customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [getToken])

  const getRiskProfileColor = (riskProfile: Customer['riskProfile']) => {
    switch (riskProfile) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getKycStatusColor = (kycStatus: Customer['kycStatus']) => {
    switch (kycStatus) {
      case 'Verified':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getAccountTypeIcon = (accountId: string) => {
    // Simple logic to determine account type based on ID pattern
    if (accountId.startsWith('SAV')) {
      return <Shield className="h-4 w-4 text-blue-500" />
    } else if (accountId.startsWith('CHK')) {
      return <CreditCard className="h-4 w-4 text-purple-500" />
    }
    return <User className="h-4 w-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
              <div className="mt-2 text-sm">
                Please check the console for more details.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="h-6 w-6 text-primary" />
          Customer List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Profile</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">{customer.customerId}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <Badge className={getRiskProfileColor(customer.riskProfile)}>
                      {customer.riskProfile}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getKycStatusColor(customer.kycStatus)}>
                      {customer.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {customer.accounts.map((account) => (
                        <div key={account} className="flex items-center gap-2">
                          {getAccountTypeIcon(account)}
                          <span className="text-sm text-muted-foreground">
                            {account}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(customer.lastUpdated).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 