import { test, expect } from '@playwright/test';
import { AuthRegFormActivToken } from './pages/AuthRegFormActivToken';

const registeredPhone = '7775000101';
const correctSms = '1111';

test.describe('UI Tests - Authorization', async () => {
  
  //Хук выполняется перед каждым тестом
  test.beforeEach(async ({ page }) => {
    await page.goto('https://airba:bJR63XgzSqRYGhHV55BDMF@test.airba.dev');
    await expect(page).toHaveTitle('Airba.kz – Сотни тысяч товаров по выгодным ценам!');
  });

  //Размеры экрана width=1232 px минимальные
  test.use({ viewport: { width: 1232, height: 1200 } });
  
  
  test('Пользователь получает токен авторизации из env конфигурации', async({ page, request }) => {

    const authRegForm = new AuthRegFormActivToken(page, request);
    await authRegForm.apiAuthReload();
    await page.waitForTimeout(2000);
    await authRegForm.loginAuthProfile();

  });

  test('Пользователь получает токен авторизации методом POST', async({ page, request }) => {

    const authRegForm = new AuthRegFormActivToken(page, request);
    await authRegForm.verifyResponseArrayActive(registeredPhone, correctSms);
    await authRegForm.loginAuthProfile();
    await page.waitForTimeout(2000);

  });

})