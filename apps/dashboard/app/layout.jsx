import './globals.css'
import { AuthProvider } from '../components/AuthProvider'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'NEXUS Dashboard',
  description: 'Manage your Discord ticket system',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" className="min-h-screen">
      <body className="min-h-screen flex flex-col bg-[#111214]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-[1400px] mx-auto">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
