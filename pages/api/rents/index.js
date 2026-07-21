const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const payments = await prisma.rent.findMany({ include: { tenant: true }, orderBy: { paidAt: 'desc' } })
    return res.json(payments)
  }

  if (req.method === 'POST') {
    const { tenantId, amount, month } = req.body
    const payment = await prisma.rent.create({ data: { tenantId: Number(tenantId), amount: Number(amount), month } })
    return res.json(payment)
  }

  res.status(405).end()
}
