'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"

interface Transaction {
  transactionId: string
  customerId: string
  accountId: string
  amount: number
  currency: string
  timestamp: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'SUSPICIOUS'
}

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        console.log('Token:', token) // Debug log
        
        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Response status:', response.status) // Debug log
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error response:', errorData) // Debug log
          throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Response data:', data) // Debug log
        setTransactions(data)
        setError(null)
      } catch (err) {
        console.error('Fetch error:', err) // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred while fetching transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [getToken])

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'SUSPICIOUS':
        return 'bg-purple-100 text-purple-800 border-purple-200'
    }
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
          Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.customerId}</TableCell>
                  <TableCell>{transaction.accountId}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: transaction.currency
                    }).format(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

