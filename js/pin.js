'use strict';

(function () {

  var PROPERTY_AUTHOR = 'author';
  var PROPERTY_AVATAR = 'avatar';
  var AVATAR_DEFAULT = 'img/avatars/placeholder.png';
  var PROPERTY_OFFER = 'offer';
  var PROPERTY_LOCATION = 'location';
  var PROPERTY_LOCATION_X = 'x';
  var PROPERTY_LOCATION_Y = 'y';

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var startCoords = {
    x: 0,
    y: 0
  };
  var mapPinArray = [];
  var previousSelectedPin;

  function createPin(apartment) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (apartment.location.x - Math.round(window.pin.STEM_OF_PIN_WIDTH / 2)) + 'px; top: ' + (apartment.location.y - window.pin.STEM_OF_PIN_HEIGHT) + 'px;';
    pinElement.querySelector('img').src = apartment.author.avatar;
    pinElement.querySelector('img').alt = apartment.offer.description;
    return pinElement;
  }

  function setPinActive(pinElement) {
    pinElement.classList.add('map__pin--active');
  }

  function onPinClickListener(apartment, pinElement) {
    window.card.showCard(apartment);
    setPinActive(pinElement);

    if (previousSelectedPin !== pinElement) {
      window.pin.disablePreviousPin();
    }

    previousSelectedPin = pinElement;
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

    var top = window.main.mainPin.offsetTop - shift.y;
    var left = window.main.mainPin.offsetLeft - shift.x;

    if (left < (window.map.LOCATION_X_MIN - window.main.mainPin.offsetWidth / 2)) {
      left = window.map.LOCATION_X_MIN - window.main.mainPin.offsetWidth / 2;
    }

    if (left > (window.map.LOCATION_X_MAX - window.main.mainPin.offsetWidth / 2)) {
      left = window.map.LOCATION_X_MAX - window.main.mainPin.offsetWidth / 2;
    }

    if (top < window.map.LOCATION_Y_MIN - window.main.mainPin.offsetHeight) {
      top = window.map.LOCATION_Y_MIN - window.main.mainPin.offsetHeight;
    }

    if (top > window.map.LOCATION_Y_MAX - window.main.mainPin.offsetHeight) {
      top = window.map.LOCATION_Y_MAX - window.main.mainPin.offsetHeight;
    }
    window.main.mainPin.style.top = top + 'px';
    window.main.mainPin.style.left = left + 'px';
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    if (!window.main.isPageActive) {
      window.main.activateMapAndForms();
    }

    window.main.updateAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  window.pin = {
    STEM_OF_PIN_WIDTH: 10,
    STEM_OF_PIN_HEIGHT: 32,
    mapPinArray: mapPinArray,

    renderPinsForApartments: function (apartments) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < apartments.length; i++) {
        var apartment = apartments[i];
        // проверки, все ли данные от сервера получены
        var hasPropertyAuthor = window.main.hasProperty(PROPERTY_AUTHOR, apartment);
        var hasPropertyAvatar = window.main.hasProperty(PROPERTY_AVATAR, apartment.author);
        var hasPropertyOffer = window.main.hasProperty(PROPERTY_OFFER, apartment);
        var hasPropertyLocation = window.main.hasProperty(PROPERTY_LOCATION, apartment);
        var hasPropertyLocationX = window.main.hasProperty(PROPERTY_LOCATION_X, apartment.location);
        var hasPropertyLocationY = window.main.hasProperty(PROPERTY_LOCATION_Y, apartment.location);

        if (!hasPropertyAuthor || !hasPropertyAvatar) {
          apartment.author = {
            avatar: AVATAR_DEFAULT
          };
        }

        if (hasPropertyOffer && hasPropertyLocation && hasPropertyLocationX && hasPropertyLocationY) {
          var pinElement = createPin(apartment);
          pinElement.addEventListener('click', onPinClickListener.bind(null, apartment, pinElement));
          fragment.appendChild(pinElement);
          mapPinArray.push(pinElement);
        }
      }
      return fragment;
    },

    disablePreviousPin: function () {
      if (previousSelectedPin) {
        previousSelectedPin.classList.remove('map__pin--active');
      }
    }
  };

  window.main.mainPin.addEventListener('mousedown', onMouseDown);
})();
