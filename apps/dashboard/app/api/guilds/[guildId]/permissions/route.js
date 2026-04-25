import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth.js';
import { verifyGuildAccess } from '../../../../../utils/security.js';
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

    const rolePermissions = await prisma.rolePermission.findMany({
      where: { guildId }
    });

    return NextResponse.json(rolePermissions);
  } catch (error) {
    console.error('Permissions GET API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;
    const hasAccess = await verifyGuildAccess(session.accessToken, guildId);
    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { matrix } = await req.json(); // Array of { roleId, permissions: [] }

    // Use a transaction to update permissions
    await prisma.$transaction([
      // 1. Delete all existing permissions for this guild to ensure a clean sync
      prisma.rolePermission.deleteMany({ where: { guildId } }),
      // 2. Create new permissions from matrix
      prisma.rolePermission.createMany({
        data: matrix.map(item => ({
          guildId,
          roleId: item.roleId,
          permissions: item.permissions
        }))
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Permissions POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
