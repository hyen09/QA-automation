import { test } from '@playwright/test';
import { getVerificationCode } from './mail';

const TEST_EMAIL = process.env.EMAIL!;

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
});
