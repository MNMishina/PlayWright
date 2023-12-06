import { test, expect } from '@playwright/test';
import { AuthRegForm } from './pages/AuthRegForm';

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
  
  test('Пользователь авторизуется по своему аккаунту', async ({ page }) => {

    const authRegForm = new AuthRegForm(page);
    await authRegForm.loginAuth(registeredPhone, correctSms);

  });

  test('Пользователь авторизуется по своему аккаунту с подстановкой JSON Request', async ({ page }) => {
    
    const authRegForm = new AuthRegForm(page);
    await authRegForm.apiAuth();
    await authRegForm.loginAuth(registeredPhone, correctSms);
    
  });

  test('Находясь на главной, пользователь имея аккаунт выходит после авторизации', async ({ page }) => {

    const authRegForm = new AuthRegForm(page);
    await authRegForm.apiAuthReload();
    //await page.waitForTimeout(2000);
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.page.reload(); 
    await authRegForm.loginAuthProfileNewUser();
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.page.reload();
    await authRegForm.loginAuthProfile();
    await authRegForm.page.reload();

  });

})