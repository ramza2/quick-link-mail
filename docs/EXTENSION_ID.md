# Chrome 확장 ID 고정 현황

## 고정 ID (2026-10-19)

- **GitHub 공개키 설정 완료:** `manifest.json`의 최상위 **`"key"`** 필드에 RSA 공개키의 Base64 DER 값 기록.
- **계산으로 검증한 ID:** `ffdbaoipblppbkoomlgoonmddgijbmcg`
- 현재 사용 중인 기존 Chrome 확장은 **별도 ID**일 수 있습니다. 정상 동작하는 기존 설치/인증은 아직 건드리지 않았습니다.
- **대기 작업:** Google Cloud **Quick Link Mail** 프로젝트에서 이 고정 ID용 Chrome 확장 프로그램 OAuth 클라이언트를 만들고, 별도 Chrome 프로필에서 새 확장 Gmail 발송·수신을 검증해야 합니다.

새 설치에 필요한 것은 **공개키가 포함된 GitHub 소스 + 고정 ID용 OAuth 클라이언트 ID**입니다. 개인키는 Chrome 압축해제 확장의 ID 확인에 사용하지 않고, 향후 서명된 CRX를 제작하는 경우를 위해 사용자 미니PC에 보관합니다. **개인키(PEM)를 GitHub에 올리지 마세요.**

## 다른 PC 설치

1. [다른 PC 설치 가이드](INSTALL.md)에 따라 최신 소스를 받습니다.
2. `chrome://extensions`에 압축해제 폴더를 로드합니다. ID `ffdbaoipblppbkoomlgoonmddgijbmcg`가 출력되는지 확인합니다.
3. Google Cloud Quick Link Mail 프로젝트의 **고정 ID용 OAuth 클라이언트**를 재사용하여 로컬 `manifest.json.oauth2.client_id`에 설정하고 확장 새로고침.
4. 각 PC에서 수신 Gmail 주소를 저장하고 발신 Google 계정을 인증합니다.
5. 실제 Gmail 수신을 검증합니다.

## 기존 설치에서 이전

이전 설치에 적용된 키가 없어 기존 ID가 폴더 경로 기반으로 부여되었다면 **새 공개키가 기존 ID를 보존하지 않습니다.** 새 고정 ID는 Chrome의 다른 확장 프로그램으로 취급되므로 기존 수신자/인증 데이터가 자동 이동하지 않습니다. 기존 확장은 유지하고 **별도 Chrome 프로필에 새 ID 확장을 설치 후 검증**하세요. [절차 및 원상 복구](ID_MIGRATION_RUNBOOK.md).

## 키 취급

- 공개키: `manifest.json.key`에 포함해 GitHub 공유 가능.
- 개인키: 사용자 미니PC의 개인 디렉터리에서 관리하고 외부 공개 금지.
- `key`를 변경하면 확장 ID와 연결된 OAuth 클라이언트가 바뀔 수 있으므로 **다시 생성하지 마세요.**
- 현재 `oauth2.client_id`는 공개 GitHub에서 자리표시자이며, 실제 값은 각 PC의 로컬 파일에서 설정합니다.
- 기존 Google Cloud OAuth 클라이언트는 새 ID 테스트가 통과할 때까지 유지합니다.

## 참고

[Chrome 확장 OAuth 구성](https://developer.chrome.com/docs/extensions/reference/manifest/oauth2) · [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
