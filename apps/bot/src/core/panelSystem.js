import { prisma } from '@ticketbot/db';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

export async function sendTicketPanel(guild, channelId, panelId) {
  const panel = await prisma.ticketPanel.findUnique({
    where: { id: panelId },
    include: { ticketTypes: true }
  });

  if (!panel) throw new Error("Panel existiert nicht");
  const channel = guild.channels.cache.get(channelId);
  if (!channel) throw new Error("Kanal nicht gefunden");

  // Components V2 Implementation for Ticket Panel
  const v2Components = [
    {
      type: 17, // Container
      components: [
        {
          type: 12, // Media Gallery Component
          items: [
            {
              media: {
                url: panel.image || 'https://media.discordapp.net/attachments/1496823175563182130/1497361103741779968/pruda_draft.png?ex=69ed3db2&is=69ebec32&hm=c677cc309887c8c2498a0945432e247569ad161cd31e3af490241bb070dfb129&=&format=webp&quality=lossless',
              },
              description: "Support Panel Banner"
            }
          ]
        },
        {
          type: 10, // Text Display Component
          content: `### ${panel.title}\n${panel.description}`
        }
      ]
    }
  ];

  // Add Interactive Components (Buttons/Select) to the Container or as separate top-level row
  if (panel.ticketTypes.length === 0) {
    v2Components[0].components.push({
      type: 1,
      components: [{
        type: 2,
        custom_id: 'dummy_no_types',
        label: 'Keine Kategorien konfiguriert',
        style: 2,
        disabled: true
      }]
    });
  } else if (panel.useSelectMenu) {
    const select = {
      type: 3, // String Select
      custom_id: 'ticket_select_type',
      placeholder: panel.placeholderText || 'Wähle eine Kategorie...',
      options: panel.ticketTypes.slice(0, 25).map(type => ({
        label: type.name,
        description: (type.description || 'Erstelle ein Ticket hierfür').substring(0, 50),
        value: type.id
      }))
    };
    v2Components[0].components.push({ type: 1, components: [select] });
  } else {
    const allButtons = panel.ticketTypes.slice(0, 25).map(type => ({
      type: 2,
      custom_id: `ticket_create_${type.id}`,
      label: type.name,
      style: (panel.buttonStyle === 'Primary' ? 1 : panel.buttonStyle === 'Secondary' ? 2 : panel.buttonStyle === 'Success' ? 3 : 4) || 1
    }));
    
    // Discord erlaubt max 5 Buttons pro Reihe, und max 5 Reihen (Total 25)
    for (let i = 0; i < allButtons.length; i += 5) {
      v2Components[0].components.push({ 
        type: 1, 
        components: allButtons.slice(i, i + 5) 
      });
    }
  }

  await channel.send({ 
    components: v2Components,
    flags: 32768 // IS_COMPONENTS_V2
  });
}
