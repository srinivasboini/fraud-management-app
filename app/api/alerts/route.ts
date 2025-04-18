import { NextResponse } from 'next/server'
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*'
})

// Helper to run middleware
function runMiddleware(req: Request, res: Response, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) reject(result)
      resolve(result)
    })
  })
}

export async function GET(req: Request) {
  try {
    const targetUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/alerts`
    const authHeader = req.headers.get('authorization')
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'apikey': 'my-secret-key'
      }
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
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