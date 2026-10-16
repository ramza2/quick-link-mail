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

## Website / Deployment
- `site/`: 공개 정적 OAuth 안내 홈페이지·개인정보처리방침. 사용자가 요청하지 않으면 추적/분석 도구 추가 금지.
- `deploy/compose.website.yml`: 미니PC 전용 **독립** Compose; 기존 PickNext/Traefik 자체 Compose 변경 금지.
- Traefik Docker network `proxy`, entrypoint `websecure`, resolver `myresolver` 재사용. TLS-ALPN-01 인증서 동작 유지.
- 개인 계정, TXT 검증 토큰, OAuth 인증 정보, 서버 내부 IP·경로 등 비밀값을 공개 사이트/저장소에 추가하지 말 것.

## Production state (confirmed 2026-10-16)
- Google Cloud Quick Link Mail: External / **In production** / **unverified**; gmail.send only. Gmail real receive confirmed.
- OAuth domain: ramza.duckdns.org DNS ownership verified; site HTTPS active; do not delete DuckDNS verification TXT.
- Testing-only 7-day consent expiry no longer applies to new production grants. Reauthorization still possible due to legacy grants/revocation. Never claim permanent authorization.
- `manifest.key` is intentionally absent; multi-PC ID stability is **not solved**. Do not add a key or change OAuth client IDs without user's explicit approval and migration plan in docs/EXTENSION_ID.md.
- Documentation-only maintenance should not change runtime extension JS/manifest or restart the public Traefik / PickNext stack.

## Stable ID migration
- Script `scripts/generate-extension-key.sh` creates a private RSA PEM **outside** the repo under the user's home directory; never commit private keys.
- Migration is staged: do not change existing installed Chrome extension or delete existing OAuth client until new fixed-ID extension is tested.
- Only add `manifest.key` when the user supplies a public key generated on their machine. Never invent or publish private signing credentials.
- See `docs/ID_MIGRATION_RUNBOOK.md` for rollout and rollback.
