import { Collection } from 'discord.js';

// Action tracker: Key = GuildID:UserID -> { count: number, lastAction: timestamp, isLocked: boolean }
const actionTracker = new Collection();

const DELETE_LIMIT = 5; // Max 5 deletions
const TIME_WINDOW = 60000; // per 60 seconds
const LOCK_DURATION = 1800000; // 30 minutes lockout

/**
 * Checks if an action is allowed based on Anti-Nuke limits.
 * @param {string} guildId 
 * @param {string} userId 
 * @param {string} action - e.g., 'DELETE_TICKET'
 * @returns {Object} { allowed: boolean, remaining: number, reason: string }
 */
export function checkAntiNuke(guildId, userId, action) {
  const key = `${guildId}:${userId}:${action}`;
  const now = Date.now();
  
  let data = actionTracker.get(key) || { count: 0, firstAction: now, isLocked: false, lockUntil: 0 };

  // Check if locked
  if (data.isLocked) {
    if (now < data.lockUntil) {
      return { 
        allowed: false, 
        reason: 'ANTI_NUKE_LOCK', 
        timeLeft: Math.round((data.lockUntil - now) / 1000 / 60) 
      };
    } else {
      // Lock expired
      data.isLocked = false;
      data.count = 0;
      data.firstAction = now;
    }
  }

  // Reset window if time passed
  if (now - data.firstAction > TIME_WINDOW) {
    data.count = 0;
    data.firstAction = now;
  }

  data.count += 1;
  actionTracker.set(key, data);

  // Trigger Lock if limit exceeded
  if (data.count > DELETE_LIMIT) {
    data.isLocked = true;
    data.lockUntil = now + LOCK_DURATION;
    actionTracker.set(key, data);
    
    return { 
      allowed: false, 
      reason: 'LIMIT_EXCEEDED', 
      timeLeft: Math.round(LOCK_DURATION / 1000 / 60) 
    };
  }

  return { allowed: true, remaining: DELETE_LIMIT - data.count };
}

/**
 * Resets the anti-nuke lock for a specific user (Admin command only).
 */
export function resetAntiNuke(guildId, userId, action) {
  const key = `${guildId}:${userId}:${action}`;
  actionTracker.delete(key);
}
