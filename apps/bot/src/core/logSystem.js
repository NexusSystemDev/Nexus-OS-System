import { prisma } from '@ticketbot/db';
import { EmbedBuilder } from 'discord.js';

export async function logTicketAction(guild, ticketId, action, userId, details = "") {
  await prisma.ticketLog.create({
    data: {
      ticketId,
      action,
      userId,
      details
    }
  });

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { type: true, guild: true }
  });

  if (!ticket || !ticket.guild.logChannelId) return;

  const logChannel = guild.channels.cache.get(ticket.guild.logChannelId);
  if (!logChannel) return;

  const embed = new EmbedBuilder()
    .setTitle(`Ticket Log | ${action}`)
    .addFields(
      { name: 'Ticket', value: ticket.channelId ? `<#${ticket.channelId}>` : ticketId, inline: true },
      { name: 'User', value: `<@${userId}>`, inline: true },
      { name: 'Details', value: details || '-' }
    )
    .setColor('#5865F2')
    .setTimestamp();

  await logChannel.send({ embeds: [embed] }).catch(() => null);
}
