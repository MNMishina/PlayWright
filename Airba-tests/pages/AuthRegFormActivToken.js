const { expect } = require("@playwright/test");
const dotenv = require("dotenv");

export class AuthRegFormActivToken {
  /**
   * Класс для авторизации пользователя
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').Request} request
   */
  constructor(page, request) {
    this.page = page;
    this.request = request;

    this.elementButton = "button";

    this.elementButtonText1 = "Войти";
    this.elementButtonText2 = "Продолжить";
    this.elementButtonText3 = "Профиль";
    this.elementButtonText4 = "НАСТРОЙКИ";
    this.elementButtonText5 = "Выйти из профиля";

    this.elementInputText1 = "Введите номер телефона";
    this.elementInputText2 = "Введите код из SMS";

    
  }

  async verifyResponseArrayActive(registeredPhone, correctSms){

    await this.request.post('https://api.mp-test.airba.dev/sso/api/v1/auth/signin/fast', {
      data: {
        phone:registeredPhone
      }
    });

    const response = await this.request.post('https://api.mp-test.airba.dev/sso/api/v1/auth/signin/fast/verify', {
      data: {
        otp: correctSms,
        phone: registeredPhone
      }
    });

    const { tdid, access_token, refresh_token } = await response.json();

    await this.page.evaluate(async (refresh_token) => {
 
      window.localStorage.setItem("refresh_token", refresh_token);
      window.localStorage.setItem("auth_token", 'CAN_BE_ANYTHING');

    }, refresh_token );

    await this.page.reload();

  }

  verifyResponseArray() {

    const verifyResponseArray = {

      tdid: dotenv.config().parsed.TDID,
      access_token: dotenv.config().parsed.ACCESS_TOKEN,
      refresh_token: dotenv.config().parsed.REFRESH_TOKEN
      
    };

    return verifyResponseArray;

  }

  async apiAuthReload() {

    const verifyResponseArrayRefresh = this.verifyResponseArray();
      
    await this.page.evaluate(async (refresh_token) => {
 
      window.localStorage.setItem("refresh_token", refresh_token);
      window.localStorage.setItem("auth_token", 'CAN_BE_ANYTHING');

    }, verifyResponseArrayRefresh.refresh_token);

    await this.page.reload();
  }

  async loginAuth(registeredPhone, correctSms) {
    //Находясь на главной, нажимает кнопку "Войти"
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText1 }).click();
    await this.page.getByPlaceholder(this.elementInputText1).fill(registeredPhone);
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText2 }).click();

    //Вводит валидный смс-код
    await this.page.getByPlaceholder(this.elementInputText2).fill(correctSms);
  }

  async loginAuthProfile() {
    //Заходим в профиль
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText3 }).click();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText4 }).click();
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText5 }).click();
  }
}

//console.log('Выполнена авторизация');
// console.log('here', this)
//export async function loginAuth(page, registeredPhone, correctSms) {}
