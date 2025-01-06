'use client'

import { useState, useEffect } from 'react'
import DataTable from './DataTable'
import { fetchAlerts } from '../services/mockDataService'

const columns = [
  { key: 'alertId', label: 'Alert ID' },
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'severity', label: 'Severity' },
  { key: 'status', label: 'Status' },
  { key: 'assignedTo', label: 'Assigned To' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'description', label: 'Description' },
  { key: 'fraudType', label: 'Fraud Type' },
]

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchAlerts().then(setAlerts)
  }, [])

  const handleAction = (action: string, items: any[]) => {
    console.log(`Action ${action} performed on:`, items)
    // Implement actual action logic here
  }

  return (
    <div>
      <DataTable data={alerts} columns={columns} onAction={handleAction} title="Alerts" />
    </div>
  )
}

