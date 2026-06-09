# Google OAuth — RateLocal login/signup

The login and signup pages show **Continue with Google** only when `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.

## 1. Google Cloud Console

1. Open https://console.cloud.google.com/apis/credentials
2. Create or edit an **OAuth 2.0 Client ID** (Web application)
3. **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://ratelocal.ca`
   - `https://project-amber-omega-94.vercel.app` (Vercel preview)
4. **Authorized redirect URIs** (Supabase handles the OAuth callback):
   - `https://otnddwopphhxstteqizw.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**

## 2. Supabase

1. Dashboard → project **reviewflow** (`otnddwopphhxstteqizw`)
2. **Authentication** → **Providers** → **Google** → Enable
3. Paste Client ID and Client Secret → Save

## 3. Redirect URLs

**Authentication** → **URL Configuration** → add:

```
http://localhost:3000/auth/callback?next=/onboarding
https://ratelocal.ca/auth/callback?next=/onboarding
```

Signup uses `?next=/onboarding`; login uses `?next=/dashboard`.

## 4. App env

In `.env.local` (local) and Vercel env vars (production):

```
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

Restart the dev server after changing env vars.

## 5. Test

1. Incognito → https://ratelocal.ca/signup (or localhost:3000/signup)
2. Click **Continue with Google**
3. After consent → `/onboarding` wizard (new users) or `/dashboard` (returning users via login)

## Optional — leaked password protection

Supabase → **Authentication** → **Attack Protection** → enable **Leaked password protection** (HaveIBeenPwned check on signup/password change).
