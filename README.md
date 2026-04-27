# weverse 과제_문제 2번

playwright로 weverse QA 자동화 테스트

## 처음 받았을 때

```
npm install
npx playwright install
```

## .env 파일 수정하기

프로젝트 루트에 `.env` 파일 내용을 채워주세요.
gmail, naver 중 사용할 이메일 한가지만 채우면 됩니다.

```
# gmail 또는 naver
MAIL=naver

GMAIL_USER=
GMAIL_PASSWORD=
# https://myaccount.google.com/apppasswords 에서 앱 비밀번호를 발급받아야 합니다. (앱 비밀번호의 공백을 제거해서 GMAIL_APP_PASSWORD에 붙여넣어야 합니다.)
GMAIL_APP_PASSWORD=

NAVER_USER=
NAVER_PASSWORD=
# https://help.naver.com/service/30029/contents/21344?lang=ko&osType=COMMONOS 를 참고해서 앱 비밀번호를 발급받아야 합니다.
NAVER_APP_PASSWORD=

COMMUNITY_NAME=
```

### 채울 것

- `MAIL` - 인증코드를 어디서 받을지 (`gmail` 또는 `naver`)
- `GMAIL_USER` 또는 `NAVER_USER` - 로그인할 이메일 아이디
- `GMAIL_PASSWORD` 또는 `NAVER_PASSWORD` - weverse 로그인 비번
- `GMAIL_APP_PASSWORD` 또는 `NAVER_APP_PASSWORD` - imap 접속용 앱 비밀번호 (위 링크에서 발급)
- `COMMUNITY_NAME` - 테스트할 커뮤니티 이름 (예: `BTS`)

## 테스트 실행

회원가입 테스트:

```
npm run test:signup
```

포스트 테스트:

```
npm run test:post
```

포스트 테스트는 sms 인증 단계에 pause가 걸려있습니다.
sms인증을 수동으로 진행한 후 `계속 진행하기` 버튼을 눌러
sms인증 팝업이 닫히면 Inspector의 resume 버튼으로 테스트가 이어서 진행되게 해야합니다.