import { NextResponse } from 'next/server';
import { prisma } from '@ticketbot/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth.js';
import { verifyGuildAccess } from '../../../../../utils/security.js';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await verifyGuildAccess(session.accessToken, params.guildId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const transcripts = await prisma.ticket.findMany({
      where: {
        guildId: params.guildId,
        transcript: {
          isNot: null
        }
      },
      include: {
        transcript: {
          select: {
            createdAt: true,
            id: true
          }
        },
        type: {
          select: {
            name: true,
            emoji: true
          }
        }
      },
      orderBy: {
        closedAt: 'desc'
      },
      take: 50 
    });

    const formatted = transcripts.map(t => ({
      id: t.id,
      shortId: t.id.substring(t.id.length - 8),
      creatorId: t.creatorId,
      claimedById: t.claimedById,
      status: t.status,
      closedAt: t.closedAt,
      createdAt: t.createdAt,
      typeName: t.type?.name || 'Unbekannt',
      typeEmoji: t.type?.emoji || '🎫',
      transcriptId: t.transcript?.id
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Archive API Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
