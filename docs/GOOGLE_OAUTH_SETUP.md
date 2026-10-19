# Google Cloud Gmail API / OAuth 설정

## 운영 상태 (2026-10-19)

- 프로젝트: **Quick Link Mail** (기존 GoogleDriveTest와 분리)
- OAuth 사용자 유형: **외부(External)**
- 게시 상태: **프로덕션(In production)** — 직접 앱 게시 완료
- Google 공식 민감 범위 검증: **미완료** — 미검증 경고 및 최대 100명 사용자 제한 가능
- API/범위: Gmail API 사용, `https://www.googleapis.com/auth/gmail.send`
- 홈페이지: https://quicklink.ramza.duckdns.org/
- 개인정보처리방침: https://quicklink.ramza.duckdns.org/privacy.html
- 승인된 도메인: `ramza.duckdns.org` (Search Console DNS 소유권 확인)
- 발송 및 실제 수신: **정상 확인**

**새 PC는 같은 Cloud 프로젝트와 이미 생성된 고정 ID용 OAuth 클라이언트를 재사용합니다.** 공개키가 만드는 ID `ffdbaoipblppbkoomlgoonmddgijbmcg`에 연결된 `Quick Link Mail - Fixed ID` 클라이언트가 생성됐고, 신버전 Gmail 수신 검증도 2026-10-19 완료했습니다. [설치 가이드](INSTALL.md).

## 최초 Google Cloud 설정 기록

## 최초 Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 **Quick Link Mail** 생성 (기존 GoogleDriveTest와 분리)
2. **API 및 서비스 → 라이브러리 → Gmail API → 사용 설정**
3. **Google 인증 플랫폼 → 브랜딩**: 앱 이름 `Quick Link Mail`, 사용자 지원 이메일, 개발자 연락처 등 필수 항목
4. **대상(Audience)**: 개인 Gmail인 경우 **외부(External)**. 초기 테스트 때는 Testing을 사용했으나 **현재는 프로덕션**으로 전환 완료
5. 초기 Testing 기간에만 **테스트 사용자 → 발신 Google 계정** 등록이 필요했음. **현재 프로덕션에서는 추가할 필요 없음**
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

## 재인증 정책: 현재 프로덕션 기준

- Google은 **External / Testing** 상태에서 민감 권한을 허용한 사용자의 인증·갱신에 **7일 만료 정책**을 적용합니다.
- 현재는 **External / Production**이므로 **테스트 모드의 7일 만료 정책이 더 이상 적용되지 않습니다.**
- 그러나 **테스트 상태에서 발급된 기존 토큰이 자동으로 무기한 연장된다고 보장하지 않습니다.** 이전 승인이 만료되는 경우 **한 번 새로 인증**하세요. 지금 발송이 정상이라면 먼저 인증을 초기화할 필요 없습니다.
- Chrome `identity.getAuthToken({interactive:false})`는 캐시된 액세스 토큰을 자동 갱신할 수 있지만, 사용자의 접근 철회·계정 탈퇴/로그아웃·정책 변경 등으로 승인 화면이 필요할 수 있습니다.
- 재인증이 필요한 경우: **확장 옵션 → 계정 연결 초기화 → Google 계정 인증**. 이후 발송을 재검증합니다.
- **프로덕션 게시 ≠ 공식 Google 검증 완료**. 현재 `gmail.send` 민감 범위 미검증 상태여서 신규 계정에 경고가 보일 수 있고 사용자 100명 제한이 적용될 수 있습니다.
- GitHub `manifest.json.key` 공개키가 고정 ID `ffdbaoipblppbkoomlgoonmddgijbmcg`를 생성하며 새 OAuth 클라이언트로 실제 Gmail 발송·수신 검증 완료. [ID 가이드](EXTENSION_ID.md).

공식 참고: [Google OAuth 게시/검증 상태](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview), [7일 만료 정책](https://developers.google.com/identity/protocols/oauth2/), [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)

## 공식 참고 문서

- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
- [Gmail API OAuth 범위](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [OAuth 앱의 테스트·게시 상태](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)

## 보안

이 GitHub 저장소는 **Public**입니다. OAuth 클라이언트 ID는 공개 식별자지만 **OAuth client secret, access/refresh token, Gmail 비밀번호, `.pem` 패키징 개인키**는 절대 커밋하지 마세요. 수신자와 마지막 결과는 Chrome 프로필의 로컬 확장 저장소에 보관합니다.
