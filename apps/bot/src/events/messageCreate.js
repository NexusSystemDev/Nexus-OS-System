import { Events, EmbedBuilder } from 'discord.js';
import { prisma } from '@ticketbot/db';
import { replacePlaceholders } from '../utils/placeholders.js';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    // Check if it's a command
    try {
      const config = await prisma.guildConfig.findUnique({
        where: { id: message.guild.id },
        select: { prefix: true, customCommands: true }
      });

      if (!config) return;

      const prefix = config.prefix || '!';

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Find if this is a custom command
      const customCmd = config.customCommands.find(c => c.name.toLowerCase() === commandName);

      if (customCmd) {
        // Berechtigungsprüfung für Custom Commands
        if (!(await hasPermission(message.member, message.guild.id, PermissionActions.TICKET_VIEW))) {
          return; // Still schweigend ignorieren für normale User bei Prefix-Commands
        }
        
        const targetUser = message.mentions.users.first() || message.author;
        const targetRole = message.mentions.roles.first();
        const processedResponse = replacePlaceholders(customCmd.response, {
          user: targetUser,
          role: targetRole,
          sender: message.author,
          channel: message.channel,
          guild: message.guild
        });

        if (customCmd.isEmbed) {
          const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setDescription(processedResponse);
          await message.channel.send({ embeds: [embed] });
        } else {
          await message.channel.send(processedResponse);
        }
      }
    } catch (e) {
      console.error('Error handling messageCreate for custom commands:', e);
    }
  },
};
