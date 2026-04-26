import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

// 인증코드 가져오기 함수
export async function getVerificationCode() {
  // .env 에서 아이디랑 비번 꺼내기
  let MAIL = process.env.MAIL!;
  let TEST_EMAIL;
  let TEST_APP_PASSWORD;
  let HOST;

  if (MAIL === 'naver') {
    TEST_EMAIL = process.env.NAVER_USER;
    TEST_APP_PASSWORD = process.env.NAVER_APP_PASSWORD;
    HOST = 'imap.naver.com';
  } else {
    TEST_EMAIL = process.env.GMAIL_USER;
    TEST_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    HOST = 'imap.gmail.com';
  }

  let now = new Date();

  // 20번 시도 (3초씩 = 1분)
  for (let i = 0; i < 20; i++) {
    console.log('인증코드 찾는중...', (i + 1));

    // imap 접속
    let client = new ImapFlow({
      host: HOST,
      port: 993,
      secure: true,
      auth: { user: TEST_EMAIL!, pass: TEST_APP_PASSWORD! },
      logger: false,
    });
    try {
      await client.connect();
    } catch (e) {
      console.error('imap connect 실패:', e);
      throw e;
    }
    let lock = await client.getMailboxLock('INBOX');

    // 가장 최근 메일 가져오기
    let exists = (client.mailbox as any).exists;
    if (exists > 0) {
      let msg = await client.fetchOne(String(exists), { source: true });
      if (msg && msg.source) {
        let parsed = await simpleParser(msg.source);

        if (parsed.date && new Date(parsed.date) < now) {
          console.log('옛날 메일이라 스킵:', parsed.date);
        } else {
          // 메일 제목에서 6자리 숫자 찾기
          let subject = parsed.subject || '';
          let result = subject.match(/\d{6}/);

          if (result) {
            let code = result[0];
            console.log('찾음!', code);
            lock.release();
            await client.logout();
            return code;
          }
        }
      }
    }

    // 정리하고 3초 기다리기
    lock.release();
    await client.logout();
    await new Promise(function (r) {
      setTimeout(r, 3000);
    });
  }

  throw new Error('인증코드 못찾음 ㅠㅠ');
}
