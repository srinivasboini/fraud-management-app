'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"
import { User, Shield, CreditCard, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ViewDetailsModal } from "./ViewDetailsModal"

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
  const { getToken } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = await getToken()
        const response = await fetch('/api/customers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch customers')
        }

        const data = await response.json()
        setCustomers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
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

  const handleCheckboxChange = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const currentCustomers = customers.slice(
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
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedCustomers.length === currentCustomers.length}
                    onCheckedChange={() => {
                      if (selectedCustomers.length === currentCustomers.length) {
                        setSelectedCustomers([])
                      } else {
                        setSelectedCustomers(currentCustomers.map(c => c.customerId))
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Profile</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.customerId)}
                      onCheckedChange={() => handleCheckboxChange(customer.customerId)}
                    />
                  </TableCell>
                  <TableCell>{customer.customerId}</TableCell>
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
                  <TableCell>{customer.accounts.length}</TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(customer)}
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
            {selectedCustomers.length} of {customers.length} row(s) selected.
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
        data={selectedCustomer}
      />
    </div>
  )
} 