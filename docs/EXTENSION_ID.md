# Chrome 확장 프로그램 ID 고정 및 PC 이전

## 현재 상태 (2026-10-16)

**아직 ID를 고정하지 않았습니다.** `manifest.json`에는 `oauth2.client_id`만 있으며 `key` 필드가 없습니다. Chrome은 압축해제된 확장 프로그램을 다른 설치 경로에서 불러올 때 **다른 확장 ID**를 부여할 수 있습니다. OAuth Chrome 확장 프로그램 클라이언트는 특정 확장 ID와 연결됩니다.

현재 정상 사용 중인 PC의 확장 ID는 **변경하지 마세요.** OAuth 프로덕션 게시 여부는 ID 생성 방식과 무관합니다.

## 선택지 A — 당장 가장 안전한 방법 (현재 지원)

**기존 PC 그대로 유지 + 다른 PC는 개별 OAuth 클라이언트 생성**

1. 다른 PC에서 소스를 clone 또는 ZIP으로 내려받고 `chrome://extensions` → **압축해제된 확장 프로그램을 로드합니다**로 설치
2. 해당 PC 확장 ID 32자리를 복사
3. 기존 **Quick Link Mail Google Cloud 프로젝트 → 클라이언트 → 클라이언트 만들기**
4. 유형 **Chrome 확장 프로그램**, 애플리케이션 ID에 새 PC 확장 ID 입력
5. 발급된 OAuth 클라이언트 ID를 **그 PC의 로컬** `manifest.json`에 설정
6. 확장 프로그램 새로고침, 수신 Gmail 저장, Google 발신 계정 인증, 발송 확인
7. 기존 PC/Cloud OAuth 클라이언트는 삭제하거나 수정하지 않음

**장점:** 기존 PC 영향 없음. **단점:** 새 PC/설치 경로마다 OAuth 클라이언트를 관리해야 할 수 있음.

## 선택지 B — 추후 권장 개선 (별도 작업 필요)

**공개키 `manifest.key`를 추가하여 모든 PC가 동일한 확장 ID를 사용하도록 마이그레이션**합니다. Chrome에서 권장하는 방식입니다. 하지만 현재 정상 ID가 키에서 파생된 ID가 아닌 경우 새 공개키를 임의로 추가하면 **ID가 바뀝니다.**

안전한 마이그레이션 절차:

1. 현재 PC의 `chrome://extensions`에 표시되는 32자리 기존 확장 ID를 확인·기록
2. 기존 확장의 수신자 설정과 현재 OAuth 클라이언트 관계를 확인
3. 별도 테스트 환경에서 새 확장 서명용 키쌍을 생성하고 **공개키만** `manifest.key`로 사용; **비밀 `.pem`은 로컬 안전한 보관소**에 보관하며 GitHub에 올리지 않음
4. 새 `manifest.key`를 지정한 테스트용 확장 프로그램에서 예상한 고정 ID가 나오는지 확인 (기존 설치는 아직 건드리지 않음)
5. Google Cloud **Quick Link Mail** 프로젝트에 그 고정 ID에 대한 Chrome 확장 프로그램 OAuth 클라이언트 생성
6. 소스 `manifest.json`에 공개 `key`를 넣고 발급된 OAuth 클라이언트 ID 연결 정책 정리 (client ID를 공개 저장소에 넣을지 또는 배포용 설정 분리할지 결정)
7. 현 PC를 포함한 새 배포 환경에서 **새 ID로 설치·재인증·수신자 재설정 후 발송 검증**
8. **새 설치의 정상 발송이 확인된 다음에만** 이전 확장/클라이언트 정리. 이전 확장 삭제 시 로컬 설정이 삭제될 수 있음

**주의:** 기존 ID가 무작위/경로 기반으로 생성되었다면 **임의로 생성한 새 키가 기존 ID를 그대로 보존해 주지는 않습니다.** 필요한 공개키 자료가 없는 상태에서 기존 ID와 일치하는 키를 역으로 만들 수 있다고 가정하지 마세요.

### 필요 입력 (추후 고정 작업 착수 시)

- 현재 PC의 **Chrome 확장 ID 32자리** (비밀이 아님)
- 현재 확장 프로그램 설치 방법 (압축해제 로드인지, 패키징/스토어인지)
- 모든 PC에서 동일 ID로 통일할지, 현재 PC ID 유지가 더 중요한지 사용자 승인

### 아직 변경하지 않은 항목

- `manifest.json`의 `key` 미추가
- 기존 Google Cloud OAuth 클라이언트와 현재 PC 인증 유지
- 이미 사용 중인 브라우저 설정 / 토큰 초기화 미수행

## 공식 문서

- [Chrome 확장 OAuth manifest 설정 및 `key`](https://developer.chrome.com/docs/extensions/reference/manifest/oauth2)
- [Chrome 확장 Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity)
- [다른 PC 설치 안내](INSTALL.md)
