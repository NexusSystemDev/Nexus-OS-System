import { prisma } from '@ticketbot/db';
import { generateTranscript } from './transcriptSystem.js';
import { sendTranscriptArchive } from '../utils/logging.js';
import { AttachmentBuilder } from 'discord.js';
import { Buffer } from 'node:buffer';

/**
 * Background worker that checks for tickets to auto-delete.
 * @param {import('discord.js').Client} client 
 */
export function startAutoDeleteWorker(client) {
  console.log('[AutoDelete] Worker gestartet (Intervall: 15 Minuten)');

  // Führe den Check alle 15 Minuten aus
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Finde alle Gilden mit ihren Configs
      const configs = await prisma.guildConfig.findMany();
      
      for (const config of configs) {
        if (config.autoDeleteHours <= 0) continue;

        const DELETE_THRESHOLD = config.autoDeleteHours * 60 * 60 * 1000;
        const cutoff = new Date(now.getTime() - DELETE_THRESHOLD);

        const ticketsToDelete = await prisma.ticket.findMany({
          where: {
            guildId: config.id,
            status: 'CLOSED',
            closedAt: {
              lt: cutoff,
              not: null
            },
            channelId: {
              not: null
            }
          }
        });

        if (ticketsToDelete.length === 0) continue;
        
        console.log(`[AutoDelete] ${ticketsToDelete.length} abgelaufene Tickets für Gilde ${config.id} gefunden.`);
        
        for (const ticket of ticketsToDelete) {
        try {
          const guild = client.guilds.cache.get(ticket.guildId);
          if (!guild) continue;

          const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);
          
          if (channel) {
            // 1. Transcript generieren für Archiv
            console.log(`[AutoDelete] Archivierung vor Löschung für Ticket ${ticket.id}...`);
            const htmlData = await generateTranscript(guild, ticket.id, channel);
            
            if (htmlData) {
              const attachment = new AttachmentBuilder(Buffer.from(htmlData, 'utf-8'), { name: `transcript-auto-${channel.name}.html` });
              await sendTranscriptArchive(guild, attachment, {
                ticketId: ticket.id,
                creatorId: ticket.creatorId,
                closedById: 'AUTO_DELETION'
              });
            }

            // 2. Kanal löschen
            await channel.delete('Automatisches Löschen nach 48h').catch(() => {});
          }

          // 3. Ticket in DB als "Gelöscht" markieren (oder ganz löschen)
          // Wir leeren die ChannelId, damit der Worker es nicht nochmal anfasst
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { 
              channelId: null,
              status: 'CLOSED' 
            }
          });

          console.log(`[AutoDelete] Ticket ${ticket.id} erfolgreich verarbeitet.`);
        } catch (ticketError) {
          console.error(`[AutoDelete] Fehler bei Ticket ${ticket.id}:`, ticketError);
        }
      }
    }
  } catch (error) {
    console.error('[AutoDelete] Kritischer Fehler im Background Worker:', error);
  }
}, 15 * 60 * 1000); // Check alle 15 Minuten
}

