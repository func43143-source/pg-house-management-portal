const prisma = require('../../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.query
  if (req.method === 'GET') {
    const tenant = await prisma.tenant.findUnique({ where: { id: Number(id) }, include: { room: true, payments: true, complaints: true } })
    return res.json(tenant)
  }

  if (req.method === 'PUT') {
    const { name, phone, email, roomId } = req.body
    const existing = await prisma.tenant.findUnique({ where: { id: Number(id) } })
    const prevRoomId = existing?.roomId || null
    const newRoomId = roomId ? Number(roomId) : null

    if (prevRoomId && prevRoomId !== newRoomId) {
      await prisma.room.update({ where: { id: prevRoomId }, data: { occupied: false } })
    }
    if (newRoomId && newRoomId !== prevRoomId) {
      await prisma.room.update({ where: { id: newRoomId }, data: { occupied: true } })
    }

    const tenant = await prisma.tenant.update({ where: { id: Number(id) }, data: { name, phone, email, roomId: newRoomId } })
    return res.json(tenant)
  }

  if (req.method === 'DELETE') {
    const existing = await prisma.tenant.findUnique({ where: { id: Number(id) } })
    const roomId = existing?.roomId || null
    await prisma.tenant.delete({ where: { id: Number(id) } })
    if (roomId) {
      await prisma.room.update({ where: { id: roomId }, data: { occupied: false } })
    }
    return res.json({ ok: true })
  }

  res.status(405).end()
}
