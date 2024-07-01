'use strict';

        class LogoutButton {
            constructor(buttonElement) {
                this.buttonElement = buttonElement;
                this.action = null;
                this.buttonElement.addEventListener('click', () => this.action());
            }
        }

        class ProfileWidget {
            static showProfile(data) {
                document.getElementById('profileInfo').innerText = `User: ${data.login}, Balance: ${data.balance}`;
            }
        }

        class RatesBoard {
            constructor(tableElement) {
                this.tableElement = tableElement;
            }

            clearTable() {
                this.tableElement.querySelector('tbody').innerHTML = '';
            }

            fillTable(rates) {
                const tbody = this.tableElement.querySelector('tbody');
                rates.forEach(rate => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${rate.currency}</td><td>${rate.rate}</td>`;
                    tbody.appendChild(row);
                });
            }
        }

        class MoneyManager {
            constructor(addForm, convertForm, sendForm) {
                this.addForm = addForm;
                this.convertForm = convertForm;
                this.sendForm = sendForm;
                this.addMoneyCallback = null;
                this.conversionMoneyCallback = null;
                this.sendMoneyCallback = null;
                
                this.addForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = {
                        amount: this.addForm.querySelector('#addAmount').value
                    };
                    this.addMoneyCallback(data);
                });
                
                this.convertForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = {
                        fromAmount: this.convertForm.querySelector('#convertFromAmount').value,
                        fromCurrency: this.convertForm.querySelector('#convertFromCurrency').value,
                        toCurrency: this.convertForm.querySelector('#convertToCurrency').value
                    };
                    this.conversionMoneyCallback(data);
                });
                
                this.sendForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = {
                        amount: this.sendForm.querySelector('#sendAmount').value,
                        to: this.sendForm.querySelector('#sendToUser').value
                    };
                    this.sendMoneyCallback(data);
                });
            }

            setAddMoneyCallback(callback) {
                this.addMoneyCallback = callback;
            }

            setConversionMoneyCallback(callback) {
                this.conversionMoneyCallback = callback;
            }

            setSendMoneyCallback(callback) {
                this.sendMoneyCallback = callback;
            }
        }

        class FavoritesWidget {
            constructor(form, listElement) {
                this.form = form;
                this.listElement = listElement;
                this.addUserCallback = null;
                this.removeUserCallback = null;
                
                this.form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const data = {
                        id: this.form.querySelector('#favoriteUserId').value
                    };
                    this.addUserCallback(data);
                });
            }

            clearTable() {
                this.listElement.innerHTML = '';
            }

            fillTable(favorites) {
                favorites.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `${user.name} (${user.id}) <button data-id="${user.id}">Remove</button>`;
                    li.querySelector('button').addEventListener('click', () => {
                        this.removeUserCallback({ id: user.id });
                    });
                    this.listElement.appendChild(li);
                });
            }

            updateUsersList(favorites) {
                const sendToUserSelect = document.getElementById('sendToUser');
                sendToUserSelect.innerHTML = '';
                favorites.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.innerText = user.name;
                    sendToUserSelect.appendChild(option);
                });
            }

            setAddUserCallback(callback) {
                this.addUserCallback = callback;
            }

            setRemoveUserCallback(callback) {
                this.removeUserCallback = callback;
            }
        }

        class ApiConnector {
            static logout(callback) {
                setTimeout(() => callback({ success: true }), 1000);
            }

            static current(callback) {
                setTimeout(() => callback({ success: true, data: { login: 'oleg@demo.ru', balance: 1000 } }), 1000);
            }

            static getRates(callback) {
                setTimeout(() => callback({ success: true, data: [{ currency: 'USD', rate: 1.1 }, { currency: 'EUR', rate: 0.9 }] }), 1000);
            }

            static addMoney(data, callback) {
                setTimeout(() => callback({ success: true, data: { login: 'oleg@demo.ru', balance: 1000 + parseFloat(data.amount) } }), 1000);
            }

            static convertMoney(data, callback) {
                setTimeout(() => callback({ success: true, data: { login: 'oleg@demo.ru', balance: 1000 } }), 1000);
            }

            static transferMoney(data, callback) {
                setTimeout(() => callback({ success: true, data: { login: 'oleg@demo.ru', balance: 1000 - parseFloat(data.amount) } }), 1000);
            }

            static getFavorites(callback) {
                setTimeout(() => callback({ success: true, data: [{ id: 1, name: 'Ivan' }, { id: 2, name: 'Petr' }] }), 1000);
            }

            static addUserToFavorites(data, callback) {
                setTimeout(() => callback({ success: true, data: [{ id: 1, name: 'Ivan' }, { id: 2, name: 'Petr' }, { id: data.id, name: 'New User' }] }), 1000);
            }

            static removeUserFromFavorites(data, callback) {
                setTimeout(() => callback({ success: true, data: [{ id: 1, name: 'Ivan' }] }), 1000);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Выход из аккаунта
            const logoutButton = new LogoutButton(document.getElementById('logoutButton'));
            logoutButton.action = () => {
                ApiConnector.logout(response => {
                    if (response.success) {
                        location.reload();
                    }
                });
            };

            // Получение информации о пользователе
            ApiConnector.current(response => {
                if (response.success) {
                    ProfileWidget.showProfile(response.data);
                }
            });

            // Получение курсов валют
            const ratesBoard = new RatesBoard(document.getElementById('ratesTable'));
            const getRates = () => {
                ApiConnector.getRates(response => {
                    if (response.success) {
                        ratesBoard.clearTable();
                        ratesBoard.fillTable(response.data);
                    }
                });
            };
            getRates();
            setInterval(getRates, 60000);

            // Операции с деньгами
            const moneyManager = new MoneyManager(
                document.getElementById('addMoneyForm'),
                document.getElementById('convertMoneyForm'),
                document.getElementById('sendMoneyForm')
            );

            moneyManager.setAddMoneyCallback(data => {
                ApiConnector.addMoney(data, response => {
                    if (response.success) {
                        ProfileWidget.showProfile(response.data);
                        document.getElementById('addMoneyMessage').innerText = "Balance successfully added.";
                    } else {
                        document.getElementById('addMoneyMessage').innerText = response.error;
                    }
                });
            });

            moneyManager.setConversionMoneyCallback(data => {
                ApiConnector.convertMoney(data, response => {
                    if (response.success) {
                        ProfileWidget.showProfile(response.data);
                        document.getElementById('convertMoneyMessage').innerText = "Conversion successful.";
                    } else {
                        document.getElementById('convertMoneyMessage').innerText = response.error;
                    }
                });
            });

            moneyManager.setSendMoneyCallback(data => {
                ApiConnector.transferMoney(data, response => {
                    if (response.success) {
                        ProfileWidget.showProfile(response.data);
                        document.getElementById('sendMoneyMessage').innerText = "Transfer successful.";
                    } else {
                        document.getElementById('sendMoneyMessage').innerText = response.error;
                    }
                });
            });

            // Работа с избранным
            const favoritesWidget = new FavoritesWidget(
                document.getElementById('addFavoriteForm'),
                document.getElementById('favoritesList')
            );

            const updateFavorites = () => {
                ApiConnector.getFavorites(response => {
                    if (response.success) {
                        favoritesWidget.clearTable();
                        favoritesWidget.fillTable(response.data);
                        favoritesWidget.updateUsersList(response.data);
                    }
                });
            };
            updateFavorites();

            favoritesWidget.setAddUserCallback(data => {
                ApiConnector.addUserToFavorites(data, response => {
                    if (response.success) {
                        updateFavorites();
                        document.getElementById('addFavoriteMessage').innerText = "User successfully added to favorites.";
                    } else {
                        document.getElementById('addFavoriteMessage').innerText = response.error;
                    }
                });
            });

            favoritesWidget.setRemoveUserCallback(data => {
                ApiConnector.removeUserFromFavorites(data, response => {
                    if (response.success) {
                        updateFavorites();
                        document.getElementById('addFavoriteMessage').innerText = "User successfully removed from favorites.";
                    } else {
                        document.getElementById('addFavoriteMessage').innerText = response.error;
                    }
                });
            });
        });
