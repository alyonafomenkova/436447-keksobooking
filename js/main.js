'use strict';

(function () {
  var NUMBER_OF_APARTMENTS = 8;
  var OFFER_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var APARTMENT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var MIN_NUMBER_ROOMS = 1;
  var MAX_NUMBER_ROOMS = 5;
  var MIN_NUMBER_GUESTS = 1;
  var MAX_NUMBER_GUESTS = 20;
  var REGISTRATION_TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var DESCRIPTION = '';
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var mapPin = document.querySelector('.map__pins');

  function getAvatarUrlByIndex(index) {
    return 'img/avatars/user0' + index + '.png';
  }

  function generateApartments(count) {
    var apartmens = [];

    for (var i = 1; i <= count; i++) {
      var locationX = window.util.getRandomInteger(window.map.LOCATION_X_MIN, window.map.LOCATION_X_MAX);
      var locationY = window.util.getRandomInteger(window.map.LOCATION_Y_MIN, window.map.LOCATION_Y_MAX);

      apartmens.push({
        author: {
          avatar: getAvatarUrlByIndex(i)
        },
        offer: {
          title: window.util.getRandomString(OFFER_TITLES),
          address: window.util.concatenateStrings(locationX, locationY),
          price: window.util.getRandomInteger(MIN_PRICE, MAX_PRICE),
          type: window.util.getRandomString(APARTMENT_TYPE),
          rooms: window.util.getRandomInteger(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
          guests: window.util.getRandomInteger(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
          checkin: window.util.getRandomString(REGISTRATION_TIME),
          checkout: window.util.getRandomString(REGISTRATION_TIME),
          features: window.util.getRandomShuffledSubarray(FEATURES),
          description: DESCRIPTION,
          photos: window.util.shuffleArray(PHOTOS),
        },
        location: {
          x: locationX,
          y: locationY
        }
      });
    }
    return apartmens;
  }

  window.main = {
    isPageActive: false,

    activateMapAndForms: function () {
      var apartments = generateApartments(NUMBER_OF_APARTMENTS);

      window.main.isPageActive = true;
      window.form.setInputReadOnly(window.form.addressInput);
      window.map.map.classList.remove('map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.form.enableFormFields(window.form.adForm);
      window.form.enableFormFields(window.form.mapFiltersForm);
      mapPin.appendChild(window.pin.renderPinsForApartments(apartments));
    }
  };
})();
