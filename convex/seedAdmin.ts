import { createAccount } from '@convex-dev/auth/server';
import { internalAction } from './_generated/server';
import { v } from 'convex/values';

/** Provisions an admin account. Run via `npx convex run seedAdmin:seedAdmin`. */
export const seedAdmin = internalAction({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    await createAccount(ctx, {
      provider: 'password',
      account: { id: email, secret: password },
      profile: { email },
    });
  },
});
