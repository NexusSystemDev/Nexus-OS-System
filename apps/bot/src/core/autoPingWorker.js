import { prisma } from '@ticketbot/db';
import { EmbedBuilder } from 'discord.js';

/**
 * Background worker that checks for unclaimed tickets and pings support.
 * @param {import('discord.js').Client} client 
 */
export function startAutoPingWorker(client) {
  console.log('[AutoPing] Worker gestartet (Intervall: 1 Minute)');

  // Führe den Check jede Minute aus
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Finde alle Gilden mit aktivem Auto-Ping
      const configs = await prisma.guildConfig.findMany({
        where: { autoPingEnabled: true }
      });
      
      for (const config of configs) {
        if (config.autoPingTime <= 0) continue;

        const PING_THRESHOLD = config.autoPingTime * 60 * 1000;
        const cutoff = new Date(now.getTime() - PING_THRESHOLD);

        // Finde Tickets, die:
        // 1. In dieser Gilde sind
        // 2. Offen (OPEN) sind
        // 3. Noch NICHT geclaimed wurden
        // 4. Älter als die Threshold sind
        // 5. Noch NICHT bereits gepingt wurden (Check via Logs)
        const ticketsToPing = await prisma.ticket.findMany({
          where: {
            guildId: config.id,
            status: 'OPEN',
            claimedById: null,
            createdAt: { lt: cutoff },
            channelId: { not: null }
          },
          include: {
            type: true,
            logs: {
              where: { action: 'AUTO_PINGED' }
            }
          }
        });

        // Filtere Tickets heraus, die bereits gepingt wurden
        const unpingedTickets = ticketsToPing.filter(t => t.logs.length === 0);

        if (unpingedTickets.length === 0) continue;

        console.log(`[AutoPing] ${unpingedTickets.length} fällige Pings für Gilde ${config.id} gefunden.`);

        for (const ticket of unpingedTickets) {
          try {
            const guild = client.guilds.cache.get(ticket.guildId);
            if (!guild) continue;

            const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);
            if (!channel) continue;

            // Permission Guard: Kann der Bot überhaupt in den Kanal sehen/schreiben?
            const permissions = channel.permissionsFor(client.user);
            if (!permissions || !permissions.has(['ViewChannel', 'SendMessages'])) {
              console.warn(`[AutoPing] Fehlende Rechte in Kanal ${channel.id} für Ticket ${ticket.id}`);
              continue;
            }

            // Rollen zum Pingen finden (Typ-spezifisch oder global)
            const rolesToPing = ticket.type.supportRoles && ticket.type.supportRoles.length > 0
              ? ticket.type.supportRoles.map(id => `<@&${id}>`).join(' ')
              : (config.supportManagerRoleId ? `<@&${config.supportManagerRoleId}>` : '@here');

            const embed = new EmbedBuilder()
              .setTitle('🔔 Unbeanspruchtes Ticket')
              .setDescription(`Dieses Ticket ist seit über **${config.autoPingTime} Minuten** offen und wurde noch nicht übernommen.`)
              .addFields(
                { name: 'Kategorie', value: ticket.type.name, inline: true },
                { name: 'Nutzer', value: `<@${ticket.creatorId}>`, inline: true }
              )
              .setColor('#f59e0b') // Amber/Orange
              .setTimestamp();

            await channel.send({ 
              content: `⚠️ **Aufmerksamkeit benötigt!** ${rolesToPing}`,
              embeds: [embed] 
            });

            // Logge die Aktion, damit wir nicht nochmal pingen
            await prisma.ticketLog.create({
              data: {
                ticketId: ticket.id,
                action: 'AUTO_PINGED',
                userId: client.user.id,
                details: `Auto-Ping nach ${config.autoPingTime} Minuten Inaktivität gesendet.`
              }
            });

            console.log(`[AutoPing] Ping für Ticket ${ticket.id} gesendet.`);
          } catch (ticketError) {
            console.error(`[AutoPing] Fehler bei Ticket ${ticket.id}:`, ticketError);
          }
        }
      }
    } catch (error) {
      console.error('[AutoPing] Kritischer Fehler im Background Worker:', error);
    }
  }, 60 * 1000); // Check jede Minute
}
