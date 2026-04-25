import { Events, Collection, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { handleTicketButton, handleTicketSelect } from '../core/ticketManager.js';
import { handleTicketAction } from '../core/ticketActions.js';
import { replacePlaceholders } from '../utils/placeholders.js';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';
import { t } from '@ticketbot/i18n';
import { prisma } from '@ticketbot/db';

// Cooldown storage: UserID -> Timestamp
const cooldowns = new Collection();
const COOLDOWN_TIME = 3000; // 3 seconds general
const TICKET_CREATE_COOLDOWN = 60000; // 60 seconds for ticket creation

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Security Fix: Ignore non-guild interactions (DMs)
    if (!interaction.guild) return;

    // Basic Cooldown check to prevent spam
    const now = Date.now();
    const timestamps = cooldowns;
    const userId = interaction.user.id;
    
    // Logic for ticket creation cooldown (stricter)
    const isTicketCreate = (interaction.isButton() && interaction.customId.startsWith('ticket_create_')) ||
                           (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select_type');

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId) + (isTicketCreate ? TICKET_CREATE_COOLDOWN : COOLDOWN_TIME);
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const config = await prisma.guildConfig.findUnique({ where: { id: interaction.guildId } });
        const lang = config?.language || 'de';
        
        return interaction.reply({ 
          content: lang === 'de' 
            ? `🛡️ **Sicherheits-Check:** Bitte warte noch ${timeLeft.toFixed(1)} Sekunden.` 
            : `🛡️ **Security Check:** Please wait ${timeLeft.toFixed(1)} more seconds.`, 
          flags: ['Ephemeral'] 
        });
      }
    }

    // Set cooldown
    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), isTicketCreate ? TICKET_CREATE_COOLDOWN : COOLDOWN_TIME);

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      
      // 1. Static Command handling
      if (command) {
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(`Error executing ${interaction.commandName}:`, error);
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Beim Ausführen des Commands gab es einen Fehler.', flags: ['Ephemeral'] });
          } else {
            await interaction.reply({ content: 'Beim Ausführen des Commands gab es einen Fehler.', flags: ['Ephemeral'] });
          }
        }
        return;
      }

      // 2. Custom Command (DB) fallback
      const { prisma } = await import('@ticketbot/db');
      const customCmd = await prisma.customCommand.findFirst({
        where: {
          guildId: interaction.guildId,
          name: interaction.commandName
        }
      });

      if (customCmd) {
        // Berechtigungsprüfung für Custom Commands (Nur Teammitglieder)
        if (!(await hasPermission(interaction.member, interaction.guildId, PermissionActions.TICKET_VIEW))) {
          return interaction.reply({ 
            content: '🛡️ **Berechtigung fehlt:** Nur Teammitglieder dürfen Custom Commands nutzen.', 
            flags: ['Ephemeral'] 
          });
        }

        // Interaction acknowledgen (Ephemeral, damit keine "verwendet /command" Nachricht erscheint)
        await interaction.deferReply({ flags: ['Ephemeral'] });

        const targetUser = interaction.options.getUser('user') || interaction.user;
        const targetRole = interaction.options.getRole('role');
        const processedResponse = replacePlaceholders(customCmd.response, {
          user: targetUser,
          role: targetRole,
          sender: interaction.user,
          channel: interaction.channel,
          guild: interaction.guild
        });

        const components = [
          {
            type: 17, // Container
            components: [
              {
                type: 10, // Text component
                content: processedResponse
              },
              {
                type: 10, // Footer component (Text)
                content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
              }
            ]
          }
        ];

        // Wenn es als "Embed" markiert ist, können wir eine Akzentfarbe oder ein Logo hinzufügen (simuliert in V2)
        // Aber V2 Text-Komponenten sind aktuell noch simpel.
        
        await interaction.channel.send({ 
          components: components,
          flags: 32768 // IS_COMPONENTS_V2
        });

        // Ephemere Antwort löschen, damit es komplett sauber aussieht
        return interaction.deleteReply().catch(() => {});
      }
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('ticket_create_')) {
        await handleTicketButton(interaction);
      } else if (interaction.customId.startsWith('ticket_action_')) {
        await handleTicketAction(interaction);
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_select_type') {
        await handleTicketSelect(interaction);
      }
    }
  },
};
