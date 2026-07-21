const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.complaint.deleteMany();
  await prisma.rent.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();

  const rooms = await Promise.all([
    prisma.room.create({ data: { number: '101', type: 'Single', rent: 5000, occupied: true } }),
    prisma.room.create({ data: { number: '102', type: 'Single', rent: 5000, occupied: false } }),
    prisma.room.create({ data: { number: '103', type: 'Double', rent: 3500, occupied: true } }),
    prisma.room.create({ data: { number: '104', type: 'Double', rent: 3500, occupied: false } })
  ]);

  const tenant1 = await prisma.tenant.create({ data: { name: 'Alice', phone: '9991112222', email: 'alice@example.com', roomId: rooms[0].id } });
  const tenant2 = await prisma.tenant.create({ data: { name: 'Bob', phone: '9993334444', email: 'bob@example.com', roomId: rooms[2].id } });

  await prisma.rent.create({ data: { tenantId: tenant1.id, amount: 5000, month: '2026-06' } });
  await prisma.rent.create({ data: { tenantId: tenant2.id, amount: 3500, month: '2026-06' } });

  await prisma.complaint.create({ data: { tenantId: tenant1.id, roomId: rooms[0].id, description: 'Leaky faucet', status: 'OPEN' } });
  await prisma.complaint.create({ data: { tenantId: tenant2.id, roomId: rooms[2].id, description: 'Broken light', status: 'OPEN' } });

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
