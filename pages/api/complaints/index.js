const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const complaints = await prisma.complaint.findMany({ include: { tenant: true, room: true }, orderBy: { createdAt: 'desc' } })
    return res.json(complaints)
  }

  if (req.method === 'POST') {
    const { tenantId, roomId, description } = req.body
    const complaint = await prisma.complaint.create({ data: { tenantId: tenantId ? Number(tenantId) : null, roomId: roomId ? Number(roomId) : null, description } })
    return res.json(complaint)
  }

  res.status(405).end()
}
