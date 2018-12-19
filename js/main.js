'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPin = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var loadedData = [];
  var startCoordsOfMainPin = {
    left: window.getComputedStyle(mainPin, null).getPropertyValue('left'),
    top: window.getComputedStyle(mainPin, null).getPropertyValue('top')
  };

  function setStartPositionOfMainPin() {
    mainPin.style.left = startCoordsOfMainPin.left;
    mainPin.style.top = startCoordsOfMainPin.top;
  }

  function showErrorWindow(errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindow = errorTemplate.cloneNode(true);
    errorWindow.querySelector('.error__message').textContent = errorMessage;
    window.main.map.insertBefore(errorWindow, window.main.mapPin);
  }

  function closeErrorWindow() {
    var errorWindow = window.main.map.querySelector('.error');
    window.main.map.removeChild(errorWindow);
    document.removeEventListener('click', onErrorWindowCloseButtonClick);
    document.removeEventListener('click', onErrorWindowClick);
    document.removeEventListener('keydown', onErrorWindowEcsPress);
  }

  function onErrorWindowCloseButtonClick() {
    closeErrorWindow();
  }

  function onErrorWindowEcsPress(evt) {
    if (evt.keyCode === window.util.ESC) {
      closeErrorWindow();
    }
  }

  function onErrorWindowClick() {
    closeErrorWindow();
  }

  function onSuccessLoad(response) {
    // delete response[1].offer; // For testing purposes only
    // response[1].offer.features = []; // For testing purposes only
    // delete response[1].location; // For testing purposes only
    // delete response[1].author; // For testing purposes only
    // delete response[1].author.avatar; // For testing purposes only
    // delete response[1].location.y; // For testing purposes only

    window.main.loadedData = response;
    mapPin.appendChild(window.pin.renderPinsForApartments(response));
    window.form.enableFormFields(window.form.mapFiltersForm);
  }

  window.main = {
    map: map,
    mapPin: mapPin,
    mainPin: mainPin,
    isPageActive: false,
    loadedData: loadedData,

    hasProperty: function (propertyName, objectName) {
      return propertyName in objectName;
    },

    isDescriptionNotEmpty: function (description) {
      return description.length !== 0;
    },

    updateAddress: function () {
      var address = window.map.getPinX() - window.map.mapX() + ', ' + window.map.getPinY();
      window.form.addressInput.value = address;
    },

    clearPins: function  () {
      for (var i = 0; i < window.pin.mapPinArray.length; i++) {
        window.pin.mapPinArray[i].remove();
      }
    },

    activateMapAndForms: function () {
      window.main.isPageActive = true;
      window.form.setInputReadOnly(window.form.addressInput);
      map.classList.remove('map--faded');
      window.form.adForm.classList.remove('ad-form--disabled');
      window.form.enableFormFields(window.form.adForm);
      window.backend.load(onSuccessLoad, window.main.onErrorLoading);
    },

    deactivateMapAndForms: function () {
      window.main.map.classList.add('map--faded');
      window.form.adForm.classList.add('ad-form--disabled');
      window.form.disableFormFields(window.form.adForm);
      window.form.disableFormFields(window.form.mapFiltersForm);
      window.card.destroyCard();
      window.main.isPageActive = false;
      window.main.clearPins();
      setStartPositionOfMainPin();
      window.main.updateAddress();
    },

    onErrorLoading: function (response) {
      showErrorWindow(response);
      var errorCloseButton = document.querySelector('.error__button');
      errorCloseButton.addEventListener('click', onErrorWindowCloseButtonClick);
      document.addEventListener('click', onErrorWindowClick);
      document.addEventListener('keydown', onErrorWindowEcsPress);
    }
  };
})();
