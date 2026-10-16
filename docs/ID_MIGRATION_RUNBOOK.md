# 고정 ID 마이그레이션 실행 절차

**상태: 준비 중. 현재 정상 발송되는 기존 확장은 절대 삭제하지 않습니다.** Google Cloud Quick Link Mail은 이미 External/Production 상태이며, 본 작업을 위해 게시 상태를 변경하지 않습니다.

## 1. 새 공개키 및 확장 ID 생성 (미니PC)

미니PC에서:

```bash
cd ~/quick-link-mail
git pull --ff-only origin main
bash scripts/generate-extension-key.sh
```

출력 중 **Stable Chrome Extension ID** (32자리)와 **manifest.key (public, shareable)** 만 ChatGPT에 공유합니다. **Private key path 아래의 PEM 파일 내용은 절대 공유하지 마세요.**

- 키 파일은 저장소가 아닌 `~/.local/share/quick-link-mail/extension-signing.pem`에 보관합니다.
- 같은 PC에서 스크립트를 다시 실행하면 기존 키를 재사용해 **같은 ID**를 출력합니다.
- 비밀 PEM은 외부 저장소에 올리지 말고 안전하게 백업합니다. 압축해제 설치만 할 경우에는 공개키만 필요하지만 향후 CRX 패키징에 사용할 수 있습니다.
- 공개키를 `manifest.key`에 추가하면 어느 PC에서 압축해제 폴더를 로드해도 같은 ID를 사용합니다.

## 2. GitHub 소스 반영 (ChatGPT)

사용자가 공유한 **공개키**로 `manifest.json`에 `key` 필드를 추가하고, 문서 및 검증 스크립트를 현행화합니다. 초기 원본 PC의 로컬 폴더/확장은 수정하지 않습니다.

**주의:** 이 공개키는 기존 경로 기반 확장 ID를 그대로 보존하는 값이 아닙니다. 새 고정 ID의 확장을 먼저 별도 Chrome 프로필에 설치해 검증합니다.

## 3. Google Cloud OAuth 클라이언트 추가 (사용자)

Google Cloud → **Quick Link Mail** 프로젝트 → Google 인증 플랫폼 → **클라이언트 → 클라이언트 만들기**

- 애플리케이션 유형: Chrome 확장 프로그램
- 이름: Quick Link Mail — Fixed ID
- 애플리케이션 ID: 1단계에서 출력된 고정 ID
- 생성 후 전체 OAuth 클라이언트 ID 확인

**기존 OAuth 클라이언트는 삭제하지 않습니다.** 새로운 클라이언트를 같은 프로젝트에 추가하는 것만으로 충분합니다.

## 4. 새 확장 설치 및 Gmail 검증 (사용자)

1. **별도의 테스트 디렉터리**, 가능하면 **별도의 Chrome 프로필**에서 새 GitHub 소스를 받습니다.
2. `manifest.json`의 `oauth2.client_id`를 3단계에서 발급된 새 값으로 **로컬에서만** 교체합니다.
3. `chrome://extensions` → 개발자 모드 → 압축해제된 확장 프로그램을 로드합니다.
4. Chrome 확장 ID가 1단계와 **동일한지** 확인합니다.
5. 옵션에서 수신 Gmail 주소를 저장하고 Google 발신 계정을 인증합니다.
6. 일반 웹페이지에서 아이콘 1회 클릭 후 실제 메일 수신을 확인합니다.
7. 성공한 후 기존 Chrome 프로필에서도 새 확장으로 전환하며, 이후 사용하지 않는 기존 확장을 제거할 수 있습니다.

기존 확장의 로그인/설정 데이터는 **확장 ID별로 따로 저장**됩니다. 새 확장으로 수신자 주소나 인증이 자동 승계된다고 기대하면 안 됩니다.

## 5. 여러 PC에서 사용

모든 PC에서 **동일한 `manifest.key`를 가진 소스**를 로드하면 동일한 32자리 확장 ID를 사용합니다. 따라서 **고정 ID용 OAuth 클라이언트를 여러 PC에서 재사용**할 수 있습니다(각 PC에서 수신자 저장/발신 계정 인증은 개별 수행).

저장소를 공개로 유지하므로 **OAuth Client Secret, Gmail 토큰, PEM 개인키는 커밋하지 마세요.** OAuth 클라이언트 ID는 공개 식별자이지만 공개 배포 정책은 신중히 결정해야 합니다.

## 원상 복구

현재 정상 발송 중인 기존 확장에 아무 변경을 하지 않으면 원상 복구가 필요하지 않습니다. 새 테스트 확장에 문제가 있으면 **새 확장만 삭제**, 기존 확장은 그대로 사용합니다. Google Cloud에서는 새 OAuth 클라이언트를 삭제할 필요도 없습니다.

[Chrome 확장 프로그램 ID 공식 안내](https://developer.chrome.com/docs/extensions/reference/manifest/key) · [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
