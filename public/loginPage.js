'use strict';

        class UserForm {
            constructor() {
                this.loginFormCallback = null;
                this.registerFormCallback = null;
            }

            setLoginFormCallback(callback) {
                this.loginFormCallback = callback;
            }

            setRegisterFormCallback(callback) {
                this.registerFormCallback = callback;
            }
        }

        class ApiConnector {
            static login(data, callback) {
                setTimeout(() => {
                    if (data.login === 'oleg@demo.ru' && data.password === 'demo') {
                        callback({ success: true });
                    } else {
                        callback({ success: false, error: 'Invalid login or password' });
                    }
                }, 1000);
            }

            static register(data, callback) {
                setTimeout(() => {
                    if (data.login === 'newuser@demo.ru' && data.password === 'demo') {
                        callback({ success: true });
                    } else {
                        callback({ success: false, error: 'Registration failed' });
                    }
                }, 1000);
            }
        }

        const userForm = new UserForm();

        userForm.setLoginFormCallback = (data) => {
            ApiConnector.login(data, (response) => {
                if (response.success) {
                    location.reload();
                } else {
                    document.getElementById('loginError').innerText = response.error;
                }
            });
        };

        userForm.setRegisterFormCallback = (data) => {
            ApiConnector.register(data, (response) => {
                if (response.success) {
                    location.reload();
                } else {
                    document.getElementById('registerError').innerText = response.error;
                }
            });
        };

        document.getElementById('loginForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                login: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };
            userForm.loginFormCallback(data);
        });

        document.getElementById('registerForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                login: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value
            };
            userForm.registerFormCallback(data);
        });
