'use strict';

(function () {
  var KEY_CODES = {
    ESC: 27,
  };
  var adForm = document.querySelector('.ad-form');

  window.data = {
    ESC: KEY_CODES.ESC,
    adForm: adForm
  };
})();
