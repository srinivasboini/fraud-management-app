'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye } from "lucide-react"
import { ViewDetailsModal } from "./ViewDetailsModal"

interface Transaction {
  transactionId: string
  customerId: string
  amount: number
  currency: string
  status: string | object
  timestamp: string
  paymentMethod: string | object
  description?: string | object
}

export default function TransactionsTab() {
  const { getToken } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await getToken()
        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }

        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [getToken])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const handleCheckboxChange = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleViewDetails = (transaction: Transaction) => {
    const sanitizedTransaction = {
      ...transaction,
      description: typeof transaction.description === 'object' 
        ? JSON.stringify(transaction.description) 
        : transaction.description
    }
    setSelectedTransaction(sanitizedTransaction)
    setIsModalOpen(true)
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="flex-none">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedTransactions.length === currentTransactions.length}
                    onCheckedChange={() => {
                      if (selectedTransactions.length === currentTransactions.length) {
                        setSelectedTransactions([])
                      } else {
                        setSelectedTransactions(currentTransactions.map(t => t.transactionId))
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.transactionId)}
                      onCheckedChange={() => handleCheckboxChange(transaction.transactionId)}
                    />
                  </TableCell>
                  <TableCell>{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.customerId}</TableCell>
                  <TableCell>
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(typeof transaction.status === 'object' ? JSON.stringify(transaction.status) : transaction.status as string)}>
                      {typeof transaction.status === 'object' 
                        ? JSON.stringify(transaction.status) 
                        : transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {typeof transaction.paymentMethod === 'object' 
                      ? JSON.stringify(transaction.paymentMethod) 
                      : transaction.paymentMethod}
                  </TableCell>
                  <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex-none flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedTransactions.length} of {transactions.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <ViewDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedTransaction}
      />
    </div>
  )
}

