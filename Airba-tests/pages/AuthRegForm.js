const { expect } = require("@playwright/test");
  /**
   * Класс шаблона json ответа вызова api - users/info
   * @param {import('@playwright/test')}
   */
  class CreateUser {
    user = {
      "id": "6364da9b8771173ce5b020f2",
      "first_name":"",
      "last_name":"",
      "patronymic":"",
      "phone":"",
      "email":"",
      "created_at":"2022-12-09T04:32:21Z",
      "updated_at":"2022-12-09T04:32:26Z",
      "language":"ru",
      "is_enabled":true,
      "is_phone_verified":true,
      "is_email_verified":false
    }
    constructor({
      first_name= '', 
      email = '',
      phone = ''
    }) {
      this.user.email = email;
      this.user.first_name = first_name;
      this.user.phone = phone;
    }

    getUser () {
      return this.user;
    }
  }

export class AuthRegForm {
  /**
   * Класс для авторизации пользователя
   * @param {import('@playwright/test').Page} page
   */
  constructor(page, request) {
    this.page = page;
    this.request = request;

    this.elementButton = "button";
    this.elementLink = "link";

    this.elementButtonText1 = "Войти";
    this.elementButtonText2 = "Продолжить";
    this.elementButtonText3 = "Профиль";
    this.elementButtonText4 = "НАСТРОЙКИ";
    this.elementButtonText5 = "Выйти";
    this.elementButtonText6 = "Продолжить";
    this.elementButtonText7 = "Закрыть";

    this.elementInputText1 = "phone-number";
    this.elementInputText2 = "otp-input";
    this.elementInputText3 = "Введите ваше имя";
    this.elementInputText4 = "Введите email";
  }

  verifyResponseArray() {
    const verifyResponseArray = {
      "tdid": "637f27d7bbd02a845c742527",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiYWlyYmEtbWFya2V0cGxhY2UiLCJleHAiOjE3MDE4MTYzNDUsImlzX3JlZnJlc2giOmZhbHNlLCJyb2xlcyI6WyJ1c2VyIl0sInRkaWQiOiI2MzdmMjdkN2JiZDAyYTg0NWM3NDI1MjcifQ.1QlSV7PfbAkiDi-nqk7tzOkDi2o63s5ezZwVp1-_wtA",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiYWlyYmEtbWFya2V0cGxhY2UiLCJleHAiOjE3MDQ0MDExNDUsImlzX3JlZnJlc2giOnRydWUsInJvbGVzIjpbInVzZXIiXSwidGRpZCI6IjYzN2YyN2Q3YmJkMDJhODQ1Yzc0MjUyNyJ9.GcxcqhwhCvuhnTK1F5XnTBNHipgnAqqlqJBmNYiaQWE"
    };
    return verifyResponseArray;
  }


  async apiAuth() {

    const verifyResponse = this.verifyResponseArray();

    await this.page.route("**/sso/api/v1/auth/signin/fast", (route) => {
      route.fulfill({
        body: JSON.stringify({
          masked_phone: "7777*****01",
        }),
      });
    });

    await this.page.route("**/sso/api/v1/auth/signin/fast/verify", (route) => {
      if (route.request().postData()?.includes(`"otp":"1111"`)) {
        route.fulfill({
          body: JSON.stringify(verifyResponse),
        });
      } else {
        route.abort();
      }
    });
  }

  //Метод для нового пользователя у которого незаполнены поля Имя и Email
  async apiAuthNewAcount() {

    const verifyResponse = this.verifyResponseArray();

    await this.page.route("**/sso/api/v1/auth/signin/fast", (route) => {
      route.fulfill({
        body: JSON.stringify({masked_phone: "7777*****01"}),
      });
    });

    await this.page.route("**/sso/api/v1/auth/signin/fast/verify", (route) => {
      if (route.request().postData().includes(`"otp":"1111"`)) {
        route.fulfill({body: JSON.stringify(verifyResponse)});
      } else {
        route.abort();
      }
    });

    await this.page.route("**/user-profile/api/v1/profile", (route) => {
      route.fulfill({
        body: JSON.stringify({"tdid":verifyResponse.tdid}),
      });
    });

    const newUser = new CreateUser({first_name: '', email: '', phone: '77775000101'})

    await this.page.route("**/sso/api/v1/users/info", (route) => {
      route.fulfill({
        body: JSON.stringify(newUser.getUser())
      });
    });

  }

  //Метод для нового пользователя у которого незаполнено поле email
  async apiAuthNewAcountEmail() {

    const newUser = new CreateUser({first_name: 'MaxXXX', email: '', phone: '77775000101'})

    await this.page.route("**/sso/api/v1/users/info", (route) => {
      route.fulfill({
        body: JSON.stringify(newUser.getUser()),
      });
    });

  }

  async apiAuthReload() {

    const verifyResponseArrayRefresh = this.verifyResponseArray();
      
    await this.page.evaluate(async (refresh_token) => {
 
      window.localStorage.setItem("refresh_token", refresh_token);
      window.localStorage.setItem("auth_token", 'CAN_BE_ANYTHING');

    }, verifyResponseArrayRefresh.refresh_token);

    await this.page.reload();
  }

  //------------
  //Подменять в запросе эндпоинты, что это новый пользователь 
  //Посмотреть какие эндпоинты вызываются у нового пользователя
  //------------
  //Добавить проверку с беком обновились ли данные в форме профиля
  //Если пользователь (новый) добавил имя и почту
  //Для этого нужно добавить массив имен и emailov и рендомно выбирать их из массива
  //------------
  async updateUsersInfo(firstNameStr, emailStr) {

    const verifyResponseArrayRefresh = this.verifyResponseArray();
    const base = {}

    if (firstNameStr != '') {
      base.first_name = firstNameStr
    }

    if (emailStr != '') {
      base.email = emailStr
    }

    await this.request.put('https://api.mp-test.airba.dev/sso/api/v1/users/info', {
      headers: {Authorization: "Bearer " + verifyResponseArrayRefresh.access_token},
      data: JSON.stringify(base)
    });

  }

  async loginAuth(registeredPhone, correctSms) {
    //Находясь на главной, нажимает кнопку "Войти"
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText1 }).click();
    await this.page.getByTestId(this.elementInputText1).fill(registeredPhone);
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText2 }).click();

    //Вводит валидный смс-код
    await this.page.getByTestId(this.elementInputText2).fill(correctSms);

  }

  //Заходим в профиль, чтобы выйти из него
  async loginAuthProfile() {
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText5 }).click();
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText5 }).nth(1).click();
  }

  //Заходим в профиль, чтобы получить форму ввода email
  async loginAuthProfileNewUser() {

    await this.page.getByRole(this.elementLink, { name: this.elementButtonText3 }).click();

  }

  //Заполняем поля имя и email нового пользователя. Имя и email не сохраняются
  async newLoginAuthProfile(){
    
    await this.page.getByPlaceholder(this.elementInputText3).fill('MaxVVV');
    await this.page.getByPlaceholder(this.elementInputText4).fill('maxvvv@gmail.com');
    await this.page.waitForTimeout(1000);
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText6 }).click();
    await this.updateUsersInfo('MaxVVV', 'maxvvv@gmail.com');
  }

  //Заполняем толко имя нового пользователя
  async newLoginAuthProfileOnlyUserName(){
    await this.page.getByPlaceholder(this.elementInputText3).fill('Maxs');
    //Имя не сохраняется
    await this.page.waitForTimeout(1000);
    await this.page.getByRole(this.elementButton, { name: this.elementButtonText6 }).click();
    await this.updateUsersInfo('Maxs', '');
  }

  //Заполняем толко email нового пользователя
  async newLoginAuthProfileOnlyUserEmail(){
    await this.page.getByPlaceholder(this.elementInputText4).fill('max8888@gmail.com');
    //Email не сохраняется
    await this.page.waitForTimeout(1000);
    await this.updateUsersInfo('', 'max8888@gmail.com');

    if (this.page.getByRole(this.elementButton, { name: this.elementButtonText6 }).isDisabled === true) {
      await this.page.getByLabel(this.elementButtonText7).click();
    }

  }

}

//console.log('Выполнена авторизация');
// console.log('here', this)
//export async function loginAuth(page, registeredPhone, correctSms) {}
