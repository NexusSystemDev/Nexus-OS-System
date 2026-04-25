import { prisma } from '@ticketbot/db';
import { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { COLORS, BRAND } from '@ticketbot/shared';
import { t } from '@ticketbot/i18n';
import { sendTicketLog } from '../utils/logging.js';
import { validateUserSecurity } from './securityManager.js';

export async function createTicket(guild, user, typeId) {
  // 0. Security Validation
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (member) {
    const security = await validateUserSecurity(member, guild.id);
    if (!security.allowed) {
      const config = await prisma.guildConfig.findUnique({ where: { id: guild.id } });
      const lang = config?.language || 'de';
      throw new Error(security.reason || (lang === 'de' ? "Sicherheits-Check fehlgeschlagen." : "Security check failed."));
    }
  }

  const config = await prisma.guildConfig.findUnique({ where: { id: guild.id } });
  const lang = config?.language || 'de';

  const type = await prisma.ticketType.findUnique({ where: { id: typeId } });
  if (!type) throw new Error(lang === 'de' ? "Ticket-Typ existiert nicht." : "Ticket type does not exist.");

  const ticket = await prisma.ticket.create({
    data: {
      guildId: guild.id,
      typeId: type.id,
      creatorId: user.id,
    }
  });

  const channelName = type.channelNameFormat
    .replace('{username}', user.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
    .replace('{ticket-id}', ticket.id.substring(ticket.id.length - 4));

  const permissionOverwrites = [
    {
      id: guild.id, // @everyone
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: user.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
    },
    {
      id: guild.client.user.id,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
    }
  ];

  for (const roleId of type.supportRoles) {
    // Security Fix: Validate Role ID format (Snowflake)
    if (!/^\d{17,20}$/.test(roleId)) continue;

    if (guild.roles.cache.has(roleId)) {
      permissionOverwrites.push({
        id: roleId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
      });
    }
  }

  // Add Support Users
  if (type.supportUsers && type.supportUsers.length > 0) {
    for (const userId of type.supportUsers) {
      if (!/^\d{17,20}$/.test(userId)) continue;
      permissionOverwrites.push({
        id: userId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
      });
    }
  }

  // 4. Add Global Staff Roles (those with TICKET_VIEW permission)
  const globalStaffPerms = await prisma.rolePermission.findMany({
    where: { guildId: guild.id, permissions: { has: 'TICKET_VIEW' } }
  });

  for (const gp of globalStaffPerms) {
    if (type.supportRoles.includes(gp.roleId)) continue; // Already added
    if (guild.roles.cache.has(gp.roleId)) {
      permissionOverwrites.push({
        id: gp.roleId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles],
      });
    }
  }

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: type.categoryId || null,
    permissionOverwrites,
  });

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { channelId: channel.id }
  });

  const embedTitle = (type.embedTitle || '{name}')
    .replace('{name}', type.name)
    .replace('{username}', user.username);

  // Final Valid Components V2 JSON Structure
  const components = [
    {
      type: 17, // Container
      components: [
        {
          type: 10, // User Mention
          content: `<@${user.id}>`,
        },
        {
          type: 12, // Media Gallery Component
          items: [
            {
              media: {
                url: 'https://media.discordapp.net/attachments/1496823175563182130/1497361675576279131/pruda_ticket.png?ex=69ed3e3b&is=69ebecbb&hm=fdd4746c1f388e57127337835ce07b52c44e77589bcfca5358a6fea5a5e0fbe4&=&format=webp&quality=lossless',
              },
              description: "Ticket Opened Banner"
            }
          ]
        },
        {
          type: 10, // Text Display Component
          content: `• **Wichtig** 🌐\n${type.welcomeMessage.replace('{username}', `<@${user.id}>`)}`,
        },
        {
          type: 1, // Action Row
          components: [
            {
              type: 2,
              custom_id: `ticket_action_close_${ticket.id}`,
              label: lang === 'de' ? 'Schließen' : 'Close',
              emoji: { name: '⚠️' },
              style: 2 // Secondary
            },
            {
              type: 2,
              custom_id: `ticket_action_delete_${ticket.id}`,
              label: lang === 'de' ? 'Löschen' : 'Delete',
              emoji: { name: '⛔' },
              style: 4 // Danger
            },
            {
              type: 2,
              custom_id: `ticket_action_lang_en_${ticket.id}`,
              label: 'English',
              emoji: { name: '🇺🇸' },
              style: 2 // Secondary
            }
          ]
        },
        {
          type: 10, // Footer component (Text)
          content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
        }
      ]
    }
  ];

  await channel.send({ 
    components: components,
    flags: 32768 // IS_COMPONENTS_V2
  });

  // Log creation
  await sendTicketLog(guild, {
    title: t('bot.ticket_opened', lang),
    description: t('bot.ticket_opened_desc', lang, { channel: `<#${channel.id}>` }),
    color: '#22c55e', // Grün
    fields: [
      { name: lang === 'de' ? 'Kanal' : 'Channel', value: `<#${channel.id}>`, inline: true },
      { name: lang === 'de' ? 'Kategorie' : 'Category', value: type.name, inline: true },
      { name: 'Ticket ID', value: `#${ticket.id.substring(ticket.id.length - 4)}`, inline: true }
    ]
  });

  return { ticket, channel };
}

export async function handleTicketButton(interaction) {
  const typeId = interaction.customId.replace('ticket_create_', '');
  await interaction.deferReply({ flags: ['Ephemeral'] });

  try {
    const config = await prisma.guildConfig.findUnique({ where: { id: interaction.guild.id } });
    const lang = config?.language || 'de';
    const { channel } = await createTicket(interaction.guild, interaction.user, typeId);
    await interaction.editReply({ content: `✅ ${t('bot.ticket_opened_desc', lang, { channel: `<#${channel.id}>` })}` });
  } catch (error) {
    // Only log unexpected errors
    if (!error.message.includes('Limit: 3')) console.error(error);
    await interaction.editReply({ content: `❌ ${error.message}` });
  }
}

export async function handleTicketSelect(interaction) {
  const typeId = interaction.values[0];
  await interaction.deferReply({ flags: ['Ephemeral'] });

  try {
    const config = await prisma.guildConfig.findUnique({ where: { id: interaction.guild.id } });
    const lang = config?.language || 'de';
    const { channel } = await createTicket(interaction.guild, interaction.user, typeId);
    await interaction.editReply({ content: `✅ ${t('bot.ticket_opened_desc', lang, { channel: `<#${channel.id}>` })}` });
  } catch (error) {
    if (!error.message.includes('Limit: 3')) console.error(error);
    await interaction.editReply({ content: `❌ ${error.message}` });
  }
}
