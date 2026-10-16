# 문제 해결

## 403: access_denied — OAuth 접근 거부

**현재 Quick Link Mail 프로젝트는 프로덕션입니다.** 과거처럼 테스트 사용자를 추가하는 방식은 원칙적으로 필요하지 않습니다.

1. 상단 Cloud 프로젝트가 **Quick Link Mail**인지, **대상 → 프로덕션 단계**인지 먼저 확인하세요.
2. `manifest.json`의 클라이언트 ID가 해당 PC의 Chrome 확장 ID와 일치하는지 확인하세요.
3. 새 사용자라면 미검증 앱의 **100명 OAuth 사용자 한도**, 관리자 정책 또는 권한 문제를 확인하세요.
4. 프로젝트가 실제로 다시 Testing으로 되돌아간 경우에만 발신 계정을 **대상 → 테스트 사용자**에 추가하세요.

## Google 로그인 화면에 GoogleDriveTest가 표시됨

`manifest.json`의 `oauth2.client_id`가 다른 프로젝트에서 발급된 값입니다. **Quick Link Mail** 프로젝트에 만든 **Chrome 확장 프로그램 클라이언트 ID**로 교체한 뒤 확장 프로그램을 새로고침하세요.

## "Google hasn't verified this app" 경고

직접 만든 OAuth 프로젝트와 요청된 `gmail.send` 범위가 맞는지 확인합니다. 앱이 자신이 만든 것임이 확실할 때만 고급(Advanced)에서 진행하세요. 자신이 관리하지 않는 앱이면 승인하지 마세요.

## invalid_client, OAuth2 request failed, Google 계정 인증 실패

1. `chrome://extensions`에서 **현재 PC의 32자리 확장 프로그램 ID**를 확인
2. Google Cloud → **Quick Link Mail → 클라이언트**에서 이 ID를 등록한 Chrome 확장 프로그램 클라이언트가 있는지 확인
3. 그 클라이언트의 **전체 OAuth 클라이언트 ID**를 `manifest.json`에 입력 (client secret 사용 금지)
4. 확장 새로고침 → 옵션 → **계정 연결 초기화 → Google 계정 인증** 재시도
5. Google 발신 계정 선택이 어렵다면 별도 Chrome 프로필에 설치

## 메일이 안 오거나 빨간색 ! 배지가 보임

- Quick Link Mail **확장 프로그램 옵션 → 최근 결과**에서 오류 확인
- `chrome://extensions` → Quick Link Mail → **서비스 워커 검사(Inspect)** 에서 로그 확인
- HTTP **401**: 인증 갱신 실패 가능성, 계정 초기화/재인증
- HTTP **403**: OAuth 권한, 테스트 사용자, 프로젝트/정책 확인
- **✓**인데 수신 실패: Gmail 발신 계정의 보낸편지함 및 수신 계정의 스팸함/필터 확인
- Gmail API가 활성화되어 있는지도 확인

## 중복 표시

동일 수신자+URL을 성공적으로 보낸 지 **8초** 이내이면 중복 클릭으로 차단됩니다. 잠시 후 다시 시도하세요. 이 가드는 서비스 워커 메모리에만 보관됩니다.

## 옵션 페이지가 열리거나 클릭이 작동하지 않음

수신 Gmail 주소를 먼저 저장했는지 확인하세요. Chrome 내부 URL(`chrome://`), Chrome 웹 스토어 등의 보호된 페이지는 전송 불가할 수 있습니다. 일반 `http://` 또는 `https://` 페이지에서 테스트하세요.

## 첫 PC에서 되지만 새 PC에서는 실패

새 PC에서 확장 프로그램 ID가 달라졌을 수 있습니다. 기존 Cloud **Quick Link Mail** 프로젝트에 **새 PC용 Chrome OAuth 클라이언트**를 추가하고 그 ID를 `manifest.json`에 적용하세요. 현재 ID 고정은 도입 전입니다. [INSTALL.md](INSTALL.md) / [ID 마이그레이션](EXTENSION_ID.md)를 확인하세요.

## 며칠 후 재인증 요구

1. **대상 → 프로덕션 단계**가 유지되는지 확인하세요. 현재 앱은 테스트 모드에서 전환 완료된 상태입니다.
2. **프로덕션 전에 발급된 승인/토큰**이 남아 있어 한 번 더 인증해야 할 수 있습니다. 이 경우 **확장 옵션 → 계정 연결 초기화 → Google 계정 인증**으로 승인한 뒤 전송을 확인하세요.
3. 그 후에도 자주 반복되면 계정 접근 취소, Chrome 프로필 변경, Workspace 조직 정책, 앱 권한 변경 및 오류 로그를 확인하세요.
4. 프로덕션은 **절대 재인증하지 않는 상태가 아닙니다.** 더 자세한 설명은 [OAuth 운영 문서](GOOGLE_OAUTH_SETUP.md)를 참고하세요.
