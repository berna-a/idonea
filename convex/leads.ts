import { getAuthUserId } from '@convex-dev/auth/server';
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public: captures a contact-form submission. Server-side validation mirrors the
 * client zod schema so the endpoint is safe even called directly. `honeypot` is a
 * hidden field the real form never fills — a value means a bot, so we drop it silently.
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    interest: v.optional(v.string()),
    message: v.string(),
    property_ref: v.optional(v.string()),
    property_title: v.optional(v.string()),
    intent: v.optional(v.string()),
    source: v.optional(v.string()),
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.honeypot && args.honeypot.trim() !== '') return null;

    const name = args.name.trim().slice(0, 100);
    const email = args.email.trim().slice(0, 255);
    const message = args.message.trim().slice(0, 2000);
    if (!name || !email || !message) throw new Error('Campos obrigatórios em falta.');
    if (!EMAIL_RE.test(email)) throw new Error('Email inválido.');

    return ctx.db.insert('leads', {
      name,
      email,
      message,
      phone: args.phone?.trim().slice(0, 40) || undefined,
      interest: args.interest || undefined,
      property_ref: args.property_ref || undefined,
      property_title: args.property_title?.slice(0, 200) || undefined,
      intent: args.intent || undefined,
      source: args.source || 'contact-form',
      status: 'new',
    });
  },
});

/** Admin only: all leads, most recent first. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Não autenticado.');
    return ctx.db.query('leads').order('desc').collect();
  },
});
