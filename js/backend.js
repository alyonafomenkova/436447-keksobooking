'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var RequestStatus = {
    TIMEOUT: 10000,
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  };

  window.backend = {
    performRequest: function (URL, method, data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = RequestStatus.TIMEOUT;
      xhr.responseType = 'json';
      xhr.open(method, URL);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case RequestStatus.OK:
            onLoad(xhr.response);
            break;
          case RequestStatus.BAD_REQUEST:
            onError('Некорректный запрос. ' + 'Код ошибки: ' + xhr.status);
            break;
          case RequestStatus.NOT_FOUND:
            onError('Страница не найдена. ' + 'Код ошибки: ' + xhr.status);
            break;
          case RequestStatus.UNAUTHORIZED:
            onError('Пользователь неавторизован. ' + 'Код ошибки: ' + xhr.status);
            break;
          case RequestStatus.INTERNAL_SERVER_ERROR:
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
