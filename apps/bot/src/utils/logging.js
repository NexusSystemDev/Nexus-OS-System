import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { prisma } from '@ticketbot/db';

/**
 * Sends a log message to the configured log channel for a guild.
 * @param {import('discord.js').Guild} guild 
 * @param {Object} options 
 * @param {string} options.title
 * @param {string} options.description
 * @param {string} [options.color]
 * @param {Array} [options.fields]
 */
export async function sendTicketLog(guild, { title, description, color = '#5865F2', fields = [] }) {
  try {
    const config = await prisma.guildConfig.findUnique({ where: { id: guild.id } });
    if (!config || !config.logChannelId) return;

    const logChannel = await guild.channels.fetch(config.logChannelId).catch(() => null);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp()
      .addFields(fields);

    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending ticket log:', error);
  }
}

/**
 * Sends a transcript to the configured transcript channel.
 * @param {import('discord.js').Guild} guild 
 * @param {import('discord.js').AttachmentBuilder} attachment 
 * @param {Object} info 
 */
export async function sendTranscriptArchive(guild, attachment, { ticketId, creatorId, closedById }) {
  try {
    const config = await prisma.guildConfig.findUnique({ where: { id: guild.id } });
    if (!config || !config.transcriptChannelId) return;

    const archiveChannel = await guild.channels.fetch(config.transcriptChannelId).catch(() => null);
    if (!archiveChannel) return;

    const embed = new EmbedBuilder()
      .setTitle('📁 Ticket Transcript Archiv')
      .setDescription(`Ein Transcript wurde für das Ticket **#${ticketId.substring(ticketId.length - 4)}** erstellt.`)
      .addFields([
        { name: 'Erstellt von', value: `<@${creatorId}>`, inline: true },
        { name: 'Geschlossen von', value: closedById ? `<@${closedById}>` : 'Unbekannt', inline: true }
      ])
      .setColor('#2b2d31')
      .setTimestamp();

    await archiveChannel.send({ embeds: [embed], files: [attachment] });
  } catch (error) {
    console.error('Error sending transcript archive:', error);
  }
}
