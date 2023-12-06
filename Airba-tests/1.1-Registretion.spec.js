import { test, expect } from '@playwright/test';
import { AuthRegForm } from './pages/AuthRegForm';

const unregisteredPhone = '7775000101';
const correctSms = '1111';

test.describe('UI Tests - Registration', async () => {
  
  //Хук выполняется перед каждого теста
  test.beforeEach(async ({ page }) => {
    await page.goto('https://airba:bJR63XgzSqRYGhHV55BDMF@test.airba.dev');
    await expect(page).toHaveTitle('Airba.kz – Сотни тысяч товаров по выгодным ценам!');
  });

  //Размеры экрана width=1232 px минимальные
  test.use({ viewport: { width: 1232, height: 1200 } });
  
  test('Новый пользователь авторизуется', async ({ page, request }) => {
    
    const authRegForm = new AuthRegForm(page, request);
    await authRegForm.apiAuthNewAcount(unregisteredPhone);
    await authRegForm.loginAuth(unregisteredPhone, correctSms);
  
  });

  test('Новый пользователь авторизуется переходит в профиль заполняет Имя и Email', async ({ page, request }) => {
    
    const authRegForm = new AuthRegForm(page, request);
    await authRegForm.apiAuthNewAcount(unregisteredPhone);
    await authRegForm.loginAuth(unregisteredPhone, correctSms);
    await authRegForm.page.reload(); 
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.loginAuthProfileNewUser();
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.page.reload();
    
    //await authRegForm.loginAuthProfileNewUser();
    await authRegForm.newLoginAuthProfile();
  
  });

  test('Новый пользователь авторизуется переходит в профиль и заполняет только Имя', async ({ page, request }) => {
    
    const authRegForm = new AuthRegForm(page, request);
    await authRegForm.apiAuthNewAcount(unregisteredPhone);
    await authRegForm.loginAuth(unregisteredPhone, correctSms);

    await authRegForm.page.reload(); 
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.loginAuthProfileNewUser();
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.page.reload();

    await authRegForm.newLoginAuthProfileOnlyUserName();

  });

  test('Новый пользователь авторизуется переходит в профиль и заполняет Email', async ({ page, request }) => {

    const authRegForm = new AuthRegForm(page, request);
    await authRegForm.apiAuthNewAcount(unregisteredPhone);
    await authRegForm.loginAuth(unregisteredPhone, correctSms);

    await authRegForm.page.reload(); 
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.loginAuthProfileNewUser();
    await authRegForm.page.waitForTimeout(1000);
    await authRegForm.page.reload();

    //await authRegForm.newLoginAuthProfileOnlyUserName();
    //await authRegForm.apiAuthNewAcountEmail()

    await authRegForm.newLoginAuthProfileOnlyUserEmail();
  
  });
})