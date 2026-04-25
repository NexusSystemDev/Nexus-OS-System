export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth.js';
import { hasAdminRights } from '../../../../../utils/security.js';
import { prisma } from '@ticketbot/db';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Sicherheit: Check user permissions for this guild
    const resDiscord = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    if (!resDiscord.ok) return NextResponse.json({ error: 'Auth Error' }, { status: 401 });
    
    const guilds = await resDiscord.json();
    const targetGuild = guilds.find(g => g.id === params.guildId);
    if (!targetGuild || !hasAdminRights(targetGuild.permissions)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Bot Token Auth für Guild Stats Fetch
    const botToken = process.env.DISCORD_TOKEN;
    
    // 1. Fetch Guild Base Info (Roles count)
    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${params.guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    
    if (!guildRes.ok) {
      return NextResponse.json({ error: 'Bot not in guild or discord API error' }, { status: 400 });
    }
    
    const guildData = await guildRes.json();
    
    // 2. Fetch Channels
    const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${params.guildId}/channels`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    const channelsData = await channelsRes.json();

    let textVoiceCount = 0;
    let categoryCount = 0;

    if (Array.isArray(channelsData)) {
      channelsData.forEach(c => {
        if (c.type === 4) categoryCount++;
        else textVoiceCount++;
      });
    }

    // 3. Fetch Ticket Stats from Prisma
    const [total, active, closed, claimed] = await Promise.all([
      prisma.ticket.count({ where: { guildId: params.guildId } }),
      prisma.ticket.count({ where: { guildId: params.guildId, status: 'OPEN' } }),
      prisma.ticket.count({ where: { guildId: params.guildId, status: 'CLOSED' } }),
      prisma.ticket.count({ 
        where: { 
          guildId: params.guildId, 
          claimedById: { not: null } 
        } 
      })
    ]);

    const data = {
      // Discord Meta
      members: guildData.approximate_member_count || 0,
      channels: textVoiceCount,
      roles: Array.isArray(guildData.roles) ? guildData.roles.length : 0,
      categories: categoryCount,
      
      // Ticket Metrics (Required for StatsTab)
      total,
      active,
      closed,
      claimed,
      
      // System Pulse
      primaryShardId: parseInt(params.guildId) % 200, 
      primaryShardCount: 200,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
