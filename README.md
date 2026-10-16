# Quick Link Mail

현재 Chrome 탭의 **제목과 URL을 지정한 Gmail 주소로 아이콘 클릭 한 번에 자동 전송**하는 Manifest V3 Chrome 확장 프로그램입니다. 별도 서버는 없으며, 발신 계정 OAuth 인증 후 Gmail API를 사용합니다.

> **검증:** 2026-10-16 Google OAuth 인증 및 실제 Gmail 수신 확인. GitHub 소스에는 OAuth 클라이언트 ID를 자리표시자로 유지하므로 각 PC에서 설정해야 합니다.

## 빠른 시작

1. [다른 PC 설치 가이드](docs/INSTALL.md)를 읽고 GitHub 소스를 내려받습니다.
2. `chrome://extensions`에서 개발자 모드를 켜고 압축해제된 확장 프로그램을 로드합니다.
3. Google Cloud의 **Quick Link Mail** 프로젝트에서 **이 PC의 확장 ID로 Chrome 확장 프로그램 OAuth 클라이언트**를 만들거나 확인합니다.
4. `manifest.json`의 `oauth2.client_id`를 해당 클라이언트 ID로 교체한 뒤 확장 프로그램을 새로고침합니다.
5. **확장 프로그램 옵션**에서 수신 Gmail을 저장하고 발신 Google 계정을 인증합니다.
6. 일반 웹 페이지에서 아이콘을 한 번 클릭합니다. Gmail이 요청을 수락하면 **✓**, 오류면 **!**, 짧은 시간 내 재클릭은 **중복**으로 표시됩니다.

## 주요 기능

- 현재 탭 제목 + URL 전체를 메일로 전송
- 설정한 **고정 수신 Gmail 주소**로 팝업 없이 원클릭 발송
- Chrome의 기본 로그인 계정과 발신 계정을 별도로 선택 가능(Chrome 프로필 설정 영향 있음)
- Gmail 발송 범위 `https://www.googleapis.com/auth/gmail.send`만 요청
- 마지막 발송 상태 확인, 8초 이내 동일 URL 중복 전송 방지
- Node.js 20+ 환경에서 `npm test`로 기본 MIME/URL 테스트 (런타임 npm 설치 불필요)

## 문서

- [다른 PC 설치 가이드 — Windows/macOS/Linux](docs/INSTALL.md)
- [Google Cloud Gmail API / OAuth 설정](docs/GOOGLE_OAUTH_SETUP.md)
- [문제 해결: 403, 인증 실패, 전송 실패](docs/TROUBLESHOOTING.md)
- [AGENTS.md — 개발 및 Cursor 토큰 절약 지침](AGENTS.md)

## 보안과 주의 사항

- URL의 쿼리 문자열까지 **그대로 전송**됩니다. 접근 토큰 등 민감한 정보가 담긴 URL은 공유하지 마세요.
- `chrome://` 등 브라우저 내부 페이지는 전송 불가합니다.
- ✓는 Gmail API 접수 성공을 뜻하며, 최종 수신/스팸 미분류까지 보장하지 않습니다.
- Google OAuth 앱이 External / Testing일 때는 발신 계정을 **테스트 사용자**로 등록해야 하며 통상 7일의 인증 갱신 제한이 적용될 수 있습니다.
- **이 저장소는 공개(Public)**이므로 OAuth client secret, Gmail 비밀번호, 인증 토큰, `.pem` 개인키를 절대 커밋하지 마세요. OAuth 클라이언트 ID 자체는 공개 식별자입니다.
- 이 버전은 `manifest.key`로 확장 ID를 고정하지 않았습니다. 다른 PC에서 확장 ID가 달라지면 **기존 Cloud 프로젝트에 새 PC용 OAuth 클라이언트를 추가**해야 합니다.

## 개발

`npm test`: 테스트 3개. 빌드 없이 `manifest.json`이 있는 프로젝트 폴더를 Chrome에 로드하면 됩니다.

## OAuth 프로덕션 홈페이지 운영

- [정적 사이트 및 미니PC Traefik 배포 가이드](docs/DEPLOY_WEBSITE.md)
- OAuth 브랜딩 홈페이지: `https://quicklink.ramza.duckdns.org/` (배포 후 사용 가능)
- 개인정보처리방침: `https://quicklink.ramza.duckdns.org/privacy.html` (배포 후 사용 가능)
