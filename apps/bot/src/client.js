import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { loadEvents } from './handlers/events.js';
import { loadCommands } from './handlers/commands.js';
import { startAutoDeleteWorker } from './core/autoDeleteWorker.js';
import { startAutoPingWorker } from './core/autoPingWorker.js';
import { startAutoCloseWorker } from './core/autoCloseWorker.js';

export class BotClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ]
    });
    
    this.commands = new Collection();
  }

  async start() {
    const token = process.env.DISCORD_TOKEN;
    if (!token) throw new Error("DISCORD_TOKEN is missing in .env");

    await loadEvents(this);
    await loadCommands(this);

    await this.login(token);
    startAutoDeleteWorker(this);
    startAutoPingWorker(this);
    startAutoCloseWorker(this);
  }
}
