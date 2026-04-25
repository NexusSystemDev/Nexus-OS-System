import { NextResponse } from 'next/server'
import { prisma } from '@ticketbot/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth.js'
import { hasAdminRights } from '../../../../../utils/security.js'

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Server-Sicherheit: Check nochmal via Discord API
    const resDiscord = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${session.accessToken}` }
    });
    if (!resDiscord.ok) return NextResponse.json({ error: 'Auth Error' }, { status: 401 });
    const guilds = await resDiscord.json();
    const targetGuild = guilds.find(g => g.id === params.guildId);
    
    if (!targetGuild || !hasAdminRights(targetGuild.permissions)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { config, panels, types, commands } = body;

    // 0.5. Input Validation (Anti-Abuse)
    if (!config || !panels || !types) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Limit check example: Beschreibungen max 2000 Zeichen
    const isOverLimit = 
      (config.logChannelId && config.logChannelId.length > 32) ||
      panels.some(p => (p.description?.length || 0) > 2048) ||
      types.some(t => (t.welcomeMessage?.length || 0) > 4096);

    if (isOverLimit) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }

    // 1. Update Base Config
    await prisma.guildConfig.update({
      where: { id: params.guildId },
      data: {
        ticketSystemActive: config.ticketSystemActive,
        logChannelId: config.logChannelId,
        transcriptChannelId: config.transcriptChannelId,
        autoDeleteHours: config.autoDeleteHours || 48,
        autoPingEnabled: config.autoPingEnabled || false,
        autoPingTime: parseInt(config.autoPingTime) || 30,
        prefix: config.prefix,
        welcomeChannelId: config.welcomeChannelId,
        
        // Security
        proxyProtectionEnabled: config.proxyProtectionEnabled || false,
        minAccountAge: parseInt(config.minAccountAge) || 0,
        globalBlacklistEnabled: config.globalBlacklistEnabled !== undefined ? config.globalBlacklistEnabled : true,
      }
    });

    // 2. Transaktional Panels Upserten
    const existingPanels = await prisma.ticketPanel.findMany({ where: { guildId: params.guildId } });
    const payloadPanelIds = panels.map(p => p.id);
    
    // Loesche fehlende Panels
    await prisma.ticketPanel.deleteMany({
      where: {
        guildId: params.guildId,
        id: { notIn: payloadPanelIds }
      }
    });

    for (const p of panels) {
      const data = {
        id: p.id,
        guildId: params.guildId,
        channelId: p.channelId || '0', 
        title: p.title,
        description: p.description,
        embedColor: p.embedColor,
        embedFooter: p.embedFooter,
        thumbnail: p.thumbnail,
        useSelectMenu: p.useSelectMenu,
        placeholderText: p.placeholderText,
        buttonText: p.buttonText,
        buttonStyle: p.buttonStyle,
      };

      const { id, ...updateData } = data;
      await prisma.ticketPanel.upsert({
        where: { id: data.id },
        create: data,
        update: updateData
      });
    }

    // 3. Types Upserten
    const existingTypes = await prisma.ticketType.findMany({ where: { guildId: params.guildId } });
    const payloadTypeIds = types.map(t => t.id);

    await prisma.ticketType.deleteMany({
      where: {
        guildId: params.guildId,
        id: { notIn: payloadTypeIds }
      }
    });

    for (const t of types) {
      const data = {
        id: t.id,
        guildId: params.guildId,
        panelId: t.panelId || null,
        name: t.name,
        emoji: t.emoji,
        description: t.description,
        isActive: t.isActive,
        categoryId: t.categoryId,
        supportRoles: t.supportRoles,
        welcomeMessage: t.welcomeMessage,
        embedTitle: t.embedTitle,
        channelNameFormat: t.channelNameFormat,
        closedChannelNameFormat: t.closedChannelNameFormat,
      };

      const { id, ...updateData } = data;
      await prisma.ticketType.upsert({
        where: { id: data.id },
        create: data,
        update: updateData
      });
    }

    // 4. Custom Commands Upserten
    if (commands) {
      const payloadCmdIds = commands.map(c => c.id);

      await prisma.customCommand.deleteMany({
        where: {
          guildId: params.guildId,
          id: { notIn: payloadCmdIds }
        }
      });

      for (const c of commands) {
        const data = {
          id: c.id,
          guildId: params.guildId,
          name: c.name,
          response: c.response,
          isEmbed: c.isEmbed
        };

        const { id, ...updateData } = data;
        await prisma.customCommand.upsert({
          where: { id: data.id },
          create: data,
          update: updateData
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
