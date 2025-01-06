const generateMockData = (count: number, generator: () => any) => {
  return Array.from({ length: count }, generator)
}

const generateTransaction = () => ({
  transactionId: Math.random().toString(36).substr(2, 9),
  customerId: Math.random().toString(36).substr(2, 9),
  accountId: Math.random().toString(36).substr(2, 9),
  amount: (Math.random() * 10000).toFixed(2),
  currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
  timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)]
})

const generateCustomer = () => ({
  customerId: Math.random().toString(36).substr(2, 9),
  name: `Customer ${Math.random().toString(36).substr(2, 5)}`,
  riskProfile: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  kycStatus: ['Verified', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
  accounts: [Math.random().toString(36).substr(2, 9), Math.random().toString(36).substr(2, 9)],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  lastUpdated: new Date(Date.now() - Math.random() * 1000000000).toISOString()
})

const generateAlert = () => ({
  alertId: Math.random().toString(36).substr(2, 9),
  transactionId: Math.random().toString(36).substr(2, 9),
  severity: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
  status: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'CLOSED'][Math.floor(Math.random() * 4)],
  assignedTo: `Agent ${Math.random().toString(36).substr(2, 5)}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  description: `Potential fraud detected: ${Math.random().toString(36).substr(2, 20)}`,
  fraudType: ['Identity Theft', 'Account Takeover', 'Transaction Fraud'][Math.floor(Math.random() * 3)]
})

export const fetchTransactions = () => 
  Promise.resolve(generateMockData(20, generateTransaction))

export const fetchCustomers = () => 
  Promise.resolve(generateMockData(20, generateCustomer))

export const fetchAlerts = () => 
  Promise.resolve(generateMockData(20, generateAlert))

