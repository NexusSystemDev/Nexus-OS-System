import { prisma } from '@ticketbot/db';
import { closeTicket } from './ticketActions.js';

/**
 * Background worker that checks for inactive tickets and closes them automatically.
 * @param {import('discord.js').Client} client 
 */
export function startAutoCloseWorker(client) {
  console.log('[AutoClose] Worker gestartet (Intervall: 10 Minuten)');

  // Führe den Check alle 10 Minuten aus
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Finde alle Gilden mit aktivem Auto-Close
      const configs = await prisma.guildConfig.findMany({
        where: { autoCloseEnabled: true }
      });
      
      for (const config of configs) {
        if (config.autoCloseHours <= 0) continue;

        const CLOSE_THRESHOLD = config.autoCloseHours * 60 * 60 * 1000;
        const cutoff = new Date(now.getTime() - CLOSE_THRESHOLD);

        // Finde Tickets, die:
        // 1. In dieser Gilde sind
        // 2. Offen (OPEN) sind
        // 3. Seit dem Zeitraum nicht mehr aktualisiert wurden (Prisma updatedAt)
        const ticketsToClose = await prisma.ticket.findMany({
          where: {
            guildId: config.id,
            status: 'OPEN',
            updatedAt: { lt: cutoff },
            channelId: { not: null }
          }
        });

        if (ticketsToClose.length === 0) continue;

        console.log(`[AutoClose] ${ticketsToClose.length} potenziell inaktive Tickets für Gilde ${config.id} gefunden.`);

        for (const ticket of ticketsToClose) {
          try {
            const guild = client.guilds.cache.get(ticket.guildId);
            if (!guild) continue;

            const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);
            if (!channel) {
              // Kanal existiert nicht mehr, Ticket in DB schließen
              await prisma.ticket.update({ where: { id: ticket.id }, data: { status: 'CLOSED', closedAt: new Date() } });
              continue;
            }

            // Zweiter Check: Letzte Nachricht im Kanal prüfen (um sicherzugehen)
            const messages = await channel.messages.fetch({ limit: 1 }).catch(() => null);
            const lastMsg = messages?.first();

            if (lastMsg) {
              if (lastMsg.createdAt > cutoff) {
                // Es gab doch Aktivität, die Prisma noch nicht mitbekommen hat
                await prisma.ticket.update({
                  where: { id: ticket.id },
                  data: { updatedAt: lastMsg.createdAt }
                });
                continue;
              }
            }

            // Ticket schließen
            await closeTicket(channel, client.user, ticket.id, guild, client);
            console.log(`[AutoClose] Ticket ${ticket.id} wurde automatisch geschlossen.`);
            
          } catch (ticketError) {
            console.error(`[AutoClose] Fehler bei Ticket ${ticket.id}:`, ticketError);
          }
        }
      }
    } catch (error) {
      console.error('[AutoClose] Kritischer Fehler im AutoClose Worker:', error);
    }
  }, 10 * 60 * 1000); 
}
