# Quick Link Mail

현재 Chrome 탭의 **제목과 URL을 지정한 Gmail 주소로 아이콘 클릭 한 번에 자동 전송**하는 Manifest V3 Chrome 확장 프로그램입니다. 별도 서버는 없으며, 발신 계정 OAuth 인증 후 Gmail API를 사용합니다.

> **실사용 검증 (2026-10-16):** Gmail 발송 및 수신 성공. Google OAuth 프로젝트 **Quick Link Mail / 외부 / 프로덕션 게시 완료 / 미검증(Unverified)**. Google Search Console에서 `ramza.duckdns.org` DNS 소유권 확인, HTTPS 홈페이지와 개인정보처리방침 공개 완료. GitHub 소스의 OAuth client ID는 자리표시자이며 PC별로 로컬 설정해야 합니다.

## 현재 운영 상태와 남은 항목

| 항목 | 현황 |
| --- | --- |
| Gmail API 실제 발송 | 성공 (2026-10-16 사용자 확인) |
| Google OAuth 게시 | **프로덕션** (테스트 중 아님) |
| Google 공식 앱 검증 | **미완료** (민감한 `gmail.send` 범위로 미검증 경고/사용자 수 제한 가능) |
| 테스트 모드 7일 인증 제한 | **프로덕션 게시로 해당 정책에서 제외**. 단, 기존 테스트 시절 승인/토큰 및 임의 취소 가능성으로 영구 인증 보장 불가 |
| 확장 프로그램 ID 고정 | **미구현**: `manifest.key` 없음. 설치 폴더/다른 PC의 ID 변경 가능 |
| 사이트 배포/HTTPS/도메인 소유권 | 확인 완료. DNS 검증 TXT 삭제 금지 |

재인증은 매주 자동으로 필요한 상태가 아닙니다. 다만 계정 권한 취소, Google/Chrome 정책, 예전 테스트 중 생성된 승인 등의 이유로 **추후 한 번 재인증이 필요할 수 있습니다**. 정상 발송 중이라면 임의로 연결을 초기화할 필요 없습니다.

확장 ID 고정은 **OAuth 프로덕션 전환과 무관한 별도 작업**입니다. 기존 PC에서 정상 작동 중인 ID를 바꿔 인증을 깨지 않도록 아직 적용하지 않았습니다. [ID 고정/다른 PC 마이그레이션 가이드](docs/EXTENSION_ID.md)를 참고하세요.

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
- [운영 상태 스냅샷](docs/PRODUCTION_STATUS.md)
- [확장 ID 고정·마이그레이션 주의사항](docs/EXTENSION_ID.md)

## 보안과 주의 사항

- URL의 쿼리 문자열까지 **그대로 전송**됩니다. 접근 토큰 등 민감한 정보가 담긴 URL은 공유하지 마세요.
- `chrome://` 등 브라우저 내부 페이지는 전송 불가합니다.
- ✓는 Gmail API 접수 성공을 뜻하며, 최종 수신/스팸 미분류까지 보장하지 않습니다.
- 현재 앱은 **외부 / 프로덕션 / 미검증** 상태입니다. 테스트 사용자 등록은 현재 필요 없지만 미검증 경고 및 100명 사용자 제한이 적용될 수 있습니다.
- **이 저장소는 공개(Public)**이므로 OAuth client secret, Gmail 비밀번호, 인증 토큰, `.pem` 개인키를 절대 커밋하지 마세요. OAuth 클라이언트 ID 자체는 공개 식별자입니다.
- 이 버전은 `manifest.key`로 확장 ID를 고정하지 않았습니다. 다른 PC에서 확장 ID가 달라지면 **기존 Cloud 프로젝트에 새 PC용 OAuth 클라이언트를 추가**해야 합니다.

## 개발

`npm test`: 테스트 3개. 빌드 없이 `manifest.json`이 있는 프로젝트 폴더를 Chrome에 로드하면 됩니다.

## OAuth 프로덕션 홈페이지 운영

- [정적 사이트 및 미니PC Traefik 배포 가이드](docs/DEPLOY_WEBSITE.md)
- OAuth 브랜딩 홈페이지: https://quicklink.ramza.duckdns.org/ (**운영 및 접속 확인**) 
- 개인정보처리방침: https://quicklink.ramza.duckdns.org/privacy.html (**공개**)

## 고정 ID 마이그레이션 진행

기존 확장을 유지한 채 새로운 고정 ID로 이전하는 절차를 준비했습니다. 먼저 미니PC에서 **개인키를 로컬 보관**하고 공개키와 새 ID만 확인합니다.

- [단계별 마이그레이션 실행 가이드](docs/ID_MIGRATION_RUNBOOK.md)
- [로컬에서 공개키/ID 생성하는 스크립트](scripts/generate-extension-key.sh)
