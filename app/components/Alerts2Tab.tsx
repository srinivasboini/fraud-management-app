'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle, Clock, User, CreditCard, ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AlertData {
  alertId: string
  transactionId: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'CLOSED'
  assignedTo: string
  createdAt: string
  description: string
  fraudType: 'Identity Theft' | 'Account Takeover' | 'Transaction Fraud'
}

export default function Alerts2Tab() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        console.log('Token:', token) // Debug log
        
        const response = await fetch('http://localhost:8080/api/v1/alerts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('Response status:', response.status) // Debug log
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error response:', errorData) // Debug log
          throw new Error(`Failed to fetch alerts: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Response data:', data) // Debug log
        setAlerts(data)
        setError(null)
      } catch (err) {
        console.error('Fetch error:', err) // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred while fetching alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [getToken])

  const getSeverityColor = (severity: AlertData['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusColor = (status: AlertData['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFraudTypeIcon = (fraudType: AlertData['fraudType']) => {
    switch (fraudType) {
      case 'Identity Theft':
        return <User className="h-4 w-4" />
      case 'Account Takeover':
        return <ShieldAlert className="h-4 w-4" />
      case 'Transaction Fraud':
        return <CreditCard className="h-4 w-4" />
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2 text-sm">
            Please check the console for more details.
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Authentication Required Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {alerts.map((alert) => (
              <div 
                key={alert.alertId} 
                className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getFraudTypeIcon(alert.fraudType)}
                      <h3 className="text-lg font-semibold">{alert.fraudType}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <Badge className={cn("border", getSeverityColor(alert.severity))}>
                    {alert.severity}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{alert.assignedTo}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("border", getStatusColor(alert.status))}>
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Transaction ID: {alert.transactionId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 