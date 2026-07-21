const prisma = require('../../lib/prisma')

export default async function handler(req, res) {
  const cookies = req.headers.cookie || ''
  if (!cookies.includes('pg_admin=1')) return res.status(401).json({ message: 'Unauthorized' })

  const totalRooms = await prisma.room.count()
  const occupiedRooms = await prisma.room.count({ where: { occupied: true } })
  const vacantRooms = totalRooms - occupiedRooms
  const totalTenants = await prisma.tenant.count()
  const totalPayments = await prisma.rent.count()
  const openComplaints = await prisma.complaint.count({ where: { status: 'OPEN' } })

  const pendingPayments = Math.max(0, occupiedRooms - totalPayments)

  res.json({ totalRooms, occupiedRooms, vacantRooms, totalTenants, pendingPayments, openComplaints })
}
