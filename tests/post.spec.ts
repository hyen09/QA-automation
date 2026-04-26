import { test, expect } from '@playwright/test';
import path from 'path';
import { getVerificationCode } from './mail';


test('포스트 쓰기, 확인, 수정, 삭제', async ({ page }) => {
  test.setTimeout(300_000);
  
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
  
  // 로그인
  await page.goto('https://weverse.io/');
  await page.getByRole('button', { name: '로그인' }).click();  
  await page.getByRole('button', { name: '이메일로 로그인' }).click();
  await page.getByRole('textbox', { name: 'your@email.com' }).click();
  await page.getByRole('textbox', { name: 'your@email.com' }).fill('');
  await page.getByRole('textbox', { name: 'your@email.com' }).fill(TEST_EMAIL);
  await page.getByRole('textbox', { name: 'your@email.com' }).press('Tab');
  await page.getByRole('button', { name: 'clear' }).press('Tab');
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: '로그인' }).click();

  const codeInput = page.getByRole('textbox', { name: '인증코드' });
  await codeInput.click();
  const code = await getVerificationCode();
  await codeInput.fill(code);
  await page.getByRole('button', { name: '인증코드 확인' }).click();
  await page.getByRole('button', { name: '확인', exact: true }).click();

  // weverse.io로 리다이렉트 완료될 때까지 기다리기 
  await page.waitForURL('https://weverse.io/**', { timeout: 30000 });
});



