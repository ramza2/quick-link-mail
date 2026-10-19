# Quick Link Mail 고정 확장 ID 마이그레이션

**현재 단계 (2026-10-19):** 개인키/공개키 생성 및 GitHub `manifest.json.key` 반영 완료. 새 고정 ID의 Google OAuth 클라이언트 생성과 별도 Chrome 프로필 발송 테스트는 아직 필요합니다.

- **고정 확장 ID:** `ffdbaoipblppbkoomlgoonmddgijbmcg`
- **Google Cloud 프로젝트:** `Quick Link Mail` (External / Production)
- **기존 PC:** 정상 작동 중인 확장/클라이언트 유지; 삭제·초기화 금지
- **개인키:** 사용자 미니PC 내부에만 보관하며 다시 생성하지 않음

## 1. Google Cloud에서 새 OAuth 클라이언트 하나 추가 (사용자)

[Google Cloud → 인증 플랫폼 → 클라이언트](https://console.cloud.google.com/auth/clients)로 이동하고 **상단 프로젝트가 Quick Link Mail인지 확인**합니다.

1. **클라이언트 만들기** 클릭
2. 애플리케이션 유형: **Chrome 확장 프로그램**
3. 이름: `Quick Link Mail - Fixed ID`
4. 애플리케이션 ID: `ffdbaoipblppbkoomlgoonmddgijbmcg`
5. 생성 후 `...apps.googleusercontent.com`으로 끝나는 **OAuth 클라이언트 ID 전체**를 복사

이미 이 ID로 생성된 클라이언트가 있으면 재사용합니다. **기존 PC에서 사용 중인 OAuth 클라이언트는 삭제하거나 변경하지 않습니다.**

## 2. 다른 Chrome 프로필에 새 확장 설치 (사용자)

현재 정상 작동 중인 Chrome 프로필이 아니라 **새 Chrome 프로필**에서 진행합니다. 필요하면 브라우저 우측 상단 프로필 아이콘 → 프로필 추가.

Windows PowerShell 예시:

```powershell
git clone https://github.com/ramza2/quick-link-mail.git D:\Tools\quick-link-mail-fixed
```

이 경로가 이미 있다면 다른 빈 폴더를 사용합니다. GitHub의 최신 소스 `manifest.json`에는 공개키가 포함되어 있습니다.

1. 해당 폴더의 `manifest.json`에서 **`oauth2.client_id`만** 1단계 OAuth 클라이언트 ID로 수정. **`key` 필드는 수정하지 마세요.**
2. 새 Chrome 프로필에서 `chrome://extensions` → 개발자 모드 → **압축해제된 확장 프로그램을 로드합니다** → 새 폴더 선택.
3. 표시된 확장 ID가 **`ffdbaoipblppbkoomlgoonmddgijbmcg`**와 일치하는지 확인. **다르면 즉시 중단**하고 소스 버전과 `key` 확인.
4. Quick Link Mail → 세부정보 → 확장 프로그램 옵션 → 수신 Gmail 주소 저장 → 발신 Google 계정 인증.
5. 일반 HTTPS 페이지에서 확장 아이콘 1회 클릭 → ✓ 표시 → 실제 Gmail 수신 확인.

Google OAuth 게시 상태는 이미 Production이므로 테스트 사용자 재등록을 할 필요 없습니다. 미검증 앱 경고가 나올 수 있으니 승인 전에 앱 이름과 `gmail.send` 권한을 확인하세요.

## 3. 기본 PC와 다른 PC로 확대

새 프로필에서 실제 수신까지 정상 확인한 후, 기존 기본 PC에도 **동일 고정 ID 소스**를 설치합니다. 기본 프로필의 구 확장은 한동안 유지하고 두 확장 아이콘을 구분해서 테스트하세요. Chrome이 기존 ID와 새 ID를 별개 확장으로 취급하므로 새 ID의 수신자 설정 및 발신 인증을 새로 해야 합니다.

모든 PC의 확장 ID가 `ffdbaoipblppbkoomlgoonmddgijbmcg`라면 **Google Cloud 고정 ID용 OAuth 클라이언트 1개를 공유**할 수 있습니다. 각 PC의 `manifest.json.oauth2.client_id`는 그 클라이언트 ID로 설정해야 하며, 각 Chrome 프로필에서 최초 인증은 별도로 합니다.

## 4. 성공한 이후에만 구버전 정리

- 기존 PC의 새 고정 ID 확장에서 Gmail 실제 수신까지 확인
- 기존 구버전 확장 사용 중단/제거
- 이전 OAuth 클라이언트는 원할 때 별도 정리 (삭제하면 이전 ID로 인증하던 확장은 동작 불가)
- GitHub `key`나 미니PC 개인키는 변경하지 않음

## 실패 시 복구

새 고정 ID 확장에서 문제가 있으면 **새 테스트 확장만 비활성화하거나 삭제**합니다. 기존 작동하던 확장은 그대로 사용합니다. Google Cloud 기존 클라이언트를 유지했으므로 되돌릴 작업이 없습니다.

## 키 재검증

미니PC에서 `bash scripts/generate-extension-key.sh`를 다시 실행하면 저장해 둔 동일 개인키를 재사용합니다. 출력 ID는 계속 `ffdbaoipblppbkoomlgoonmddgijbmcg`여야 합니다. 공개키를 새로 만들어서는 안 됩니다.

[Chrome 공식 OAuth/ID 가이드](https://developer.chrome.com/docs/extensions/reference/manifest/oauth2)
