import { prisma } from '@ticketbot/db';

/**
 * Validates a user's security status before allowing ticket creation.
 * @param {import('discord.js').GuildMember} member The member to check
 * @param {string} guildId The Discord Guild ID
 * @returns {Promise<{allowed: boolean, reason?: string}>}
 */
export async function validateUserSecurity(member, guildId) {
  // 1. Fetch Guild Security Configuration
  const config = await prisma.guildConfig.findUnique({
    where: { id: guildId },
    select: {
      proxyProtectionEnabled: true,
      minAccountAge: true,
      globalBlacklistEnabled: true
    }
  });

  if (!config) return { allowed: true };

  // 2. Local Blacklist Check (Always enforced)
  const localBan = await prisma.blacklist.findFirst({
    where: { 
      guildId,
      OR: [
        { targetId: member.id, type: 'USER' },
        { targetId: { in: Array.from(member.roles.cache.keys()) }, type: 'ROLE' }
      ]
    }
  });

  if (localBan) {
    return { 
      allowed: false, 
      reason: `Du bist auf der Blacklist dieses Servers gesperrt. Grund: ${localBan.reason || 'Kein Grund angegeben.'}` 
    };
  }

  // 3. Global Blacklist Cloud Sync
  if (config.globalBlacklistEnabled) {
    const globalBan = await prisma.globalBlacklist.findUnique({
      where: { userId: member.id }
    });

    if (globalBan) {
      return {
        allowed: false,
        reason: `🛡️ **NEXUS Sicherheit:** Dein Account ist in unserer globalen Datenbank als bösartig markiert. Ticket-Erstellung verweigert.`
      };
    }
  }

  // 4. Proxy / Alt-Account Protection (Account Age)
  if (config.proxyProtectionEnabled && config.minAccountAge > 0) {
    const accountAgeDays = (Date.now() - member.user.createdAt) / (1000 * 60 * 60 * 24);
    
    if (accountAgeDays < config.minAccountAge) {
      return {
        allowed: false,
        reason: `⚠️ **Proxy-Schutz:** Dein Account ist zu neu (${Math.floor(accountAgeDays)} Tage). Für diesen Server wird ein Mindestalter von ${config.minAccountAge} Tagen benötigt.`
      };
    }
  }

  return { allowed: true };
}
