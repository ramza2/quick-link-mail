# Quick Link Mail — AGENTS.md

## Scope
- Chrome Manifest V3. 서버, 프레임워크, 번들러, 런타임 외부 패키지 없음.
- `background.js`: 아이콘 클릭, Chrome Identity, Gmail API, 배지/결과 저장.
- `mail.js`: 순수 URL 검증 및 UTF-8 MIME/base64url 생성.
- `options.html` / `options.js`: 고정 수신 Gmail/Google OAuth 설정.
- `tests/mail.test.js`: 기본 로직 테스트. `mail.js` 수정 시 `npm test` 필수.
- `docs/`: 설치, OAuth, 오류 해결 가이드.

## Safety
- 필요한 권한만 유지: `activeTab`, `storage`, `identity`, Gmail API 호스트.
- OAuth access/refresh token, client secret, Gmail 비밀번호, `.pem` 개인키는 커밋 금지.
- GitHub `manifest.json`의 `oauth2.client_id`는 PC별 설정을 위한 자리표시자.
- 다른 PC에서 unpacked extension ID는 달라질 수 있음. `manifest.key` 도입은 기존 OAuth 클라이언트 ID 마이그레이션 검토 후 진행.
- 기존 정상 작동하는 사용자 흐름을 깨는 변경 금지.

## Cursor 작업 원칙
- 요청과 관련된 파일만 읽고 최소 수정. 전체 저장소 재조사/과도한 리팩터링 금지.
- 불필요한 패키지 설치, CI 추가, 병렬 에이전트 사용 금지.
- 변경 범위에 필요한 테스트만 실행하고 변경 경로, PASS/FAIL, SHA/PR 링크만 보고.
