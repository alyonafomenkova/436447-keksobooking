'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var REQUEST_TIMEOUT = 10000;
  var REQUEST_STATUS_OK = 200;
  var REQUEST_STATUS_BAD_REQUEST = 400;
  var REQUEST_STATUS_UNAUTHORIZED = 401;
  var REQUEST_STATUS_NOT_FOUND = 404;
  var REQUEST_STATUS_INTERNAL_SERVER_ERROR = 500;

  window.backend = {
    performRequest: function (URL, method, data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = REQUEST_TIMEOUT;
      xhr.responseType = 'json';
      xhr.open(method, URL);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case REQUEST_STATUS_OK:
            onLoad(xhr.response);
            break;
          case REQUEST_STATUS_BAD_REQUEST:
            onError('Некорректный запрос. ' + 'Код ошибки: ' + xhr.status);
            break;
          case REQUEST_STATUS_NOT_FOUND:
            onError('Страница не найдена. ' + 'Код ошибки: ' + xhr.status);
            break;
          case REQUEST_STATUS_UNAUTHORIZED:
            onError('Пользователь неавторизован. ' + 'Код ошибки: ' + xhr.status);
            break;
          case REQUEST_STATUS_INTERNAL_SERVER_ERROR:
            onError('Внутренняя ошибка сервера. ' + 'Код ошибки: ' + xhr.status);
            break;
          default:
            onError('Произошла ошибка при загрузке персонажа. Повторите попытку позже. ' + 'код ошибки: ' + xhr.status);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Ошибка соединения с сервером');
      });

      xhr.addEventListener('timeout', function () {
        onError('Превышено время ожидания. Пожалуйста, попробуйте ещё раз позднее.');
      });

      xhr.send(data);
    },

    load: function (onLoad, onError) {
      window.backend.performRequest(URL_LOAD, 'GET', null, onLoad, onError);
    },

    save: function (data, onLoad, onError) {
      window.backend.performRequest(URL_SAVE, 'POST', data, onLoad, onError);
    }
  };
})();
