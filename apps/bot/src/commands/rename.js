import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '@ticketbot/db';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';
import { createV2Message } from '../utils/v2Factory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Benennt das aktuelle Ticket um')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Der neue Name für das Ticket')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const { channel, member, guildId } = interaction;
    const newName = interaction.options.getString('name');

    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_RENAME))) {
      return interaction.reply({ content: '🛡️ **Berechtigung fehlt:** Du darfst Tickets nicht umbenennen.', flags: ['Ephemeral'] });
    }

    // Prüfen, ob der Channel ein Ticket ist
    const ticket = await prisma.ticket.findFirst({ where: { channelId: channel.id } });
    if (!ticket) {
      return interaction.reply({ content: 'Dieser Befehl kann nur in einem Ticket-Kanal verwendet werden.', flags: ['Ephemeral'] });
    }

    try {
      await channel.setName(newName);
      await interaction.reply(createV2Message(`✅ Ticket wurde erfolgreich in **${newName}** umbenannt!`));
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: 'Fehler beim Umbenennen des Tickets. Möglicherweise greift hier das Discord Rate-Limit (max. 2 Umbennungen pro 10 Min).', flags: ['Ephemeral'] });
    }
  },
};
