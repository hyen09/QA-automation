import { test } from '@playwright/test';
import { getVerificationCode } from './mail';

const TEST_EMAIL = process.env.EMAIL!;
const TEST_PASSWORD = process.env.PASSWORD!;

test('회원가입 → wid 가져오기', async ({ page }) => {
  test.setTimeout(180_000);

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
});
