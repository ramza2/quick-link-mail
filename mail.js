export function validEmail(email) {
  return typeof email === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) && !/[\r\n]/.test(email);
}

export function getSendablePage(tab) {
  if (!tab || !/^https?:\/\//i.test(tab.url || '')) {
    throw new Error('일반 웹 페이지(http/https)에서만 전송할 수 있습니다.');
  }
  const url = new URL(tab.url);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('전송할 수 없는 URL입니다.');
  }
  return { title: (tab.title || '제목 없음').replace(/[\r\n]+/g, ' ').slice(0, 240), url: url.href };
}

export function makeRawMessage(recipient, page) {
  if (!validEmail(recipient)) throw new Error('수신 Gmail 주소를 확인하세요.');
  const subject = `=?UTF-8?B?${utf8Base64(`[링크 공유] ${page.title}`)}?=`;
  const body = `페이지 제목: ${page.title}\r\nURL: ${page.url}\r\n\r\nQuick Link Mail에서 보냈습니다.\r\n`;
  const mime = [
    `To: ${recipient}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(utf8Base64(body)),
    ''
  ].join('\r\n');
  return btoa(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function utf8Base64(str) {
  const bytes = new TextEncoder().encode(str);
  let result = '';
  for (const byte of bytes) result += String.fromCharCode(byte);
  return btoa(result);
}

function wrapBase64(s) { return s.match(/.{1,76}/g)?.join('\r\n') ?? ''; }
