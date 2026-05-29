#!/usr/bin/env python3
import argparse
import sys

from openrouter_chat.client import DEFAULT_MODEL, OpenRouterError, chat_stream


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Chat with OpenRouter free models from your terminal."
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Model id (default: {DEFAULT_MODEL})",
    )
    args = parser.parse_args()

    print("OpenRouter Free Chat")
    print(f"Model: {args.model}")
    print("Type 'exit' or 'quit' to stop.\n")

    messages: list[dict[str, str]] = []

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBye.")
            return 0

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit"}:
            print("Bye.")
            return 0

        messages.append({"role": "user", "content": user_input})
        print("AI: ", end="", flush=True)

        assistant_parts: list[str] = []
        try:
            for token in chat_stream(messages, model=args.model):
                print(token, end="", flush=True)
                assistant_parts.append(token)
        except OpenRouterError as exc:
            print(f"\nError: {exc}", file=sys.stderr)
            messages.pop()
            continue

        print()
        messages.append({"role": "assistant", "content": "".join(assistant_parts)})


if __name__ == "__main__":
    raise SystemExit(main())
