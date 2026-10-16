# 다른 PC에서 Quick Link Mail 설치하기

이 문서는 **이미 Quick Link Mail Google Cloud 프로젝트가 만들어져 있고, 첫 번째 PC에서 Gmail 전송 성공을 확인한 상황**을 기준으로 작성했습니다. 새 Google Cloud 프로젝트를 또 만들 필요는 없습니다.

## 1. 다른 PC에서 소스 받기

Windows PowerShell, macOS 또는 Linux 터미널에서:

~~~bash
git clone https://github.com/ramza2/quick-link-mail.git
~~~

또는 GitHub 저장소의 **Code → Download ZIP**을 선택하고 압축을 해제합니다.

- 계속 사용할 위치에 폴더를 보관하세요. 예: `C:\Tools\quick-link-mail`
- Chrome에서는 **`manifest.json`이 들어 있는 폴더**를 선택합니다.
- 설치한 이후 폴더를 이동하면 확장 ID가 달라질 수 있습니다.

## 2. Chrome 확장 프로그램 설치

1. Chrome 주소창 `chrome://extensions`
2. **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드합니다** 클릭
4. 받은 소스의 `quick-link-mail` 폴더 선택
5. 카드에 나타난 **32자리 확장 프로그램 ID** 복사
6. Chrome 퍼즐 모양 메뉴에서 Quick Link Mail **고정(핀)**

**중요:** 현재 v1.0.0에는 고정된 `manifest.key`가 없습니다. 다른 PC의 압축해제된 확장 프로그램 ID는 설치 경로/환경에 따라 달라질 수 있습니다. **기존 PC의 OAuth 클라이언트를 무조건 재사용하지 않습니다.**

## 3. 기존 Google Cloud 프로젝트에 새 PC용 클라이언트 추가

1. [Google Cloud Console](https://console.cloud.google.com/) 이동
2. 상단 프로젝트 이름이 **Quick Link Mail**인지 확인 (**GoogleDriveTest 등 과거 프로젝트와 혼동 금지**)
3. **Google 인증 플랫폼 → 클라이언트** 선택
4. **+ 클라이언트 만들기** 클릭
5. 유형: **Chrome 확장 프로그램**
6. 이름 예: `Quick Link Mail - Home PC`
7. 2단계의 **새 PC 확장 프로그램 ID** 입력
8. 발급된 **OAuth 클라이언트 ID 전체**(`...apps.googleusercontent.com`) 복사

이미 새 PC와 같은 확장 ID를 등록한 올바른 클라이언트가 있으면 재사용할 수 있습니다. **기존 PC의 클라이언트를 삭제하거나 수정할 필요는 없습니다.** 새 PC마다 필요한 OAuth 클라이언트를 같은 Cloud 프로젝트에 추가할 수 있습니다.

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
- Cloud 프로젝트가 **테스트 중**인 경우 **발신 계정**을 Google 인증 플랫폼 → **대상 → 테스트 사용자**에 등록해야 합니다.
- Chrome 프로필에 따라 다른 발신 계정 선택이 제한될 수 있습니다. 필요한 경우 별도 Chrome 프로필로 설치하세요.

## 6. 정상 작동 테스트

1. 일반 웹 사이트 `https://example.com` 등을 열기
2. Quick Link Mail 아이콘 한 번 클릭
3. **✓** 표시 확인 후 고정 수신 Gmail의 수신함 확인
4. **!** 표시나 오류 발생 시 [문제 해결](TROUBLESHOOTING.md) 참고

## 기존 PC와 같은 확장 ID를 쓰고 싶다면

Chrome unpacked extension의 ID를 고정하는 방법으로 공개키인 `manifest.key`를 지정할 수 있습니다. **하지만 이를 지금 추가하면 기존 PC에서 잘 동작하던 확장 ID가 바뀌어 OAuth가 실패할 수 있습니다.** 따라서 현재 버전에는 도입하지 않았습니다. 추후 고정 ID 방식으로 마이그레이션한다면 기존/새 PC와 Google Cloud OAuth 클라이언트를 함께 전환해야 하며, 패키징 개인키(`.pem`)는 GitHub에 절대 올리지 않습니다.
