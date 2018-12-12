'use strict';

(function () {

  var PROPERTY_AUTHOR = 'author';
  var PROPERTY_AVATAR = 'avatar';
  var AVATAR_DEFAULT = 'img/avatars/placeholder.png';
  var PROPERTY_OFFER = 'offer';
  var PROPERTY_LOCATION = 'location';

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var startCoords = {
    x: 0,
    y: 0
  };

  function createPin(apartment) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (apartment.location.x - Math.round(window.pin.STEM_OF_PIN_WIDTH / 2)) + 'px; top: ' + (apartment.location.y - window.pin.STEM_OF_PIN_HEIGHT) + 'px;';
    pinElement.querySelector('img').src = apartment.author.avatar;
    pinElement.querySelector('img').alt = apartment.offer.description;
    return pinElement;
  }

  function onPinClickListener(apartment) {
    window.card.showCard(apartment);
  }

  function onMouseDown(downEvt) {
    downEvt.preventDefault();
    startCoords.x = downEvt.clientX;
    startCoords.y = downEvt.clientY;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var top = window.pin.mapPinMain.offsetTop - shift.y;
    var left = window.pin.mapPinMain.offsetLeft - shift.x;

    if (left < (window.map.LOCATION_X_MIN - window.pin.mapPinMain.offsetWidth / 2)) {
      left = window.map.LOCATION_X_MIN - window.pin.mapPinMain.offsetWidth / 2;
    }

    if (left > (window.map.LOCATION_X_MAX - window.pin.mapPinMain.offsetWidth / 2)) {
      left = window.map.LOCATION_X_MAX - window.pin.mapPinMain.offsetWidth / 2;
    }

    if (top < window.map.LOCATION_Y_MIN - window.pin.mapPinMain.offsetHeight) {
      top = window.map.LOCATION_Y_MIN - window.pin.mapPinMain.offsetHeight;
    }

    if (top > window.map.LOCATION_Y_MAX - window.pin.mapPinMain.offsetHeight) {
      top = window.map.LOCATION_Y_MAX - window.pin.mapPinMain.offsetHeight;
    }
    window.pin.mapPinMain.style.top = top + 'px';
    window.pin.mapPinMain.style.left = left + 'px';
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    if (!window.main.isPageActive) {
      window.main.activateMapAndForms();
    }

    window.form.updateAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  window.pin = {
    STEM_OF_PIN_WIDTH: 10,
    STEM_OF_PIN_HEIGHT: 32,
    mapPinMain: document.querySelector('.map__pin--main'),

    renderPinsForApartments: function (apartments) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < apartments.length; i++) {
        var apartment = apartments[i];
        // проверки, все ли данные от сервера получены
        var hasPropertyAuthor = window.main.hasProperty(PROPERTY_AUTHOR, apartment);
        var hasPropertyAvatar = window.main.hasProperty(PROPERTY_AVATAR, apartment.author);
        var hasPropertyOffer = window.main.hasProperty(PROPERTY_OFFER, apartment);
        var hasPropertyLocation = window.main.hasProperty(PROPERTY_LOCATION, apartment);

        if (!hasPropertyAuthor || !hasPropertyAvatar) {
          apartment.author = {
            avatar: AVATAR_DEFAULT
          }
        }

        if (hasPropertyOffer && hasPropertyLocation) {
          var pinElement = createPin(apartment);
          pinElement.addEventListener('click', onPinClickListener.bind(null, apartment));
          fragment.appendChild(pinElement);
        }
      }
      return fragment;
    }
  };

  window.pin.mapPinMain.addEventListener('mousedown', onMouseDown);
})();
