import { prisma } from '@ticketbot/db';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, AttachmentBuilder } from 'discord.js';
import { sendTicketLog, sendTranscriptArchive } from '../utils/logging.js';
import { generateTranscript } from './transcriptSystem.js';
import { hasPermission, PermissionActions } from '../utils/permissionManager.js';
import { BRAND } from '@ticketbot/shared';
import { t } from '@ticketbot/i18n';
import { Buffer } from 'node:buffer';

export async function closeTicket(channel, closingUser, ticketId, guild, client) {
  const ticket = await prisma.ticket.findUnique({ 
    where: { id: ticketId },
    include: { type: true }
  });
  if (!ticket) return;

  const config = await prisma.guildConfig.findUnique({ where: { id: guild.id } });
  const lang = config?.language || 'de';

  // Entziehe dem Ersteller die Leserechte
  if (ticket.creatorId) {
    try {
      await channel.permissionOverwrites.edit(ticket.creatorId, {
        ViewChannel: false,
        SendMessages: false
      });
    } catch (e) {
      console.error("Could not remove permissions", e);
    }
  }

  // Status updaten
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { 
      status: 'CLOSED',
      closedAt: new Date()
    }
  });

  // Components V2 UI für das Control Panel
  const components = [
    {
      type: 17, // Container
      components: [
        {
          type: 10, // Text
          content: `🔒 **Ticket geschlossen** ${closingUser.id === client.user.id ? '(Auto-Close)' : `von <@${closingUser.id}>`}\n> Der Zugriff für den Ersteller wurde entzogen.`,
        },
        {
          type: 1, // Action Row
          components: [
            {
              type: 2,
              custom_id: `ticket_action_transcript_${ticketId}`,
              label: 'Transcript',
              emoji: { name: '📝' },
              style: 2
            },
            {
              type: 2,
              custom_id: `ticket_action_reopen_${ticketId}`,
              label: lang === 'de' ? 'Wieder öffnen' : 'Reopen',
              emoji: { name: '🔓' },
              style: 3
            },
            {
              type: 2,
              custom_id: `ticket_action_delete_${ticketId}`,
              label: lang === 'de' ? 'Löschen' : 'Delete',
              emoji: { name: '⛔' },
              style: 4
            }
          ]
        },
        {
          type: 10, // Footer
          content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
        }
      ]
    }
  ];

  await channel.send({ 
    components: components,
    flags: 32768 // IS_COMPONENTS_V2
  });

  // Log closure
  await sendTicketLog(guild, {
    title: t('bot.ticket_closed', lang),
    description: closingUser.id === client.user.id 
      ? "Das Ticket wurde automatisch wegen Inaktivität geschlossen."
      : t('bot.ticket_closed_desc', lang, { user: `<@${closingUser.id}>` }),
    color: '#eab308',
    fields: [
      { name: 'Kanal', value: `<#${channel.id}>`, inline: true },
      { name: 'Ticket ID', value: `#${ticketId.substring(ticketId.length - 4)}`, inline: true }
    ]
  });

  // Kanal umbenennen
  if (ticket.type?.closedChannelNameFormat) {
    try {
      const creator = ticket.creatorId ? await client.users.fetch(ticket.creatorId).catch(() => null) : null;
      const uname = creator ? creator.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'user';
      const newName = ticket.type.closedChannelNameFormat
        .replace('{username}', uname)
        .replace('{ticket-id}', ticket.id.substring(ticket.id.length - 4));
      
      channel.setName(newName).catch(e => console.warn("[Rename] Rate limit hit on auto-close."));
    } catch (e) {
      console.error("Fehler beim Vorbereiten des Ticket-Rename:", e);
    }
  }
}

export async function handleTicketAction(interaction) {
  const customId = interaction.customId;
  const member = interaction.member;
  const guildId = interaction.guildId;
  const config = await prisma.guildConfig.findUnique({ where: { id: guildId } });
  const lang = config?.language || 'de';

  // TICKET CLAIMEN
  if (customId.startsWith('ticket_action_claim_')) {
    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_VIEW))) {
      return interaction.reply({ content: t('bot.permission_denied', lang), flags: ['Ephemeral'] });
    }
    const ticketId = customId.replace('ticket_action_claim_', '');
    
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket) return interaction.reply({ content: t('bot.ticket_not_found', lang), flags: ['Ephemeral'] });

    if (ticket.claimedById) {
      if (ticket.claimedById === interaction.user.id) {
        return interaction.reply({ content: 'Du hast dieses Ticket bereits geclaimt!', flags: ['Ephemeral'] });
      }
      return interaction.reply({ content: `Dieses Ticket wurde bereits von <@${ticket.claimedById}> geclaimt.`, flags: ['Ephemeral'] });
    }

    await interaction.deferUpdate();

    // DB Update
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { claimedById: interaction.user.id }
    });

    // Logging
    await prisma.ticketLog.create({
      data: {
        ticketId,
        action: 'CLAIMED',
        userId: interaction.user.id
      }
    });

    // Components V2 UI für den Claim-Status
    const components = [
      {
        type: 17, // Container
        components: [
          {
            type: 10,
            content: `👋 **Ticket übernommen**\nDieses Ticket wird nun von <@${interaction.user.id}> bearbeitet.`
          },
          {
            type: 1, // Action Row
            components: [
              {
                type: 2,
                custom_id: `ticket_action_close_${ticketId}`,
                label: lang === 'de' ? 'Ticket schließen' : 'Close Ticket',
                emoji: { name: '🔒' },
                style: 4
              }
            ]
          },
          {
            type: 10, // Footer
            content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
          }
        ]
      }
    ];

    await interaction.editReply({ 
      components: components,
      flags: 32768 
    });

    // Log internally
    await sendTicketLog(interaction.guild, {
      title: t('bot.ticket_claimed', lang),
      description: t('bot.ticket_claimed_desc', lang, { user: `<@${interaction.user.id}>` }),
      color: '#3b82f6',
      fields: [
        { name: 'Kanal', value: `<#${interaction.channel.id}>`, inline: true },
        { name: 'Ticket ID', value: `#${ticketId.substring(ticketId.length - 4)}`, inline: true }
      ]
    });
    return;
  }

  // TICKET SCHLIESSEN
  if (customId.startsWith('ticket_action_close_')) {
    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_CLOSE))) {
      return interaction.reply({ content: t('bot.permission_denied', lang), flags: ['Ephemeral'] });
    }
    const ticketId = customId.replace('ticket_action_close_', '');
    
    const ticket = await prisma.ticket.findUnique({ 
      where: { id: ticketId },
      include: { type: true }
    });
    if (!ticket) return interaction.reply({ content: 'Ticket nicht in der Datenbank gefunden!', flags: ['Ephemeral'] });

    await interaction.deferUpdate();

    // Sichtbarkeit für den schließenden User einschränken (wenn kein Admin/Löscher)
    const canDelete = await hasPermission(member, guildId, PermissionActions.TICKET_DELETE);
    if (!canDelete) {
      try {
        await interaction.channel.permissionOverwrites.edit(interaction.user.id, {
          ViewChannel: false
        });
      } catch (e) {
        console.error("Could not remove staff visibility", e);
      }
    }

    // Lösche eventuell die alte Nachricht mit dem "Close" Button (wenn möglich)
    await interaction.message.edit({ components: [] }).catch(() => {});

    await closeTicket(interaction.channel, interaction.user, ticketId, interaction.guild, interaction.client);
  }

  // TICKET WIEDER ÖFFNEN
  if (customId.startsWith('ticket_action_reopen_')) {
    const ticketId = customId.replace('ticket_action_reopen_', '');
    
    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_REOPEN))) {
      return interaction.reply({ content: t('bot.permission_denied', lang), flags: ['Ephemeral'] });
    }

    const ticket = await prisma.ticket.findUnique({ 
      where: { id: ticketId },
      include: { type: true }
    });
    if (!ticket) return interaction.reply({ content: 'Ticket nicht gefunden!', flags: ['Ephemeral'] });

    await interaction.deferUpdate();

    // Gib dem Ersteller die Rechte zurück
    if (ticket.creatorId) {
      try {
        await interaction.channel.permissionOverwrites.edit(ticket.creatorId, {
          ViewChannel: true,
          SendMessages: true
        });
      } catch (e) {}
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { 
        status: 'OPEN',
        closedAt: null
      }
    });

    // Components V2 UI für die Wiedereröffnung
    const components = [
      {
        type: 17, // Container
        components: [
          {
            type: 10, // Text
            content: `🔓 **Ticket wiedereröffnet von** <@${interaction.user.id}>\n> Das Ticket ist nun wieder für alle Beteiligten sichtbar.`,
          },
          {
            type: 1, // Action Row
            components: [
              {
                type: 2,
                custom_id: `ticket_action_close_${ticketId}`,
                label: lang === 'de' ? 'Ticket schließen' : 'Close Ticket',
                emoji: { name: '🔒' },
                style: 4
              }
            ]
          },
          {
            type: 10, // Footer
            content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
          }
        ]
      }
    ];

    // Lösche das Support-Control Panel
    await interaction.message.delete().catch(() => {});
    await interaction.channel.send({ 
      components: components,
      flags: 32768 // IS_COMPONENTS_V2
    });

    // Log re-open
    await sendTicketLog(interaction.guild, {
      title: t('bot.ticket_reopened', lang),
      description: t('bot.ticket_reopened_desc', lang, { user: `<@${interaction.user.id}>` }),
      color: '#22c55e',
      fields: [
        { name: 'Kanal', value: `<#${interaction.channel.id}>`, inline: true },
        { name: 'Ticket ID', value: `#${ticketId.substring(ticketId.length - 4)}`, inline: true }
      ]
    });

    // Kanal wieder auf offenen Namen zurückbenennen (Zuletzt)
    if (ticket.type?.channelNameFormat) {
      try {
        const creator = ticket.creatorId ? await interaction.client.users.fetch(ticket.creatorId).catch(() => null) : null;
        const uname = creator ? creator.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'user';
        const openName = ticket.type.channelNameFormat
          .replace('{username}', uname)
          .replace('{ticket-id}', ticket.id.substring(ticket.id.length - 4));
        
        interaction.channel.setName(openName).catch(e => console.warn("[Rename] Rate limit hit on reopen."));
      } catch (e) {
        console.error("Fehler beim Vorbereiten des Ticket-Rename:", e);
      }
    }
  }

  // TICKET ENDGÜLTIG LÖSCHEN
  if (customId.startsWith('ticket_action_delete_')) {
    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_DELETE))) {
      return interaction.reply({ content: '🛡️ **Berechtigung fehlt:** Du hast keine Erlaubnis, Tickets endgültig zu löschen.', flags: ['Ephemeral'] });
    }

    const ticketId = customId.replace('ticket_action_delete_', '');
    
    await interaction.reply({ 
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: '⛔ **Ticket-Löschung eingeleitet**\nDas Ticket wird in 5 Sekunden endgültig gelöscht.'
            },
            {
              type: 10, // Footer
              content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
            }
          ]
        }
      ],
      flags: 32768
    });
    
    // Log before deletion
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }});
    await sendTicketLog(interaction.guild, {
      title: '⛔ Ticket Gelöscht',
      description: `Das Ticket von <@${ticket?.creatorId || 'Unbekannt'}> wurde durch <@${interaction.user.id}> gelöscht.`,
      color: '#ef4444',
      fields: [
        { name: 'Ticket ID', value: `#${ticketId.substring(ticketId.length - 4)}`, inline: true }
      ]
    });

    setTimeout(async () => {
      try {
        // AUTOMATIC TRANSCRIPT ON DELETE
        console.log(`[Delete] Generiere automatisches Transcript für Ticket ${ticketId}...`);
        const htmlData = await generateTranscript(interaction.guild, ticketId, interaction.channel);
        if (htmlData && ticket) {
          const attachment = new AttachmentBuilder(Buffer.from(htmlData, 'utf-8'), { name: `transcript-deleted-${interaction.channel.name}.html` });
          
          // 1. Archivierung im Log-Kanal
          await sendTranscriptArchive(interaction.guild, attachment, {
            ticketId: ticket.id,
            creatorId: ticket.creatorId,
            closedById: interaction.user.id
          });

          // 2. DM an den Ersteller
          try {
            const creator = await interaction.client.users.fetch(ticket.creatorId);
            if (creator) {
              const dmEmbed = new EmbedBuilder()
                .setTitle('📄 Dein Ticket-Transcript')
                .setDescription(`Dein Ticket auf **${interaction.guild.name}** wurde gelöscht. Im Anhang findest du eine Kopie deines Gesprächsverlaufs.`)
                .setColor('#5865F2')
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTimestamp();
              
              await creator.send({ embeds: [dmEmbed], files: [attachment] });
              console.log(`[Delete] Transcript erfolgreich per DM an ${ticket.creatorId} gesendet.`);
            }
          } catch (dmError) {
            console.warn(`[Delete] Konnte Transcript nicht per DM an ${ticket.creatorId} senden (DMs geschlossen?).`);
          }
        }

        await interaction.channel.delete();
      } catch(e) {
        console.error("Fehler beim automatischen Lösch-Transcript:", e);
      }
    }, 5000);
  }

  // TRANSCRIPT ERSTELLEN
  if (customId.startsWith('ticket_action_transcript_')) {
    if (!(await hasPermission(member, guildId, PermissionActions.TICKET_TRANSCRIPT))) {
      return interaction.reply({ content: '🛡️ **Berechtigung fehlt:** Du darfst keine Transcripts anfordern.', flags: ['Ephemeral'] });
    }

    const ticketId = customId.replace('ticket_action_transcript_', '');
    await interaction.deferReply();
    
    try {
      // LIVE PERMISSION FIX: Sicherstellen, dass der Bot ALLES darf (vor allem Verlauf lesen)
      const botMember = await interaction.guild.members.fetchMe();
      if (interaction.channel.permissionsFor(botMember).has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory])) {
        // Alles okay
      } else {
        console.log(`[Transcript] Fixe Berechtigungen für Kanal ${interaction.channel.name}...`);
        await interaction.channel.permissionOverwrites.edit(botMember.id, {
          ViewChannel: true,
          ReadMessageHistory: true,
          SendMessages: true,
          AttachFiles: true,
          EmbedLinks: true
        });
      }

      console.log(`[Transcript] Starte HTML-Generierung für Ticket ${ticketId}...`);
      const htmlData = await generateTranscript(interaction.guild, ticketId, interaction.channel);
      
      if (!htmlData) {
        console.error(`[Transcript] HTML Daten waren leer für Ticket ${ticketId}`);
        return interaction.editReply({ content: 'Fehler: Das Transcript konnte nicht generiert werden (vielleicht keine Nachrichten vorhanden?).' });
      }
      
      const attachment = new AttachmentBuilder(Buffer.from(htmlData, 'utf-8'), { name: `transcript-${interaction.channel.name}.html` });
      
      await interaction.editReply({ 
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: '📄 **Transcript erstellt**\nHier ist dein HTML-Transcript des Gesprächsverlaufs.'
              },
              {
                type: 10, // Footer
                content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
              }
            ]
          }
        ],
        files: [attachment],
        flags: 32768
      });

      // Archive transcript in configured transcript channel
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
      if (ticket) {
        await sendTranscriptArchive(interaction.guild, attachment, {
          ticketId: ticket.id,
          creatorId: ticket.creatorId,
          closedById: interaction.user.id
        });
      }

      // Log transcript generation
      await sendTicketLog(interaction.guild, {
        title: '📝 HTML Transcript Erstellt',
        description: `Ein HTML-Transcript für das Ticket von <@${ticket?.creatorId || 'Unbekannt'}> wurde durch <@${interaction.user.id}> erstellt.`,
        color: '#6366f1',
        fields: [
          { name: 'Ticket ID', value: `#${ticketId.substring(ticketId.length - 4)}`, inline: true }
        ]
      });
    } catch(e) {
      console.error("TRANSCRIPT ERROR:", e);
      await interaction.editReply({ content: 'Kritischer Fehler beim Erstellen des Transcripts.' });
    }
  }

  // ENGLISCH ÜBERSETZUNG (BILINGUAL SUPPORT)
  if (customId.startsWith('ticket_action_lang_en_')) {
    const ticketId = customId.replace('ticket_action_lang_en_', '');
    const ticket = await prisma.ticket.findUnique({ 
      where: { id: ticketId },
      include: { type: true }
    });

    await interaction.reply({ 
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: '🇺🇸 **English Support**\n### • Important ℹ️\n> A team member will be with you shortly to assist with your **request**. Please briefly describe your issue now so we can help you **faster**. Thank you for your patience!'
            },
            {
              type: 10, // Footer
              content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
            }
          ]
        }
      ],
      flags: 32768
    });
  }
}
