/**
 * Utility to create standardized Components V2 messages for the Nexus OS System.
 */
export function createV2Message(content) {
  return {
    components: [
      {
        type: 17, // Container
        components: [
          {
            type: 10, // Text component
            content: content
          },
          {
            type: 10, // Footer component (Text)
            content: `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n**Nexus OS Ticket System** • ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`
          }
        ]
      }
    ],
    flags: 32768 // IS_COMPONENTS_V2
  };
}
