'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ViewDetailsModal } from "./ViewDetailsModal"

interface Alert {
  alertId: string
  transactionId: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'CLOSED'
  assignedTo: string
  createdAt: string
  description: string
  fraudType: string
}

export default function AlertsTab() {
  const { getToken } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = await getToken()
        const response = await fetch('/api/alerts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch alerts')
        }

        const data = await response.json()
        setAlerts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [getToken])

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CLOSED':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const handleCheckboxChange = (alertId: string) => {
    setSelectedAlerts(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    )
  }

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsModalOpen(true)
  }

  const totalPages = Math.ceil(alerts.length / itemsPerPage)
  const currentAlerts = alerts.slice(
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
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedAlerts.length === currentAlerts.length}
                    onCheckedChange={() => {
                      if (selectedAlerts.length === currentAlerts.length) {
                        setSelectedAlerts([])
                      } else {
                        setSelectedAlerts(currentAlerts.map(alert => alert.alertId))
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Alert ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAlerts.map((alert) => (
                <TableRow key={alert.alertId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAlerts.includes(alert.alertId)}
                      onCheckedChange={() => handleCheckboxChange(alert.alertId)}
                    />
                  </TableCell>
                  <TableCell>{alert.alertId}</TableCell>
                  <TableCell>{alert.transactionId}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.assignedTo}</TableCell>
                  <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(alert)}
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
            {selectedAlerts.length} of {alerts.length} row(s) selected.
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
        data={selectedAlert}
      />
    </div>
  )
}

