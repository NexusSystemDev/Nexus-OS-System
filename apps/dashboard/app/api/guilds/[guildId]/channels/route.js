import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth.js';
import { verifyGuildAccess } from '../../../../../utils/security.js';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;
    const hasAccess = await verifyGuildAccess(session.accessToken, guildId);
    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });

    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch channels from Discord' }, { status: 500 });

    const channels = await res.json();
    
    // Filter only categories (type 4)
    const categories = channels
      .filter(channel => channel.type === 4)
      .sort((a, b) => a.position - b.position)
      .map(channel => ({
        id: channel.id,
        name: channel.name,
        position: channel.position
      }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Channels API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
