import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import { BotClient } from './client.js';

const client = new BotClient();

client.start().catch((err) => {
  console.error("Failed to start bot:", err);
});
