import { test } from '@playwright/test';
import { getVerificationCode } from './mail';

test('회원가입 → wid 가져오기', async ({ page }) => {
  test.setTimeout(180_000);

  let MAIL = process.env.MAIL!;
  let TEST_EMAIL;
  let TEST_PASSWORD;
  
  if (MAIL === 'naver') {
    TEST_EMAIL = process.env.NAVER_USER!;
    TEST_PASSWORD = process.env.NAVER_PASSWORD!;
  } else {
    TEST_EMAIL = process.env.GMAIL_USER!;
    TEST_PASSWORD = process.env.GMAIL_PASSWORD!;
  }

  await page.goto('https://weverse.io/');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.getByRole('button', { name: '회원가입' }).click();
  await page.getByRole('button', { name: '이메일로 가입하기' }).click();
  await page.getByRole('textbox', { name: '이메일 required' }).click();
  await page.getByRole('textbox', { name: '이메일 required' }).fill(TEST_EMAIL);
  await page.getByRole('button', { name: '인증코드 받기' }).click();

  const code = await getVerificationCode();
  console.log('받은 인증코드:', code);

  await page.getByRole('textbox', { name: '인증코드 required' }).click();
  await page.getByRole('textbox', { name: '인증코드 required' }).fill(code);
  await page.getByRole('button', { name: '인증코드 확인' }).click();

  await page.getByRole('textbox', { name: '비밀번호 확인 required' }).click();
  await page.getByRole('textbox', { name: '비밀번호 확인 required' }).fill('');
  await page.getByRole('textbox', { name: '비밀번호 required' }).click();
  await page.getByRole('textbox', { name: '비밀번호 required' }).fill(TEST_PASSWORD);
  await page.getByRole('textbox', { name: '비밀번호 확인 required' }).click();
  await page.getByRole('textbox', { name: '비밀번호 확인 required' }).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: '다음' }).click();
  await page.getByRole('checkbox', { name: '모두 동의' }).click();
  await page.getByRole('button', { name: '가입하기' }).click();
  await page.getByRole('button', { name: '확인', exact: true }).click();
  await page.getByRole('button', { name: '시작하기' }).click();

  const response = await page.waitForResponse(async (resp) => {
    if (!resp.ok()) return false;
    try {
      const json = await resp.json();
      console.log('json:', json);
      return 'wid' in json;
    } catch {
      return false;
    }
  });

  const data = await response.json();
  const wid = data.wid;
  console.log("ID:", TEST_EMAIL);
  console.log("PASSWORD:", TEST_PASSWORD);
  console.log('WID:', wid);
});
