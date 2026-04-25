import { SlashCommandBuilder } from 'discord.js';
import { createV2Message } from '../utils/v2Factory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Prüft die Verbindung und den Bot-Status.'),
  async execute(interaction) {
    await interaction.reply(createV2Message('Pong! 🏓 **Nexus OS System** ist online und betriebsbereit.'));
  },
};
