# Quick Link Mail — 운영 상태 (2026-10-19)

## 실제 확인된 항목

| 항목 | 상태 및 근거 |
| --- | --- |
| GitHub | `ramza2/quick-link-mail` / main |
| Chrome extension | v1.0.0, 고정 ID 신버전에서 실제 Gmail 수신 성공 (2026-10-19) |
| Google Cloud | 별도 프로젝트 **Quick Link Mail** |
| OAuth 사용자 유형 | **외부(External)** |
| OAuth 게시 상태 | **프로덕션(In production)** (2026-10-16 Cloud 화면 확인) |
| OAuth 공식 검증 | **미검증(Unverified)** / 검증 심사 미진행 |
| OAuth 범위 | `https://www.googleapis.com/auth/gmail.send` |
| OAuth 사용자 수 | 게시 시 Cloud 표시: 1명 / 100명 미검증 사용자 제한 |
| 웹사이트 | https://quicklink.ramza.duckdns.org/ (HTTPS 접속 확인) |
| 개인정보처리방침 | https://quicklink.ramza.duckdns.org/privacy.html |
| Search Console | `ramza.duckdns.org` DNS TXT 소유권 확인 완료 |
| DNS TXT | Google 확인 레코드 유지 필요 |
| 서버 | 기존 미니PC Docker, Traefik TLS-ALPN-01 / `proxy` / `myresolver`, 별도 Nginx 웹사이트 컨테이너 |
| Chrome 확장 ID | **고정 및 실사용 검증 완료**: `ffdbaoipblppbkoomlgoonmddgijbmcg`; 고정 ID용 OAuth 클라이언트 사용 |
| 7일마다 재인증 | **현재 External/Production이므로 테스트 모드의 7일 정책은 적용 대상 아님**. 다만 기존 승인 만료나 접근 취소로 추후 재인증할 수 있음 |

## 결론

- **실제 사용:** 기존 Chrome 프로필에서 고정 ID 신버전으로 전환, 발신·수신 정상. 추가 코드 수정이나 인증 초기화 불필요.
- **인증 유지:** 정기적으로 7일마다 강제 재인증하는 테스트 모드 정책은 벗어났으나, 영구 인증을 보장할 수는 없음. 기존 테스트 때 받은 토큰/승인이 남아 있으면 한 차례 재인증 필요 가능. 서비스가 실패할 때 [트러블슈팅](TROUBLESHOOTING.md) 참고.
- **ID 고정:** GitHub `manifest.json.key`와 `Quick Link Mail - Fixed ID` OAuth 클라이언트 적용 완료. 신버전 Gmail 수신 확인. 다른 PC는 동일 ID·클라이언트 재사용. [완료 기록](ID_MIGRATION_RUNBOOK.md).
- **정식 Google 검증:** 사용자 한 명이 쓰는 경우 당장 필수 작업으로 보지 않지만 민감 범위 미검증 경고 및 100명 사용자 한도 가능. 공식 검증 완료라고 표시하지 말 것.
- **사이트:** 이미 배포되어 있으므로 Docker 재시작 불필요. [배포·복구 문서](DEPLOY_WEBSITE.md)는 복구 시 사용.

## 변경 금지 / 보안

- 현재 정상 발송되는 고정 확장 ID, 공개키 및 OAuth 클라이언트를 변경하지 말 것. 구형 클라이언트는 다른 기기 사용 여부를 확인한 뒤에만 선택적으로 삭제.
- `.pem`, Google 인증 토큰, DuckDNS API 토큰, Google TXT 실제 값은 GitHub에 올리지 말 것.
- 프로젝트 설정이나 외부 DNS/Traefik을 불필요하게 변경하지 말 것.

## 공식 자료

- [Google OAuth 앱 상태 비교](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)
- [테스트 7일 인증 만료 예외](https://developers.google.com/identity/protocols/oauth2/)
- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
