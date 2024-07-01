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
                document.querySelector('#login .ui.message.negative').textContent = response.error;
                document.querySelector('#login .ui.message.negative').style.display = 'block';
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
                document.querySelector('#register .ui.message.negative').textContent = response.error;
                document.querySelector('#register .ui.message.negative').style.display = 'block';
            }
        });
    };
});
