import test from 'node:test';
import assert from 'node:assert/strict';
import { getSendablePage, makeRawMessage, validEmail } from '../mail.js';
globalThis.btoa ||= (s) => Buffer.from(s, 'latin1').toString('base64');
test('email validation prevents injected headers', () => {
  assert.equal(validEmail('test@gmail.com'), true);
  assert.equal(validEmail('test@gmail.com\r\nBcc:x@y.com'), false);
});
test('rejects unsafe schemes', () => {
  assert.throws(() => getSendablePage({url:'chrome://extensions',title:'settings'}));
});
test('MIME contains Korean title and URL', () => {
  const page = getSendablePage({url:'https://example.com/%ED%95%9C%EA%B8%80?q=1',title:'한글 테스트'});
  const raw = makeRawMessage('target@gmail.com',page);
  const mime = Buffer.from(raw.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8');
  assert.match(mime,/To: target@gmail.com/);
  assert.match(mime,/Content-Transfer-Encoding: base64/);
  assert.match(mime,/Subject: =\?UTF-8\?B\?/);
  const encodedBody = mime.split('\r\n\r\n')[1].replace(/\s/g,'');
  assert.match(Buffer.from(encodedBody,'base64').toString('utf8'),/한글 테스트/);
  assert.match(Buffer.from(encodedBody,'base64').toString('utf8'),/https:\/\/example.com/);
});
