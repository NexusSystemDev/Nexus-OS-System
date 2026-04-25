# Ticketbot - Professionelles Discord Ticket System

Dies ist ein komplettes, modernes und erweiterbares Discord Ticket System mit Web-Dashboard, geschrieben in reinem JavaScript.

## 25. Schritt-für-Schritt Setup Anleitung

1. **Repository klonen / öffnen**
   Öffne das Verzeichnis `Ticketbot` in deinem Terminal (VSCode).

2. **Abhängigkeiten installieren**
   Installiere alle Pakete für den Workspace im Root-Verzeichnis:
   ```bash
   npm install
   ```

3. **Umgebungsvariablen (.env) einrichten**
   Kopiere die `.env.example` zu `.env` und befülle sie mit deinen echten Daten:
   - `DATABASE_URL`: Verbindungsstring für deine PostgreSQL-Datenbank.
   - `DISCORD_TOKEN`: Dein Discord Bot Token aus dem Developer Portal.
   - `DISCORD_CLIENT_ID` & `SECRET`: Für den OAuth2-Login am Dashboard.
   - `NEXTAUTH_SECRET`: Generiere einen sicheren String (z.B. per `openssl rand -base64 32`).

4. **Datenbank vorbereiten (Prisma)**
   Sende das Schema an deine PostgreSQL-Datenbank und generiere den Client:
   ```bash
   npm run generate --workspace=@ticketbot/db
   npm run push --workspace=@ticketbot/db
   ```

## 26. Lokales Starten

Da es sich um einen Monorepo (Workspaces) handelt, startest du beide Apps am besten in getrennten Terminals:

**Terminal 1 (Der Bot):**
```bash
npm run dev --workspace=@ticketbot/bot
```

**Terminal 2 (Das Dashboard):**
```bash
npm run dev --workspace=@ticketbot/dashboard
```
Das Dashboard ist lokal unter `http://localhost:3000` erreichbar. Die Live-Version findest du unter `https://nexus-os-system.com`. Melde dich mit Discord an, wähle deinen Server und konfiguriere das Ticket-System.

## 27. Deployment Hinweise

- **Datenbank:** Nutze einen modernen PostgreSQL Anbieter (wie Supabase, Neon oder Render).
- **Dashboard (Next.js):** Das Dashboard lässt sich ideal auf **Vercel** bereitstellen. Du musst dort in den Projekt-Einstellungen als Build Command ggf. die Workspace-Commands angeben oder Vercel den Monorepo automatisch erkennen lassen.
- **Bot:** Den Bot solltest du auf einem Service laufen lassen, der 24/7 Dauerbetrieb erlaubt (z.B. **Railway**, **Render Background Worker** oder auf einem eigenen **VPS** via PM2). Eine Serverless-Umgebung wie Vercel ist für klassische Discord.js Bots *nicht* geeignet.

## 28. Typische Fehlerquellen

- **Discord Intents:** Fehlen die "Message Content", "Server Members" oder "Guilds" Intents im Discord Developer Portal, funktionieren manche Befehle oder Events nicht. Unbedingt im Portal aktivieren!
- **OAuth URI Mismatch:** Hast du vergessen `http://localhost:3000/api/auth/callback/discord` als Redirect-URI im Portal einzutragen? Dann scheitert der Dashboard Login mit einem Error.
- **Datenbank-URL:** Eine falsch formatierte `DATABASE_URL` führt zum sofortigen Absturz beim Start von Bot oder Dashboard (Prisma Initialization Error).
- **Fehlende Berechtigungen:** Stelle sicher, dass der Bot die `Manage Channels`, `Manage Roles` und `View Channels` Rechte (oder direkt `Administrator`) auf dem Server hat.

## 29. Verbesserungsvorschläge für später

- **Caching:** Nutze Redis, um Zugriffsrechte (Server-Zugehörigkeit) des Nutzers im Dashboard zwischenzuspeichern und die API Rate-Limits von Discord bei hoher Last nicht auszureizen.
- **Queue-System:** Für das Erstellen von großen Transcripts lohnt sich BullMQ, um den Event-Loop des Bots unter Last nicht zu blockieren.
- **Mehrsprachigkeit (i18n):** Das Dashboard und Bot-Nachrichten könnten durch eine Bibliothek wie `next-intl` oder ein einfaches JSON-Localization-System modular mehrsprachig gemacht werden (auf Guild-Konfigurations-Ebene).
