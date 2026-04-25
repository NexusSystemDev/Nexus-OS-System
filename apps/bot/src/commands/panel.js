import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { prisma } from '@ticketbot/db';
import { sendTicketPanel } from '../core/panelSystem.js';

export default {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Sendet das Ticket-Panel in diesen Kanal')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply({ flags: ['Ephemeral'] });
    
    try {
      // Prüfe, ob der Server in der Datenbank existiert
      let config = await prisma.guildConfig.findUnique({ where: { id: interaction.guild.id } });
      if (!config) {
        config = await prisma.guildConfig.create({
          data: {
            id: interaction.guild.id,
            name: interaction.guild.name,
          }
        });
      }

      // Suche nach dem ersten Panel für diesen Server (Fürs Beispiel nutzen wir einfach das Erste)
      const panels = await prisma.ticketPanel.findMany({
        where: { guildId: interaction.guild.id },
        include: { ticketTypes: true }
      });

      if (panels.length === 0) {
        // Erstelle ein Dummy-Panel und einen Typen, falls noch keins via Dashboard erstellt wurde
        const newPanel = await prisma.ticketPanel.create({
          data: {
            guildId: interaction.guild.id,
            channelId: interaction.channelId,
          }
        });
        
        await prisma.ticketType.create({
          data: {
            guildId: interaction.guild.id,
            panelId: newPanel.id,
            name: "Default Support",
            emoji: "🎫",
            description: "Allgemeiner Support",
          }
        });

        await sendTicketPanel(interaction.guild, interaction.channel.id, newPanel.id);
      } else {
        await sendTicketPanel(interaction.guild, interaction.channel.id, panels[0].id);
      }

      await interaction.editReply({ content: '✅ Ticket-Panel wurde erfolgreich in diesen Kanal gesendet!' });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: `❌ Fehler beim Senden des Panels: ${error.message}` });
    }
  },
};
