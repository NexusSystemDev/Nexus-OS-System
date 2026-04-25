import { prisma } from '@ticketbot/db';

export function hasAdminRights(permissions) {
  const perms = BigInt(permissions);
  // Administrator (0x8) or Manage Guild (0x20)
  return (perms & 0x8n) === 0x8n || (perms & 0x20n) === 0x20n;
}

export async function verifyGuildAccess(accessToken, guildId) {
  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return { allowed: false, permissions: [] };
    const guilds = await res.json();
    const targetGuild = guilds.find(g => g.id === guildId);
    
    // 1. Bot Owner Bypass
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    let userId = null;
    if (userRes.ok) {
      const userData = await userRes.json();
      userId = userData.id;
      if (userData.id === process.env.BOT_OWNER_ID?.trim()) {
        console.log(`[Security] Bypass for Bot Owner: ${userData.id}`);
        return { allowed: true, permissions: ['*'] }; // Full access
      }
    }

    if (!targetGuild) {
      console.warn(`[Security] Guild ${guildId} not found in user's guild list.`);
      return { allowed: false, permissions: [] };
    }

    // 2. Check Native Discord Permissions (Admin / Manage Guild)
    if (hasAdminRights(targetGuild.permissions)) {
      return { allowed: true, permissions: ['*'] }; // Admin gets everything
    }

    // 3. Check Custom Dashboard Permissions via Database
    if (userId) {
      const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
      });
      
      if (memberRes.ok) {
        const memberData = await memberRes.json();
        const rolePermissions = await prisma.rolePermission.findMany({
          where: { guildId, roleId: { in: memberData.roles } }
        });

        const allPerms = new Set();
        rolePermissions.forEach(rp => rp.permissions.forEach(p => allPerms.add(p)));
        
        if (allPerms.has('DASHBOARD')) {
          return { allowed: true, permissions: Array.from(allPerms) };
        }
      }
    }

    console.warn(`[Security] Access denied for guild ${guildId}`);
    return { allowed: false, permissions: [] };
  } catch (error) {
    console.error('VerifyGuildAccess Error:', error);
    return { allowed: false, permissions: [] };
  }
}
