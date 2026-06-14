import type { SupabaseClient, User } from "@supabase/supabase-js";
import { friendlyAuthError } from "@/lib/auth-errors";
import { authConfirmUrl } from "@/lib/auth/redirect-origin";
import { authLog, authMetric } from "@/lib/auth/observability";

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

/** Single-flight per email — repeated clicks reuse one in-flight signUp promise. */
const signupInflight = new Map<string, Promise<SignupResult>>();

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

/** Supabase returns a user with empty identities when email already exists (confirm enabled). */
function isRepeatSignupUser(user: User | null) {
  return Boolean(user && (!user.identities || user.identities.length === 0));
}

async function executeSignUp(
  supabase: SupabaseClient,
  { email, password, metadata, fallbackOrigin }: SignUpOptions
): Promise<SignupResult> {
  authLog("signup.start", { email: email.trim() });
  authMetric("signup.network");

  const role = metadata.role;
  const asRole = role === "pro" || role === "homeowner" ? role : undefined;

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: metadata,
      emailRedirectTo: authConfirmUrl(fallbackOrigin, { as: asRole }),
    },
  });

  if (error) {
    authLog("signup.fail", { message: error.message });
    if (isAlreadyRegisteredMessage(error.message)) {
      return { status: "already_registered" };
    }
    return { status: "error", message: friendlyAuthError(error.message) };
  }

  if (isRepeatSignupUser(data.user)) {
    authLog("signup.already_registered", { email: email.trim() });
    return { status: "already_registered" };
  }

  if (data.user && !data.session) {
    authLog("signup.confirm_email", { email: email.trim() });
    return { status: "confirm_email" };
  }

  if (data.user) {
    authLog("signup.ok", { userId: data.user.id });
    return { status: "logged_in", user: data.user };
  }

  authLog("signup.fail", { message: "empty response" });
  return { status: "error", message: "Sign-up failed. Please try again." };
}

export async function signUpAccount(
  supabase: SupabaseClient,
  options: SignUpOptions
): Promise<SignupResult> {
  const key = options.email.trim().toLowerCase();
  const existing = signupInflight.get(key);
  if (existing) {
    authMetric("signup.deduped");
    authLog("signup.deduped", { email: key });
    return existing;
  }

  const promise = executeSignUp(supabase, options).finally(() => {
    signupInflight.delete(key);
  });
  signupInflight.set(key, promise);
  return promise;
}

export const SIGNUP_ALREADY_REGISTERED_MESSAGE =
  "An account with this email already exists. Check your inbox for the confirmation link, or sign in below.";

export const SIGNUP_CONFIRM_EMAIL_MESSAGE =
  "Check your email and tap Confirm once — then sign in if you are not redirected automatically.";
