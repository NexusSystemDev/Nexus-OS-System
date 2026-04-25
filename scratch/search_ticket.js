const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function search() {
  const query = process.argv[2] || 'Kavkaz';
  console.log(`Searching for: ${query}`);
  
  const tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { id: { contains: query, mode: 'insensitive' } },
        { creatorId: { contains: query, mode: 'insensitive' } },
        { type: { name: { contains: query, mode: 'insensitive' } } }
      ]
    },
    include: {
      type: true,
      transcript: true
    }
  });

  console.log(JSON.stringify(tickets, null, 2));
  await prisma.$disconnect();
}

search();
