# 다른 PC에서 Quick Link Mail 설치하기

**현재 운영 기준(2026-10-16):** Google Cloud Quick Link Mail 프로젝트는 **외부 / 프로덕션 게시 / 미검증**입니다. 기존 PC에서 실제 Gmail 발송·수신에 성공했습니다. 새 PC를 위해 **Google Cloud 프로젝트, Gmail API, DNS 검증, OAuth 브랜딩을 다시 만들지 않습니다.** 기존 프로젝트에 **해당 PC의 확장 ID에 맞는 Chrome 확장 OAuth 클라이언트**를 추가하거나 재사용하세요. [운영 상태](PRODUCTION_STATUS.md)

## 1. 다른 PC에서 소스 받기

Windows PowerShell, macOS 또는 Linux 터미널에서:

~~~bash
git clone https://github.com/ramza2/quick-link-mail.git
~~~

또는 GitHub 저장소의 **Code → Download ZIP**을 선택하고 압축을 해제합니다.

- 계속 사용할 위치에 폴더를 보관하세요. 예: `C:\Tools\quick-link-mail`
- Chrome에서는 **`manifest.json`이 들어 있는 폴더**를 선택합니다.
- 현재 GitHub 소스에는 공개키 `manifest.json.key`가 포함되어 있으므로 폴더 위치가 달라도 같은 확장 ID를 유지하도록 구성되어 있습니다. 다만 기존 설치 확장과 ID가 다를 수 있으므로 별도 설치하여 검증하세요.

## 2. Chrome 확장 프로그램 설치

1. Chrome 주소창 `chrome://extensions`
2. **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드합니다** 클릭
4. 받은 소스의 `quick-link-mail` 폴더 선택
5. 카드에 나타난 **32자리 확장 프로그램 ID** 복사
6. Chrome 퍼즐 모양 메뉴에서 Quick Link Mail **고정(핀)**

**고정 ID:** `ffdbaoipblppbkoomlgoonmddgijbmcg`. 이 값과 다르면 구버전 확장을 로드했거나 `manifest.json`의 공개키가 누락되었을 수 있습니다. [마이그레이션 안내](ID_MIGRATION_RUNBOOK.md)

## 3. 고정 ID용 Google OAuth 클라이언트 준비

1. [Google Cloud Console](https://console.cloud.google.com/)에서 **Quick Link Mail** 프로젝트 선택 (**GoogleDriveTest와 혼동 금지**).
2. **Google 인증 플랫폼 → 클라이언트**에서 고정 ID `ffdbaoipblppbkoomlgoonmddgijbmcg`를 등록한 클라이언트가 이미 있다면 **그 클라이언트 ID 재사용**.
3. 아직 없다면 **+ 클라이언트 만들기 → Chrome 확장 프로그램**을 선택하고 **애플리케이션 ID**에 `ffdbaoipblppbkoomlgoonmddgijbmcg` 입력.
4. 이름은 `Quick Link Mail - Fixed ID` 등으로 지정 후 발급된 OAuth **클라이언트 ID 전체**(`...apps.googleusercontent.com`) 복사.

**동일 고정 확장 ID를 쓰는 다른 PC는 Google Cloud에 새 OAuth 클라이언트를 추가할 필요가 없습니다.** 기존 PC의 구버전 확장 및 기존 클라이언트는 마이그레이션 전까지 삭제하지 마세요.

## 4. manifest.json에 새 클라이언트 ID 설정

로컬 `manifest.json`의 `oauth2.client_id`를 실제 발급된 ID로 교체하세요.

~~~json
"oauth2": {
  "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
  "scopes": ["https://www.googleapis.com/auth/gmail.send"]
}
~~~

**전체 클라이언트 ID**를 복사해야 하며 `client_secret`을 넣지 마세요. 파일을 저장한 후 `chrome://extensions`에서 **새로고침(↻)** 해야 적용됩니다.

Git에서 내려받은 폴더는 로컬 `manifest.json`이 수정된 상태로 유지됩니다. Git pull 또는 재설치 시 로컬 변경/인증 설정을 덮어쓰지 않도록 주의하세요.

## 5. 새 PC의 발신 및 수신 설정

1. `chrome://extensions` → Quick Link Mail → **세부정보 → 확장 프로그램 옵션**
2. 고정 **수신 Gmail 주소** 입력 → **수신자 저장**
3. **Google 계정 인증** → 메일을 보낼 **발신 Google 계정** 선택
4. Google 승인 화면에서 앱 이름 및 `gmail.send` 발송 권한 확인
5. 자신의 OAuth 프로젝트가 맞을 때만 미인증 경고를 검토하고 계속 진행

- 확장 설정은 Chrome 프로필의 로컬 저장소에 저장됩니다. **새 PC에서는 수신자 저장과 계정 인증을 다시 해야 합니다.**
- 현재 프로젝트는 **프로덕션**이므로 **테스트 사용자 추가가 필요하지 않습니다.** 다만 미검증 앱 경고/100명 사용자 제한 등은 남을 수 있습니다.
- Chrome 프로필에 따라 다른 발신 계정 선택이 제한될 수 있습니다. 필요한 경우 별도 Chrome 프로필로 설치하세요.

## 6. 정상 작동 테스트

1. 일반 웹 사이트 `https://example.com` 등을 열기
2. Quick Link Mail 아이콘 한 번 클릭
3. **✓** 표시 확인 후 고정 수신 Gmail의 수신함 확인
4. **!** 표시나 오류 발생 시 [문제 해결](TROUBLESHOOTING.md) 참고

## 기존 PC의 구버전 확장 이전

새 소스의 `manifest.json.key` 공개키는 `ffdbaoipblppbkoomlgoonmddgijbmcg`를 생성합니다. 기존 PC의 확장 ID는 다를 수 있으므로 **기존 확장을 삭제하지 말고 별도 Chrome 프로필에서 새 확장의 발송을 확인한 후** 이전하세요. 기존 수신자 설정과 Google 인증은 새 ID로 자동 이전되지 않습니다. [전환 절차](ID_MIGRATION_RUNBOOK.md)와 [ID 원리](EXTENSION_ID.md)를 참고하세요.
