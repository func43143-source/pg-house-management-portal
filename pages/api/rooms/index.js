const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  if (req.method === 'GET') {
    const rooms = await prisma.room.findMany({ include: { tenants: true } })
    return res.json(rooms)
  }

  if (req.method === 'POST') {
    const { number, type, rent } = req.body
    const room = await prisma.room.create({ data: { number, type, rent: Number(rent) || 0 } })
    return res.json(room)
  }

  res.status(405).end()
}
