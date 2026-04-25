import { NextResponse } from 'next/server';
import { prisma } from '@ticketbot/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth.js';
import { verifyGuildAccess } from '../../../../../../utils/security.js';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId, ticketId } = params;

    const hasAccess = await verifyGuildAccess(session.accessToken, guildId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const transcript = await prisma.transcript.findUnique({
      where: { ticketId: ticketId },
      include: {
        ticket: {
          include: {
            type: {
              select: {
                name: true,
                emoji: true
              }
            },
            guild: {
              select: {
                name: true,
                icon: true
              }
            }
          }
        }
      }
    });

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      html: transcript.htmlData,
      ticket: transcript.ticket 
    });
  } catch (error) {
    console.error('Transcript Fetch API Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
