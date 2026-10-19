# Quick Link Mail — 고정 ID 마이그레이션 완료 기록

**완료일: 2026-10-19.** 기존 Chrome 프로필에서 고정 ID 신버전을 설치하고 Google 인증 후 실제 Gmail 메일 수신까지 사용자 확인했습니다. 별도 Chrome 프로필은 사용하지 않았습니다.

## 완료 상태

| 항목 | 상태 |
| --- | --- |
| 확장 프로그램 고정 ID | `ffdbaoipblppbkoomlgoonmddgijbmcg` |
| 공개키 | `manifest.json.key`에 반영; ID 계산 검증 |
| 개인키 | 미니PC 로컬에서 보관, GitHub 미포함 |
| Google Cloud | Quick Link Mail / External / Production / Unverified |
| 새 OAuth 클라이언트 | **Quick Link Mail - Fixed ID** 생성 완료 |
| 신버전 Chrome 확장 | 기존 프로필에서 설치 후 Gmail 실제 수신 성공 |
| 다른 PC | 동일 ID / 기존 OAuth 클라이언트 재사용 가능 |

## 다른 PC 설치

[INSTALL.md](INSTALL.md)에 따라 최신 GitHub 소스를 설치합니다. `manifest.json.key`는 변경하지 않고, `oauth2.client_id`만 이미 생성된 **Quick Link Mail - Fixed ID** 클라이언트의 실제 값으로 로컬에서 바꿉니다.

`chrome://extensions`에서 확장 ID가 `ffdbaoipblppbkoomlgoonmddgijbmcg`인지 확인한 뒤 **각 PC**에서 수신 Gmail 주소 저장, 발신 Google 계정 인증, 테스트 메일 수신 확인을 진행합니다. **새 Google Cloud 프로젝트나 OAuth 클라이언트 생성은 필요하지 않습니다.**

## 구버전 정리 및 롤백

**2026-10-19 사용자가 구형 OAuth 클라이언트 삭제 완료를 확인했습니다.** 현재 활성 **Quick Link Mail - Fixed ID** 클라이언트는 삭제하지 마세요. 다른 PC는 고정 ID용 클라이언트를 그대로 재사용합니다.

고정 ID를 사용한 신버전에서 오류가 발생하면 [문제 해결](TROUBLESHOOTING.md)을 참고하세요. 구버전 확장을 이미 지웠다면 자동으로 원복되지는 않습니다.

## 인증 유지

Google OAuth가 Production이므로 Testing 상태의 7일 승인 만료 제한은 적용되지 않지만, 다른 사유로 인증이 취소되면 재인증은 필요할 수 있습니다.

## 보안

- 개인키 `~/.local/share/quick-link-mail/extension-signing.pem`은 안전하게 보관하고 GitHub에 업로드하지 마세요.
- `manifest.json.key`를 변경하면 확장 ID가 변경되므로 **다시 생성하지 마세요**.
- 소스의 `oauth2.client_id`는 자리표시자. 로컬 설치본에만 실제 값을 입력합니다.
- DuckDNS 소유권 확인 TXT 값은 유지. 미니PC의 기존 PickNext/Traefik 설정은 변경 불필요.

[Chrome 공식 안내](https://developer.chrome.com/docs/extensions/reference/manifest/key)
