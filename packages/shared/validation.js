import { z } from 'zod';

export const ticketPanelSchema = z.object({
  channelId: z.string().min(17),
  title: z.string().min(1).max(256),
  description: z.string().max(4096).optional(),
  embedColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  buttonText: z.string().min(1).max(80),
  buttonStyle: z.enum(['PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER']),
});

export const ticketTypeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1024).optional(),
  categoryId: z.string().optional(),
  embedColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  supportRoles: z.array(z.string()),
});
