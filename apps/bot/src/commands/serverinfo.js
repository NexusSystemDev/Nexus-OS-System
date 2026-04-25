import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { createV2Message } from '../utils/v2Factory.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Zeigt detaillierte Server- und Shard-Informationen an'),

  async execute(interaction) {
    const { guild } = interaction;
    
    // Member count fetching
    await guild.members.fetch();
    const members = guild.members.cache;
    const totalMembers = guild.memberCount;
    const bots = members.filter(m => m.user.bot).size;
    
    // Channel & Role calculation
    const channels = guild.channels.cache;
    const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
    const totalChannels = textChannels + voiceChannels;
    const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;
    const roles = guild.roles.cache.size;

    // Premium/Shard Mock (Da der Bot aktuell nicht auf Tausenden Servern läuft,
    // simulieren wir diese "Premium/Primary Shard" Anzeige analog zu deinem Beispiel, 
    // oder geben echte Shard-Werter an, falls wir im Sharding-Modus sind).
    const shardId = interaction.client.shard ? interaction.client.shard.ids[0] : 0;
    const totalShards = interaction.client.shard ? interaction.client.shard.count : 1;

    // Um genau dein "Premium Shard" Layout zu treffen:
    const primaryShardText = `Primary Shard:${shardId} (checked ${totalShards} shards)`;
    const premiumShardText = `Premium Shard:1 (checked 1 shards)`;

    const infoText = `### Server Info - ${guild.name}\n` +
      `• **Mitglieder:** ${totalMembers} (${bots} Bots)\n` +
      `• **Kanäle:** ${totalChannels} (${categories} Kategorien)\n` +
      `• **Rollen:** ${roles}\n\n` +
      `**Shard Info**\n> ${primaryShardText}\n> ${premiumShardText}`;
      
    await interaction.reply(createV2Message(infoText));
  },
};
