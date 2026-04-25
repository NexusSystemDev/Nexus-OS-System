import { prisma } from '@ticketbot/db';

export async function isBlacklisted(guildId, userId, memberRoles) {
  const blacklists = await prisma.blacklist.findMany({
    where: { guildId }
  });

  for (const entry of blacklists) {
    if (entry.type === 'USER' && entry.targetId === userId) {
      return true;
    }
    if (entry.type === 'ROLE' && memberRoles.cache.has(entry.targetId)) {
      return true;
    }
  }
  return false;
}
