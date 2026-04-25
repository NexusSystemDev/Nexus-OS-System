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

    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });

    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch roles from Discord' }, { status: 500 });

    const roles = await res.json();
    
    // Sort roles by position and filter out @everyone (if desired) and bot roles
    const filteredRoles = roles
      .filter(role => !role.managed && role.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(role => ({
        id: role.id,
        name: role.name,
        color: `#${role.color.toString(16).padStart(6, '0')}`,
        position: role.position
      }));

    return NextResponse.json(filteredRoles);
  } catch (error) {
    console.error('Roles API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
