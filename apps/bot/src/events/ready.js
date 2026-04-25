import { Events } from 'discord.js';
import { prisma } from '@ticketbot/db';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    
    // Set Branding Presence
    client.user.setPresence({
      activities: [{ name: '🎫 NEXUS Tickets', type: 3 }], // Type 3 is WATCHING
      status: 'online',
    });

    // Commands global registrieren (wird genutzt sobald in produktion)
    try {
      await client.application.commands.set(client.commands.map(c => c.data));
      console.log('Registered static slash commands globally.');

      // Custom Commands pro Guild registrieren
      for (const guild of client.guilds.cache.values()) {
        const customCmds = await prisma.customCommand.findMany({ 
          where: { guildId: guild.id } 
        });

        if (customCmds.length > 0) {
          const guildCmds = customCmds.map(cc => ({
            name: cc.name.toLowerCase(),
            description: 'NEXUS Custom Command',
            default_member_permissions: "8192", // Manage Messages (Standard für Team)
            options: [
              {
                name: 'user',
                description: 'User to mention',
                type: 6, // USER
                required: false
              },
              {
                name: 'role',
                description: 'Role to mention',
                type: 8, // ROLE
                required: false
              }
            ]
          }));

          await guild.commands.set(guildCmds);
          console.log(`Registered ${customCmds.length} custom commands for guild: ${guild.name} (${guild.id})`);
        }
      }
    } catch (error) {
      console.error('Failed to register slash commands', error);
    }
  },
};
