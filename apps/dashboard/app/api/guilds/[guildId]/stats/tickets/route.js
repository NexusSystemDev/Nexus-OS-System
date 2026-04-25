import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth.js';
import { verifyGuildAccess } from '../../../../../../utils/security.js';
import { prisma } from '@ticketbot/db';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;
    const hasAccess = await verifyGuildAccess(session.accessToken, guildId);
    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 1. Basic Counts
    const [total, open, closed] = await Promise.all([
      prisma.ticket.count({ where: { guildId } }),
      prisma.ticket.count({ where: { guildId, status: 'OPEN' } }),
      prisma.ticket.count({ where: { guildId, status: 'CLOSED' } })
    ]);

    // 2. Average Response Time (Accurate: First Claim - CreatedAt)
    const claimLogs = await prisma.ticketLog.findMany({
      where: { 
        ticket: { guildId },
        action: 'CLAIMED'
      },
      include: { ticket: true },
      orderBy: { createdAt: 'asc' } // Earliest first
    });

    // We only want the FIRST claim for each ticket
    const firstClaims = new Map();
    claimLogs.forEach(log => {
      if (!firstClaims.has(log.ticketId)) {
        firstClaims.set(log.ticketId, log);
      }
    });

    let totalResponseTime = 0;
    firstClaims.forEach(log => {
      const diff = new Date(log.createdAt).getTime() - new Date(log.ticket.createdAt).getTime();
      totalResponseTime += diff;
    });
    const avgResponseTime = firstClaims.size > 0 ? totalResponseTime / firstClaims.size : 0;

    // 3. Leaderboard (Top Staff by tickets claimed)
    // We count unique tickets each user has geclaimt
    const leaderStats = await prisma.ticketLog.groupBy({
      by: ['userId'],
      where: { 
        ticket: { guildId },
        action: 'CLAIMED'
      },
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 5
    });

    // 4. History (Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const historyData = await prisma.ticket.groupBy({
      by: ['createdAt'],
      where: { 
        guildId,
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: { _all: true }
    });

    // Grouping history by day
    const historyByDay = {};
    historyData.forEach(item => {
      const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
      historyByDay[dateKey] = (historyByDay[dateKey] || 0) + item._count._all;
    });

    // Fill missing days with 0
    const finalHistory = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().split('T')[0];
      finalHistory.push({ date: k, count: historyByDay[k] || 0 });
    }

    return NextResponse.json({
      summary: {
        total,
        open,
        closed,
        avgResponseTimeMs: Math.round(avgResponseTime)
      },
      leaderboard: leaderStats.map(s => ({
        userId: s.userId,
        count: s._count.userId
      })),
      history: finalHistory
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
