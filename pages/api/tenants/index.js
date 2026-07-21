const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const tenants = await prisma.tenant.findMany({ include: { room: true } })
    return res.json(tenants)
  }

  if (req.method === 'POST') {
    const { name, phone, email, roomId } = req.body
    const tenant = await prisma.tenant.create({ data: { name, phone, email, roomId: roomId ? Number(roomId) : null } })
    if (roomId) {
      await prisma.room.update({ where: { id: Number(roomId) }, data: { occupied: true } })
    }
    return res.json(tenant)
  }

  res.status(405).end()
}
