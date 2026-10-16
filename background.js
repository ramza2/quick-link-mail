import { getSendablePage, makeRawMessage, validEmail } from './mail.js';

const running = new Set();
const lastSuccess = new Map();
const CLICK_GUARD_MS = 8000;

async function badge(tabId, text, color, title, duration = 4500) {
  await chrome.action.setBadgeBackgroundColor({ tabId, color });
  await chrome.action.setBadgeText({ tabId, text });
  await chrome.action.setTitle({ tabId, title });
  setTimeout(async () => {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
      await chrome.action.setTitle({ tabId, title: 'Quick Link Mail — 현재 탭 전송' });
    } catch { /* 탭 종료 시 무시 */ }
  }, duration);
}

chrome.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  if (tabId === undefined || running.has(tabId)) return;
  running.add(tabId);
  try {
    const { recipient } = await chrome.storage.local.get('recipient');
    if (!validEmail(recipient)) {
      await chrome.runtime.openOptionsPage();
      await badge(tabId, '설정', '#B45309', '먼저 수신 Gmail 주소를 저장하세요.');
      return;
    }
    const page = getSendablePage(tab);
    const signature = `${recipient}\n${page.url}`;
    if (Date.now() - (lastSuccess.get(signature) ?? 0) < CLICK_GUARD_MS) {
      await badge(tabId, '중복', '#B45309', '8초 이내 동일 링크 중복 발송이 차단되었습니다.');
      return;
    }
    await badge(tabId, '...', '#2563EB', '메일 전송 중...', 30000);
    let tokenInfo;
    try {
      tokenInfo = await chrome.identity.getAuthToken({ interactive: false });
    } catch {
      await chrome.runtime.openOptionsPage();
      throw new Error('Google 발신 계정 인증이 필요합니다. 설정 화면에서 인증하세요.');
    }
    const token = typeof tokenInfo === 'string' ? tokenInfo : tokenInfo.token;
    if (!token) throw new Error('Google 인증 토큰을 가져오지 못했습니다.');

    const raw = makeRawMessage(recipient, page);
    let response = await send(token, raw);
    if (response.status === 401) {
      await chrome.identity.removeCachedAuthToken({ token });
      const refreshed = await chrome.identity.getAuthToken({ interactive: false });
      const freshToken = typeof refreshed === 'string' ? refreshed : refreshed.token;
      response = await send(freshToken, raw);
    }
    if (!response.ok) {
      let detail = '';
      try { detail = (await response.json()).error?.message || ''; } catch { /* pass */ }
      throw new Error(`Gmail API 오류 (${response.status})${detail ? ': ' + detail : ''}`);
    }
    const result = await response.json();
    if (!result.id) throw new Error('발송 결과에 메일 ID가 없습니다.');
    lastSuccess.set(signature, Date.now());
    await chrome.storage.local.set({ lastResult: { status: 'success', at: new Date().toISOString(), title: page.title, url: page.url, recipient, messageId: result.id } });
    await badge(tabId, '✓', '#15803D', `전송 성공: ${recipient}`);
  } catch (error) {
    const message = String(error?.message ?? error);
    await chrome.storage.local.set({ lastResult: { status: 'error', at: new Date().toISOString(), message } });
    await badge(tabId, '!', '#B91C1C', `전송 실패: ${message}`, 10000);
    console.error('Quick Link Mail:', message);
  } finally {
    running.delete(tabId);
  }
});

function send(token, raw) {
  return fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw })
  });
}
