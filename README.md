# CLS 진단 도구

CLS에듀케이션에서 학생에게 안내하는 진단 페이지 모음입니다.
서버 없이 파일만으로 도는 정적 사이트라, 파일을 고쳐 올리면 그대로 반영됩니다.

## 구성

```
index.html          진단 목록 (첫 화면)
susi/index.html     수시 지원 전략 자가진단 (61문항)
logo.webp           파비콘
logo-clsedu-landscape.webp   카카오톡 공유 미리보기 이미지
```

주소는 폴더 이름 그대로입니다. `susi/index.html` → `/susi`

## 배포

팀장 소유 Vultr 서버(서울)의 **Coolify**로 배포합니다.

- Coolify: `http://158.247.198.11:8000`
- 배포 방식: **Static** 빌드팩 (별도 빌드 과정 없음)
- 이 저장소에 push 하면 Coolify가 자동으로 다시 배포합니다

정식 주소는 `survey.clsedu.co.kr` 을 쓸 예정입니다.
`clsedu.co.kr` 의 DNS가 Cloudflare 타 계정에 있어, 아래 한 줄을 추가해야 연결됩니다.

```
Type: A   Name: survey   IPv4: 158.247.198.11   Proxy: DNS only
```

그전까지는 Coolify가 만들어 주는 임시 주소로 씁니다.

## 결과 데이터

설문 결과는 구글 스프레드시트로 받습니다.
`susi/index.html` 안의 `SHEET_URL` 에 Apps Script 배포 주소를 넣으면 동작합니다.
설정 방법은 `app.clsedu.co.kr` 저장소의 `docs/susi-google-sheet.md` 를 참고하세요.

## 결과 화면만 빠르게 보려면

`/susi?demo=1` 로 열거나, 첫 화면의 **신내동 CLS에듀케이션** 글씨를 세 번 누르면
답이 무작위로 채워진 결과 화면이 바로 열립니다. 이 경우 결과는 전송되지 않습니다.
