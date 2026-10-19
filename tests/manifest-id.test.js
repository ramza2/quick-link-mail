import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('manifest public key yields pinned Chrome extension ID', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8'));
  const key = manifest.key;
  assert.equal(typeof key, 'string');
  const der = Buffer.from(key, 'base64');
  assert.ok(der.length > 100, 'expected a DER RSA public key');
  const hex = createHash('sha256').update(der).digest('hex').slice(0, 32);
  const id = hex.replace(/[0-9a-f]/g, char => String.fromCharCode(97 + parseInt(char, 16)));
  assert.equal(id, 'ffdbaoipblppbkoomlgoonmddgijbmcg');
  assert.ok(manifest.oauth2.scopes.includes('https://www.googleapis.com/auth/gmail.send'));
});
