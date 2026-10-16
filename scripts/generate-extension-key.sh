#!/usr/bin/env bash
set -euo pipefail

# Run on your own trusted Linux machine. Only the public key and ID are printed.
for tool in openssl base64 awk tr; do
  command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2; exit 1; }
done

KEY_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/quick-link-mail"
PRIVATE_KEY="$KEY_DIR/extension-signing.pem"
umask 077
mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"
if [[ -e "$PRIVATE_KEY" ]]; then
  [[ -f "$PRIVATE_KEY" ]] || { echo "Key path is not a regular file" >&2; exit 1; }
  echo "Existing signing key: reusing it (not generating a replacement)." >&2
else
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$PRIVATE_KEY" 2>/dev/null
  echo "Created a new signing key (stored only on this machine)." >&2
fi
chmod 600 "$PRIVATE_KEY"
PUBLIC_KEY="$(openssl pkey -in "$PRIVATE_KEY" -pubout -outform DER | base64 -w 0)"
DIGEST="$(openssl pkey -in "$PRIVATE_KEY" -pubout -outform DER | openssl dgst -sha256 | awk '{print $NF}')"
STABLE_ID="$(printf '%s' "${DIGEST:0:32}" | tr '0123456789abcdef' 'abcdefghijklmnop')"

printf '\nStable Chrome Extension ID: %s\n' "$STABLE_ID"
printf 'manifest.key (public, shareable): %s\n' "$PUBLIC_KEY"
printf '\nPrivate key path (DO NOT upload/share): %s\n' "$PRIVATE_KEY"
printf 'Do not delete the current installed extension or change its OAuth client yet.\n'
