import { validEmail } from './mail.js';
const input = document.getElementById('recipient');
const status = document.getElementById('status');
const history = document.getElementById('history');
function notify(message, error = false) { status.textContent = message; status.classList.toggle('error', error); }

const settings = await chrome.storage.local.get(['recipient', 'lastResult']);
input.value = settings.recipient || '';
showHistory(settings.lastResult);
function showHistory(result) {
  if (!result) return;
  history.textContent = `최근 결과: ${result.status === 'success' ? '발송 성공' : '실패'}\n${result.at || ''}\n${result.status === 'success' ? `${result.title}\n${result.recipient}` : result.message || ''}`;
}

document.getElementById('save').addEventListener('click', async () => {
  const email = input.value.trim();
  if (!validEmail(email) || !email.toLowerCase().endsWith('@gmail.com')) {
    notify('올바른 @gmail.com 주소를 입력하세요.', true);
    return;
  }
  await chrome.storage.local.set({ recipient: email });
  notify(`수신자가 저장되었습니다: ${email}`);
});

document.getElementById('auth').addEventListener('click', async () => {
  try {
    if (chrome.runtime.getManifest().oauth2.client_id.startsWith('REPLACE_')) {
      throw new Error('manifest.json의 OAuth 클라이언트 ID를 먼저 설정하세요.');
    }
    notify('Google 인증 창을 확인하세요...');
    const response = await chrome.identity.getAuthToken({ interactive: true });
    if (!(typeof response === 'string' ? response : response?.token)) throw new Error('인증 토큰을 받지 못했습니다.');
    notify('Google 계정 인증 완료. 이제 웹 페이지에서 확장 아이콘을 클릭하면 자동 전송됩니다.');
  } catch (error) { notify(`인증 실패: ${error.message}`, true); }
});

document.getElementById('reset').addEventListener('click', async () => {
  try {
    await chrome.identity.clearAllCachedAuthTokens();
    notify('계정 연결이 초기화되었습니다. 다른 계정으로 인증하려면 Google 계정 인증을 클릭하세요.');
  } catch (error) { notify(`초기화 실패: ${error.message}`, true); }
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.lastResult) showHistory(changes.lastResult.newValue);
});
