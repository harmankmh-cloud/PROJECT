import type { SupabaseClient, User } from "@supabase/supabase-js";
import { friendlyAuthError } from "@/lib/auth-errors";
import { authConfirmUrl } from "@/lib/auth/redirect-origin";

export type SignupResult =
  | { status: "confirm_email" }
  | { status: "logged_in"; user: User }
  | { status: "already_registered" }
  | { status: "error"; message: string };

type SignUpOptions = {
  email: string;
  password: string;
  metadata: Record<string, unknown>;
  fallbackOrigin?: string;
};

function isAlreadyRegisteredMessage(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already registered") ||
    lower.includes("email address is already") ||
    lower.includes("duplicate")
  );
}

/** Detect Supabase "silent" repeat signup (email confirm enabled, account exists). */
function isRepeatSignupUser(user: User | null) {
  return Boolean(user && (!user.identities || user.identities.length === 0));
}

export async function signUpAccount(
  supabase: SupabaseClient,
  { email, password, metadata, fallbackOrigin }: SignUpOptions
): Promise<SignupResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: metadata,
      emailRedirectTo: authConfirmUrl(fallbackOrigin),
    },
  });

  if (error) {
    if (isAlreadyRegisteredMessage(error.message)) {
      return { status: "already_registered" };
    }
    return { status: "error", message: friendlyAuthError(error.message) };
  }

  if (isRepeatSignupUser(data.user)) {
    return { status: "already_registered" };
  }

  if (data.user && !data.session) {
    return { status: "confirm_email" };
  }

  if (data.user) {
    return { status: "logged_in", user: data.user };
  }

  return { status: "error", message: "Sign-up failed. Please try again." };
}

export const SIGNUP_ALREADY_REGISTERED_MESSAGE =
  "An account with this email already exists. Check your inbox for the confirmation link, or sign in below.";

export const SIGNUP_CONFIRM_EMAIL_MESSAGE =
  "Check your email and tap Confirm once — then sign in if you are not redirected automatically.";
