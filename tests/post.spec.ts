import { test, expect } from '@playwright/test';
import path from 'path';
import { getVerificationCode } from './mail';


test('포스트 쓰기, 확인, 수정, 삭제', async ({ page }) => {
  test.setTimeout(300_000);
  
  let MAIL = process.env.MAIL!;
  let TEST_EMAIL;
  let TEST_PASSWORD;
  let COMMUNITY_NAME = process.env.COMMUNITY_NAME!;
  
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

  // 인증코드 인풋이 보이는지 확인
  const codeInput = page.getByRole('textbox', { name: '인증코드' });
  let codeInputVisible = false;
  try {
    await codeInput.waitFor({ state: 'visible', timeout: 5000 });
    codeInputVisible = true;
  } catch {
    console.log('인증코드 입력 필요 없는 케이스');
  }

  // 인증코드 input이 보이면 인증 진행
  if (codeInputVisible) {
    await codeInput.click();
    const code = await getVerificationCode();
    await codeInput.fill(code);
    await page.getByRole('button', { name: '인증코드 확인' }).click();
    await page.getByRole('button', { name: '확인', exact: true }).click();
  }

  // weverse.io로 리다이렉트 완료될 때까지 기다리기 
  await page.waitForURL('https://weverse.io/**', { timeout: 30000 });

  // 커뮤니티 가입하기
  await page.getByRole('button').filter({ hasText: '커뮤니티 찾기' }).click();
  await page.getByRole('textbox', { name: 'search' }).fill(COMMUNITY_NAME);

  const searchResultItem = page
    .getByRole('listitem')
    .filter({ has: page.getByRole('button', { name: '가입' }) })
    .filter({ hasText: COMMUNITY_NAME });

  await expect(searchResultItem).toBeVisible();
  await searchResultItem.getByRole('link', { name: COMMUNITY_NAME }).click();
  await page.locator('#iwma').getByRole('button', { name: '가입하기' }).click();
  await page.getByLabel('wev3 modal').locator('button').filter({ hasText: '가입하기' }).click();

  
});



