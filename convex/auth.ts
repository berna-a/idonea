import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

/**
 * Password provider locked to an allowlist. New accounts (signUp flow) are only
 * created for emails listed in ADMIN_ALLOWED_EMAILS (comma-separated). Sign-in for
 * existing accounts is unaffected. With the env var unset, no new account can ever
 * be created — the only admins are the ones seeded via seedAdmin.
 */
const AllowlistedPassword = Password({
  profile(params) {
    const email = String(params.email ?? '');
    if (params.flow === 'signUp') {
      const allowed = (process.env.ADMIN_ALLOWED_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (!allowed.includes(email.toLowerCase())) {
        throw new Error('O registo de novas contas está desactivado.');
      }
    }
    return { email };
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [AllowlistedPassword],
});
