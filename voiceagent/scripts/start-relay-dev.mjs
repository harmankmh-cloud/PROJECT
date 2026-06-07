#!/usr/bin/env node
/**
 * Starts Next.js + orchestrator + dev proxy for Twilio ConversationRelay.
 * Point ngrok at DEV_PROXY_PORT (default 3099):
 *   ngrok http --url=YOUR_DOMAIN.ngrok-free.dev 3099
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(name, command, args, cwd = root) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exit(code);
    }
  });
  return child;
}

console.log("Starting ConversationRelay dev stack...");
console.log("1) Next.js on :3002");
console.log("2) Orchestrator WebSocket on :8080/ws");
console.log("3) Dev proxy on :3099 (point ngrok here)");
console.log("");
console.log("Set in .env.local:");
console.log("  TWILIO_VOICE_MODE=relay");
console.log("  ORCHESTRATOR_WSS_URL=wss://YOUR_DOMAIN.ngrok-free.dev/ws");
console.log("");

run("next", "npm", ["run", "dev"], root);
run("orchestrator", "npm", ["run", "dev"], path.join(root, "orchestrator"));
run("proxy", "npm", ["run", "dev:proxy"], root);
