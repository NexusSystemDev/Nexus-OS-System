import { prisma } from '@ticketbot/db';
import { PermissionFlagsBits } from 'discord.js';

/**
 * Checks if a member has a specific permission in a guild.
 * @param {import('discord.js').GuildMember} member 
 * @param {string} guildId 
 * @param {string} action - e.g., 'DASHBOARD', 'TICKET_CLOSE', 'TICKET_DELETE'
 * @returns {Promise<boolean>}
 */
export async function hasPermission(member, guildId, action) {
  // 1. Administrators always have all permissions
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;

  // 2. Fetch role-based permissions from database
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { guildId }
  });

  if (!rolePermissions || rolePermissions.length === 0) {
    // FALLBACK: If no custom permissions are set, use legacy logic
    if (action === 'TICKET_DELETE') return false; // Delete remains Admin only by default
    return member.permissions.has(PermissionFlagsBits.ManageChannels);
  }

  // 3. Check if any of the member's roles has the required permission
  const memberRoleIds = member.roles.cache.map(r => r.id);
  
  for (const rp of rolePermissions) {
    if (memberRoleIds.includes(rp.roleId)) {
      if (rp.permissions.includes(action)) return true;
    }
  }

  return false;
}

export const PermissionActions = {
  DASHBOARD: 'DASHBOARD',
  TICKET_VIEW: 'TICKET_VIEW',
  TICKET_CLOSE: 'TICKET_CLOSE',
  TICKET_DELETE: 'TICKET_DELETE',
  TICKET_REOPEN: 'TICKET_REOPEN',
  TICKET_MANAGE: 'TICKET_MANAGE', // Add/Remove members
  TICKET_TRANSCRIPT: 'TICKET_TRANSCRIPT',
  TICKET_RENAME: 'TICKET_RENAME'
};
