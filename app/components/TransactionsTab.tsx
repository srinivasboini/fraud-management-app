'use client'

import { useState, useEffect } from 'react'
import DataTable from './DataTable'
import { fetchTransactions } from '../services/mockDataService'

const columns = [
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'customerId', label: 'Customer ID' },
  { key: 'accountId', label: 'Account ID' },
  { key: 'amount', label: 'Amount' },
  { key: 'currency', label: 'Currency' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'status', label: 'Status' },
]

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchTransactions().then(setTransactions)
  }, [])

  const handleAction = (action: string, items: any[]) => {
    console.log(`Action ${action} performed on:`, items)
    // Implement actual action logic here
  }

  return (
    <div>
      <DataTable data={transactions} columns={columns} onAction={handleAction} title="Transactions" />
    </div>
  )
}

