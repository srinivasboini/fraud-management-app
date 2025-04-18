import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
const mockAlerts = [
  {
    alertId: "a1b2c3d4e",
    transactionId: "f5g6h7i8j",
    severity: "HIGH",
    status: "NEW",
    assignedTo: "Agent xyz12",
    createdAt: "2024-04-18T10:30:00Z",
    description: "Potential fraud detected: unusual transaction pattern detected",
    fraudType: "Transaction Fraud"
  },
  {
    alertId: "k9l8m7n6o",
    transactionId: "p5q4r3s2t",
    severity: "MEDIUM",
    status: "ASSIGNED",
    assignedTo: "Agent abc34",
    createdAt: "2024-04-18T09:15:00Z",
    description: "Potential fraud detected: multiple failed login attempts",
    fraudType: "Account Takeover"
  },
  {
    alertId: "u1v2w3x4y",
    transactionId: "z5a6b7c8d",
    severity: "LOW",
    status: "IN_PROGRESS",
    assignedTo: "Agent def56",
    createdAt: "2024-04-18T08:45:00Z",
    description: "Potential fraud detected: suspicious IP address",
    fraudType: "Identity Theft"
  }
]

export async function GET(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    // In a real app, you would fetch alerts from your database here
    // For now, we'll return mock data
    return NextResponse.json(mockAlerts, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    console.error("[ALERTS_GET]", error)
    return new NextResponse("Internal Error", { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
} 