import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '@ticketbot/db';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';
import { createV2Message } from '../utils/v2Factory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Fügt einen User zum Ticket hinzu')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Der User, der hinzugefügt werden soll')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const { channel, member, guildId } = interaction;
    const targetUser = interaction.options.getUser('user');

    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_MANAGE))) {
      return interaction.reply({ content: '🛡️ **Berechtigung fehlt:** Du darfst keine Nutzer zu Tickets hinzufügen.', flags: ['Ephemeral'] });
    }

    // Prüfen, ob der Channel ein Ticket ist
    const ticket = await prisma.ticket.findFirst({ where: { channelId: channel.id } });
    if (!ticket) {
      return interaction.reply({ content: 'Dieser Befehl kann nur in einem Ticket-Kanal verwendet werden.', flags: ['Ephemeral'] });
    }

    try {
      await channel.permissionOverwrites.edit(targetUser.id, {
        ViewChannel: true,
        SendMessages: true,
        AttachFiles: true,
        ReadMessageHistory: true,
      });

      await interaction.reply(createV2Message(`✅ <@${targetUser.id}> wurde dem Ticket hinzugefügt!`));
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: 'Fehler beim Hinzufügen des Users.', flags: ['Ephemeral'] });
    }
  },
};
