'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, User, ShieldCheck, Github } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-[100] w-full px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center bg-[#111214]/60 backdrop-blur-2xl border border-white/5 rounded-3xl px-8 py-3.5 shadow-2xl">
        
        {/* Logo & Branding */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="Nexus Logo" 
              className="w-10 h-10 object-contain rounded-xl shadow-[0_0_20px_rgba(249, 115, 22,0.5)] group-hover:scale-110 transition-all duration-500" 
            />
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="tracking-tighter text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              NEXUS
            </span>
            <span className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase -mt-1 group-hover:text-orange-400/80 transition-colors">OS System</span>
          </div>
        </Link>

        {/* Navigation Links & Auth */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-all group/home"
              >
                <span className="hidden sm:block">Startseite</span>
              </Link>

              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-all group/link"
              >
                <LayoutDashboard size={18} className="group-hover/link:text-orange-400 transition-colors" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>

              <div className="h-4 w-px bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-4 group/profile">
                <div className="flex flex-col items-end hidden lg:flex">
                  <span className="text-sm font-bold text-white text-glow">{session.user.name}</span>
                  <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">Authorized</span>
                </div>
                <div className="relative">
                  <img 
                    src={session.user.image} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-2xl border-2 border-white/5 group-hover/profile:border-orange-500/50 transition-all shadow-lg" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#090a0b] border-2 border-white/5 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </div>
                
                <button 
                  onClick={() => signOut()} 
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20 active:scale-95 group/logout"
                  title="Abmelden"
                >
                  <LogOut size={18} className="group-hover/logout:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => signIn('discord')} 
              className="flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-xl shadow-amber-600/20 active:scale-95 group/login"
            >
              <Github size={18} className="group-hover/login:rotate-12 transition-transform" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
