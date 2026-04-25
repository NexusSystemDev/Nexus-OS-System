import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth.js';

const DISCORD_API_URL = 'https://discord.com/api/v10';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Security Check: Only Owner
    const userRes = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    const userData = await userRes.json();
    const ownerId = (process.env.BOT_OWNER_ID || '').replace(/"/g, '').trim();
    const receivedId = (userData.id || '').trim();

    if (receivedId !== ownerId) {
      console.warn(`[AUTH] Unauthorized GET attempt by ${receivedId} (Owner: ${ownerId})`);
      return NextResponse.json({ error: 'Forbidden', debug: { received: receivedId, expected: ownerId || 'NOT_FOUND' } }, { status: 403 });
    }

    // 1. Fetch Current User Details (Avatar)
    const userBotRes = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });
    const userBotData = await userBotRes.json();

    // 2. Fetch Application Details (Bio & Banner)
    const appRes = await fetch(`${DISCORD_API_URL}/applications/@me`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });
    const appData = await appRes.json();

    return NextResponse.json({
      username: userBotData.username,
      id: userBotData.id,
      avatar: userBotData.avatar ? `https://cdn.discordapp.com/avatars/${userBotData.id}/${userBotData.avatar}.png?size=1024` : null,
      banner: appData.cover_image ? `https://cdn.discordapp.com/app-icons/${appData.id}/${appData.cover_image}.png?size=1024` : null,
      bio: appData.description || ''
    });
  } catch (error) {
    console.error('Bot Profile Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRes = await fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    const userData = await userRes.json();
    
    const ownerId = (process.env.BOT_OWNER_ID || '').replace(/"/g, '').trim();
    const receivedId = (userData.id || '').trim();

    if (receivedId !== ownerId) {
      return NextResponse.json({ 
        error: `Forbidden: Identity Mismatch.`,
        debug: { received: receivedId, expected: ownerId || 'NOT_FOUND' }
      }, { status: 403 });
    }

    const { avatar, banner, bio } = await req.json();

    if (avatar && avatar.startsWith('data:')) {
      const avatarRes = await fetch(`${DISCORD_API_URL}/users/@me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ avatar })
      });
    }

    const appData = {};
    if (bio !== undefined) appData.description = bio;
    if (banner && banner.startsWith('data:')) appData.cover_image = banner;

    if (Object.keys(appData).length > 0) {
      const appRes = await fetch(`${DISCORD_API_URL}/applications/@me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appData)
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bot Profile Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
