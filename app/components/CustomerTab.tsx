'use client'

import { useState, useEffect } from 'react'
import DataTable from './DataTable'
import { fetchCustomers } from '../services/mockDataService'

const columns = [
  { key: 'customerId', label: 'Customer ID' },
  { key: 'name', label: 'Name' },
  { key: 'riskProfile', label: 'Risk Profile' },
  { key: 'kycStatus', label: 'KYC Status' },
  { key: 'accounts', label: 'Accounts' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'lastUpdated', label: 'Last Updated' },
]

export default function CustomerTab() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    fetchCustomers().then(setCustomers)
  }, [])

  const handleAction = (action: string, items: any[]) => {
    console.log(`Action ${action} performed on:`, items)
    // Implement actual action logic here
  }

  return (
    <div>
      <DataTable data={customers} columns={columns} onAction={handleAction} title="Customers" />
    </div>
  )
}

