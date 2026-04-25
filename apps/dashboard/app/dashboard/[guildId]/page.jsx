import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { authOptions } from '../../../lib/auth.js'
import { prisma } from '@ticketbot/db'
import GuildConfigForm from '../../../components/GuildConfigForm'
import { verifyGuildAccess } from '../../../utils/security.js'
import SystemLockout from '../../../components/SystemLockout'

export default async function GuildConfigPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  const { guildId } = params;
  
  // 1. Verify Access
  const auth = await verifyGuildAccess(session.accessToken, guildId);
  
  if (!auth.allowed) {
    return <SystemLockout />;
  }

  // Fetch from Prisma directly
  let dbConfig = await prisma.guildConfig.findUnique({
    where: { id: guildId },
    include: {
      ticketPanels: true,
      ticketTypes: true,
      blacklists: true,
      customCommands: true
    }
  });

  if (!dbConfig) {
    try {
      dbConfig = await prisma.guildConfig.create({
        data: {
          id: guildId,
          name: 'Dashboard Initialized Server'
        },
        include: {
          ticketPanels: true,
          ticketTypes: true,
          blacklists: true,
          customCommands: true
        }
      });
    } catch(e) {
      dbConfig = await prisma.guildConfig.findUnique({
        where: { id: guildId },
        include: { ticketPanels: true, ticketTypes: true, blacklists: true, customCommands: true }
      });
    }
  }

  // Next.js kann Datumsobjekte nicht an Client-Components übergeben.
  const serializedConfig = JSON.parse(JSON.stringify(dbConfig));

  return (
    <main className="min-h-screen bg-[#111214] p-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12 border-b border-accent/20 pb-6">
          <Link href="/dashboard" className="p-3 bg-white/5 hover:bg-accent/10 rounded-xl text-gray-400 hover:text-accent-light transition-all duration-300 border border-white/5 hover:border-accent/20">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-accent-light via-orange-400 to-white text-glow">
              Einstellungen
            </h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              Konfiguriere das Ticket-System für <span className="text-accent-light/80 font-mono text-sm px-2 py-0.5 bg-accent/5 rounded">ID: {guildId}</span>
            </p>
          </div>
        </div>

        {/* Die große interaktive React Form-Komponente */}
        <GuildConfigForm 
          serverId={guildId} 
          initialConfig={serializedConfig} 
          userPermissions={auth.permissions}
        />
      </div>
    </main>
  )
}
