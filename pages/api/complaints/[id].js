const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.query
  if (req.method === 'PUT') {
    const { status, description, tenantId, roomId } = req.body
    const data = {}
    if (status !== undefined) data.status = status
    if (description !== undefined) data.description = description
    if (tenantId !== undefined) data.tenantId = tenantId ? Number(tenantId) : null
    if (roomId !== undefined) data.roomId = roomId ? Number(roomId) : null
    const updated = await prisma.complaint.update({ where: { id: Number(id) }, data })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.complaint.delete({ where: { id: Number(id) } })
    return res.json({ ok: true })
  }

  if (req.method === 'GET') {
    const comp = await prisma.complaint.findUnique({ where: { id: Number(id) }, include: { tenant: true, room: true } })
    return res.json(comp)
  }

  res.status(405).end()
}
