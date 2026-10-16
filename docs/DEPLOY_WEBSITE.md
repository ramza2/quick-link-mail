# Quick Link Mail — 미니PC 웹사이트 배포 및 OAuth 운영 전환

이 문서는 기존 `picknext.ramza.duckdns.org` / Traefik 운영 환경을 보호하면서 **정적 안내 웹사이트만 추가**하기 위한 안내입니다.

## 확인한 기존 환경

- Traefik: Docker network `proxy`, HTTPS entrypoint `websecure`, 인증서 리졸버 `myresolver`
- ACME: `--certificatesresolvers.myresolver.acme.tlschallenge=true` (**TLS-ALPN-01**)
- 저장 경로: `/home/ramza/traefik/letsencrypt`
- 기존 PickNext compose / Traefik 컨테이너 / 인증서 저장 파일은 변경하지 않음
- Quick Link Mail 웹사이트에만 `quicklink.ramza.duckdns.org` 새 라우터 등록
- OAuth 인증 흐름에는 홈페이지용 리디렉션 URI가 필요하지 않음(Chrome 확장 프로그램 OAuth)

## 1. 도메인 DNS 확인(읽기 전용)

미니PC에서:

~~~bash
getent ahostsv4 picknext.ramza.duckdns.org | head -1
getent ahostsv4 quicklink.ramza.duckdns.org | head -1
~~~

두 주소가 동일한 공인 IP로 조회되는지 확인합니다. 새 호스트의 DNS 응답이 없으면 배포를 잠시 멈추고 DuckDNS 도메인/와일드카드 설정을 확인하세요. 기존 PickNext DNS 설정을 변경하지 마세요.

## 2. 기존 네트워크 확인

~~~bash
docker network inspect proxy --format '{{.Name}}'
docker ps --format 'table {{.Names}}\t{{.Image}}' | grep -i traefik
~~~

`proxy`가 존재하지 않으면 `docker network create`를 먼저 실행하지 말고 기존 Traefik 네트워크 구성부터 확인하세요.

## 3. 사이트 컨테이너만 배포

홈서버에서 저장소가 아직 없다면:

~~~bash
cd ~
git clone https://github.com/ramza2/quick-link-mail.git
cd quick-link-mail
~~~

이미 clone 했다면 해당 디렉터리에서 소스 최신화를 진행하되 로컬 `manifest.json`의 OAuth 클라이언트 ID 변경분은 덮어쓰지 않도록 주의합니다.

별도 Compose 프로젝트로 실행:

~~~bash
docker compose -p quick-link-mail-site -f deploy/compose.website.yml config
docker compose -p quick-link-mail-site -f deploy/compose.website.yml up -d
docker compose -p quick-link-mail-site -f deploy/compose.website.yml ps
~~~

이 Compose는 **외부 포트를 publish 하지 않으며** Traefik `proxy` 네트워크에서 Nginx 포트 80으로 라우팅합니다. 기존 PickNext Compose/컨테이너를 재시작하지 않습니다.

## 4. 외부 HTTPS 검증

~~~bash
curl -I --max-time 15 https://quicklink.ramza.duckdns.org/
curl -I --max-time 15 https://quicklink.ramza.duckdns.org/privacy.html
~~~

두 주소가 200 OK이고 브라우저에서 인증서 경고 없이 표시되면 성공입니다.

- HTTPS 인증서 발급은 Traefik의 기존 `myresolver`와 TLS-ALPN-01을 사용합니다.
- TLS-ALPN-01 방식은 공인 인터넷에서 **TCP 443**으로 접근 가능해야 합니다.
- 404이면 라우터 이름/Host/DNS를, 502이면 Nginx 컨테이너·`proxy` 연결을 확인하세요.
- 실패했다고 기존 PickNext나 `acme.json`을 삭제하거나 Traefik을 재설정하지 마세요.

## 5. Google Search Console — 도메인 소유권

**중요: 이 단계는 배포만으로 자동 처리되지 않습니다.**

1. [Search Console](https://search.google.com/search-console) 에서 **Quick Link Mail Google Cloud 프로젝트의 Owner 계정**으로 로그인
2. `속성 추가(Add property) → 도메인(Domain)` 선택
3. 도메인 `ramza.duckdns.org` 입력(프로토콜/서브도메인 접두어 없이)
4. Google이 발급한 `google-site-verification=...` TXT 값 복사
5. DuckDNS API의 `txt` 파라미터를 사용해 도메인 `ramza`에 등록

DuckDNS TXT 요청의 정확한 형식은 공식 문서를 참고하세요:
https://www.duckdns.org/spec.jsp

**주의:** DuckDNS는 소유 도메인 아래 하위 도메인에서 TXT를 공유하고, 단일 TXT 값 제약이 있을 수 있습니다. 기존 TXT 레코드가 있는지 먼저 확인하세요. 현재 Traefik은 DNS-01이 아닌 TLS-ALPN-01이므로 인증서 갱신용 TXT를 사용하지 않습니다.

인증용 DuckDNS 토큰은 URL에 포함될 수 있으므로 **GitHub, 스크린샷, 대화, 터미널 이력 등에 노출하지 마세요.** 가능한 한 토큰을 읽고 입력하는 과정은 안전하게 관리하세요.

Search Console에 등록한 **도메인 속성** 검증을 완료한 후 Google Auth Platform에서 `ramza.duckdns.org`를 승인된 도메인에 등록합니다. DuckDNS 하위 도메인이 Google 정책상 거부되면 URL 접두어 속성으로 대체하지 말고, 소유 가능한 별도 커스텀 도메인을 검토해야 합니다.

## 6. Google 인증 플랫폼 — 브랜딩 및 게시

**Quick Link Mail** 프로젝트에서:

- 브랜딩 / 홈페이지 URL: https://quicklink.ramza.duckdns.org/
- 개인정보처리방침 URL: https://quicklink.ramza.duckdns.org/privacy.html
- 승인된 도메인: `ramza.duckdns.org` (Google이 수락한 경우)
- 사용자 지원 이메일 및 연락처: 프로젝트의 유효한 계정
- 대상(Audience): 준비가 끝난 후 `앱 게시(Publish app)` 진행

게시(Published)는 Google의 공식 검증(Verified)과 다릅니다. 개인용 소수 사용자에게는 검증 예외가 있을 수 있지만 미검증 앱 경고·사용자 수 제한은 남을 수 있습니다. Google의 판단에 따라 추가 검증이 요구될 수도 있습니다.

## 배포 중지 및 롤백

~~~bash
docker compose -p quick-link-mail-site -f deploy/compose.website.yml down
~~~

이 명령은 Quick Link Mail 사이트 컨테이너/네트워크 연결만 내립니다. **PickNext, Traefik, ACME 인증서 데이터는 삭제하지 않습니다.** `down -v`는 사용하지 마세요.

## 관련 문서

- [Quick Link Mail 설치 가이드](INSTALL.md)
- [Google OAuth 설정](GOOGLE_OAUTH_SETUP.md)
- [오류 해결](TROUBLESHOOTING.md)
- [Google 공식 도메인 검증 요건](https://support.google.com/cloud/answer/13804266)
