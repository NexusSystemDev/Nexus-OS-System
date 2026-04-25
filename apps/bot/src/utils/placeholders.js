/**
 * Replaces placeholders in a string with dynamic values.
 * @param {string} text - The raw response text
 * @param {object} context - Context containing user, sender, guild, etc.
 * @returns {string} - The processed text
 */
export function replacePlaceholders(text, context) {
  if (!text) return '';
  
  let processed = text;
  
  // {user} -> The targeted user (mention)
  if (context.user) {
    processed = processed.replace(/{user}/g, `<@${context.user.id}>`);
    processed = processed.replace(/{user_name}/g, context.user.username);
  }

  // {role} -> The targeted role (mention)
  if (context.role) {
    processed = processed.replace(/{role}/g, `<@&${context.role.id}>`);
    processed = processed.replace(/{role_name}/g, context.role.name);
  }
  
  // {sender} -> The person who ran the command (mention)
  if (context.sender) {
    processed = processed.replace(/{sender}/g, `<@${context.sender.id}>`);
    processed = processed.replace(/{sender_name}/g, context.sender.username);
  }
  
  // {channel} -> Current channel
  if (context.channel) {
    processed = processed.replace(/{channel}/g, `<#${context.channel.id}>`);
    processed = processed.replace(/{channel_name}/g, context.channel.name);
  }
  
  // {guild} -> Server name
  if (context.guild) {
    processed = processed.replace(/{guild}/g, context.guild.name);
  }

  return processed;
}
