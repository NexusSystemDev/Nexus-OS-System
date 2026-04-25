import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting DB Cleanup ---');
  
  // Update all TicketTypes that have the old format
  const updatedTypes = await prisma.ticketType.updateMany({
    where: {
      OR: [
        { closedChannelNameFormat: '🕐48h-{username}' },
        { closedChannelNameFormat: null }
      ]
    },
    data: {
      closedChannelNameFormat: '🕐48h'
    }
  });

  console.log(`Updated ${updatedTypes.count} TicketType records to format: 🕐48h`);
  
  console.log('--- Cleanup Finished ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
