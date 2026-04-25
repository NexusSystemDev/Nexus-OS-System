import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '@ticketbot/db';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';
import { createV2Message } from '../utils/v2Factory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Entfernt einen User aus dem Ticket')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Der User, der entfernt werden soll')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const { channel, member, guildId } = interaction;
    const targetUser = interaction.options.getUser('user');

    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_MANAGE))) {
      return interaction.reply({ content: '🛡️ **Berechtigung fehlt:** Du darfst keine Nutzer aus Tickets entfernen.', flags: ['Ephemeral'] });
    }

    // Prüfen, ob der Channel ein Ticket ist
    const ticket = await prisma.ticket.findFirst({ where: { channelId: channel.id } });
    if (!ticket) {
      return interaction.reply({ content: 'Dieser Befehl kann nur in einem Ticket-Kanal verwendet werden.', flags: ['Ephemeral'] });
    }

    try {
      await channel.permissionOverwrites.delete(targetUser.id);
      await interaction.reply(createV2Message(`✅ <@${targetUser.id}> wurde aus dem Ticket entfernt!`));
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: 'Fehler beim Entfernen des Users.', flags: ['Ephemeral'] });
    }
  },
};
