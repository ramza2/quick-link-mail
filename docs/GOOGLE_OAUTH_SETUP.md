# Google Cloud Gmail API / OAuth 설정

## 이미 Quick Link Mail 프로젝트가 있는 경우

다른 PC에 설치할 때 **새 프로젝트, Gmail API, 동의 화면을 다시 만들지 않습니다.** 같은 Google Cloud 프로젝트에 **그 PC의 확장 ID로 Chrome 확장 프로그램용 OAuth 클라이언트만 추가**하면 됩니다. [다른 PC 설치 문서](INSTALL.md)를 참고하세요.

## 최초 Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 **Quick Link Mail** 생성 (기존 GoogleDriveTest와 분리)
2. **API 및 서비스 → 라이브러리 → Gmail API → 사용 설정**
3. **Google 인증 플랫폼 → 브랜딩**: 앱 이름 `Quick Link Mail`, 사용자 지원 이메일, 개발자 연락처 등 필수 항목
4. **대상(Audience)**: 개인 Gmail인 경우 **외부(External)** 및 **테스트 중(Testing)**
5. **테스트 사용자 → Add users**: 메일 **발신 Google 계정**을 추가 (수신자가 아님)
6. **데이터 액세스(Data access)**: `https://www.googleapis.com/auth/gmail.send` **단 하나만** 추가
7. Chrome `chrome://extensions`에 소스 로드 → **확장 프로그램 ID** 확인
8. **클라이언트 → 클라이언트 만들기**: 유형 **Chrome 확장 프로그램**, 앱 ID에 Chrome의 32자리 ID 입력
9. 발급받은 클라이언트 ID를 `manifest.json`의 `oauth2.client_id`에 붙여넣기 후 Chrome 확장 새로고침
10. 확장 옵션 → 수신자 저장 → Google 계정 인증 → 발송 테스트

## 앱 이름과 계정 구분

- **OAuth 앱 이름:** 브랜딩의 `Quick Link Mail`. Google 로그인 화면에 표시됩니다.
- **OAuth 클라이언트 이름:** `Quick Link Mail - Home PC`처럼 Cloud에서 클라이언트를 구분하는 관리용 이름입니다.
- **발신자:** Google 계정 인증에서 선택한 계정. 테스트 중이라면 테스트 사용자 등록 필요.
- **수신자:** 확장 옵션에서 저장한 Gmail 주소.
- **권한:** `gmail.send`는 메일 발송 권한이며 메일 읽기/삭제 권한을 요청하지 않습니다.

## 테스트 중 vs 프로덕션

- **테스트 중**은 자동으로 프로덕션 상태로 바뀌지 않습니다.
- 외부 앱이 테스트 중이라면 등록된 **테스트 사용자만** 인증할 수 있습니다.
- Gmail 발송 권한에 대한 테스트 모드 동의/토큰 갱신은 일반적으로 **7일 제한**이 적용될 수 있습니다.
- **프로덕션(게시)**과 **Google 공식 인증 완료(검증)**는 다른 상태입니다. 게시 이후에도 미검증 경고 또는 사용자 수 제한이 남을 수 있으며, 공개 사용을 위한 민감한 범위 검증이 필요할 수 있습니다.
- 개인 실사용이라도 장기 이용 전 Google Auth Platform의 브랜딩/게시 상태 및 정책을 확인하세요.

## 공식 참고 문서

- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
- [Gmail API OAuth 범위](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [OAuth 앱의 테스트·게시 상태](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)

## 보안

이 GitHub 저장소는 **Public**입니다. OAuth 클라이언트 ID는 공개 식별자지만 **OAuth client secret, access/refresh token, Gmail 비밀번호, `.pem` 패키징 개인키**는 절대 커밋하지 마세요. 수신자와 마지막 결과는 Chrome 프로필의 로컬 확장 저장소에 보관합니다.
