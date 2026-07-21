const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method !== 'GET') return res.status(405).end()

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const monthStr = `${year}-${month}`

  const tenantsWithRoom = await prisma.tenant.findMany({ where: { roomId: { not: null } }, include: { room: true } })

  const pending = []
  for (const t of tenantsWithRoom) {
    const paid = await prisma.rent.findFirst({ where: { tenantId: t.id, month: monthStr } })
    if (!paid) pending.push({ id: t.id, name: t.name, phone: t.phone, email: t.email, room: t.room, month: monthStr })
  }

  res.json(pending)
}
