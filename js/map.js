'use strict';

(function () {
  window.map = {
    LOCATION_X_MIN: 0,
    LOCATION_X_MAX: 1200,
    LOCATION_Y_MIN: 130,
    LOCATION_Y_MAX: 630,
    map: document.querySelector('.map'),

    getPinX: function () {
      var rect = window.pin.mapPinMain.getBoundingClientRect();
      return Math.round(((rect.left + rect.right) / 2) + pageXOffset);
    },

    getPinY: function () {
      var rect = window.pin.mapPinMain.getBoundingClientRect();
      return window.main.isPageActive ?
        Math.round((((rect.top + rect.bottom) / 2) + window.pin.STEM_OF_PIN_HEIGHT) + pageYOffset) :
        Math.round(((rect.top + rect.bottom) / 2) + pageYOffset);
    },

    mapX: function () {
      var rect = window.map.map.getBoundingClientRect();
      return Math.round(rect.left + pageXOffset);
    }
  }
  window.form.updateAddress();
})();
