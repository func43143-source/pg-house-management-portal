const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.query
  if (req.method === 'GET') {
    const room = await prisma.room.findUnique({ where: { id: Number(id) }, include: { tenants: true } })
    return res.json(room)
  }

  if (req.method === 'PUT') {
    const { number, type, rent, occupied } = req.body
    const room = await prisma.room.update({ where: { id: Number(id) }, data: { number, type, rent: Number(rent) || 0, occupied: Boolean(occupied) } })
    return res.json(room)
  }

  if (req.method === 'DELETE') {
    await prisma.room.delete({ where: { id: Number(id) } })
    return res.json({ ok: true })
  }

  res.status(405).end()
}
