'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Выход из аккаунта
    const logoutButton = new LogoutButton();
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
    const ratesBoard = new RatesBoard();
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
    const moneyManager = new MoneyManager();

    moneyManager.addMoneyCallback = (data) => {
        ApiConnector.addMoney(data, response => {
            if (response.success) {
                ProfileWidget.showProfile(response.data);
                moneyManager.setMessage(true, "Баланс успешно пополнен.");
            } else {
                moneyManager.setMessage(false, response.error);
            }
        });
    };

    moneyManager.conversionMoneyCallback = (data) => {
        ApiConnector.convertMoney(data, response => {
            if (response.success) {
                ProfileWidget.showProfile(response.data);
                moneyManager.setMessage(true, "Конвертация прошла успешно.");
            } else {
                moneyManager.setMessage(false, response.error);
            }
        });
    };

    moneyManager.sendMoneyCallback = (data) => {
        ApiConnector.transferMoney(data, response => {
            if (response.success) {
                ProfileWidget.showProfile(response.data);
                moneyManager.setMessage(true, "Перевод средств успешно выполнен.");
            } else {
                moneyManager.setMessage(false, response.error);
            }
        });
    };

    // Работа с избранным
    const favoritesWidget = new FavoritesWidget();

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

    favoritesWidget.addUserCallback = (data) => {
        ApiConnector.addUserToFavorites(data, response => {
            if (response.success) {
                updateFavorites();
                favoritesWidget.setMessage(true, "Пользователь успешно добавлен в избранное.");
            } else {
                favoritesWidget.setMessage(false, response.error);
            }
        });
    };

    favoritesWidget.removeUserCallback = (data) => {
        ApiConnector.removeUserFromFavorites(data, response => {
            if (response.success) {
                updateFavorites();
                favoritesWidget.setMessage(true, "Пользователь успешно удален из избранного.");
            } else {
                favoritesWidget.setMessage(false, response.error);
            }
        });
    };
});
