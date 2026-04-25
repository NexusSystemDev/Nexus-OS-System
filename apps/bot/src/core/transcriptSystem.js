import { prisma } from '@ticketbot/db';

export async function generateTranscript(guild, ticketId, channel) {
  if (!channel) return null;

  try {
    let allMessages = [];
    let lastId = null;
    const MAX_PAGES = 10; // Up to 1000 messages

    for (let i = 0; i < MAX_PAGES; i++) {
      const options = { limit: 100 };
      if (lastId) options.before = lastId;

      const messages = await channel.messages.fetch(options);
      if (messages.size === 0) break;

      allMessages.push(...Array.from(messages.values()));
      lastId = messages.last().id;

      if (messages.size < 100) break;
    }

    const sortedMessages = allMessages.reverse();
    console.log(`[Transcript System] ${sortedMessages.length} Nachrichten für Ticket ${ticketId} geladen.`);
    
    if (sortedMessages.length === 0) return null;
    
    let html = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Transcript - ${channel.name}</title>
    <style>
        body { 
            background-color: #313338; 
            color: #dbdee1; 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            padding: 40px;
            line-height: 1.5;
        }
        .container { max-width: 900px; margin: 0 auto; }
        .header { 
            border-bottom: 2px solid #3f4147; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: #b5bac1; margin: 5px 0 0 0; }
        
        .message { 
            display: flex; 
            margin-bottom: 20px; 
            padding: 5px 0;
        }
        .avatar { 
            width: 40px; height: 40px; 
            border-radius: 50%; 
            background-color: #5865F2; 
            margin-right: 15px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
        }
        .msg-content { flex: 1; }
        .msg-header { margin-bottom: 4px; }
        .username { color: white; font-weight: 600; margin-right: 8px; }
        .timestamp { color: #949ba4; font-size: 0.75rem; }
        .text { white-space: pre-wrap; word-wrap: break-word; }
        
        .footer { 
            margin-top: 50px; 
            border-top: 1px solid #3f4147; 
            padding-top: 20px; 
            text-align: center;
            color: #949ba4;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Transcript: ${escapeHtml(channel.name)}</h1>
            <p>Ticket ID: ${ticketId.substring(ticketId.length - 8)} | Datum: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="messages">`;
    
    for (const msg of sortedMessages) {
      const initials = msg.author.username.substring(0, 2).toUpperCase();
      const content = msg.content || (msg.attachments.size > 0 ? "_[Bild/Anhang]_" : "_[Nachricht ohne Text]_");
      
      html += `
            <div class="message">
                <div class="avatar">${initials}</div>
                <div class="msg-content">
                    <div class="msg-header">
                        <span class="username">${escapeHtml(msg.author.tag)}</span>
                        <span class="timestamp">${msg.createdAt.toLocaleString()}</span>
                    </div>
                    <div class="text">${escapeHtml(content)}</div>
                </div>
            </div>`;
    }

    html += `
        </div>
        <div class="footer">
            Dieses Transcript wurde automatisch vom NEXUS Ticket System generiert.
        </div>
    </div>
</body>
</html>`;

    await prisma.transcript.upsert({
      where: { ticketId: ticketId },
      update: { htmlData: html },
      create: { ticketId: ticketId, htmlData: html }
    });
    
    return html;
  } catch (error) {
    console.error("Fehler beim Erstellen des Transcripts:", error);
    return null;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
