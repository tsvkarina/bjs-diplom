'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const userForm = new UserForm();

    // Обработка формы авторизации
    userForm.loginFormCallback = (data) => {
        ApiConnector.login(data, (response) => {
            console.log(response);
            if (response.success) {
                location.reload();
            } else {
               userForm.setLoginErrorMessage(response.error);
            }
        });
    };

    // Обработка формы регистрации
    userForm.registerFormCallback = (data) => {
        ApiConnector.register(data, (response) => {
            console.log(response);
            if (response.success) {
                location.reload();
            } else {
                userForm.setRegisterErrorMessage(response.error)
            }
        });
    };
});
