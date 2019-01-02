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
    if (evt.keyCode === window.data.ESC) {
      closeErrorWindow();
    }
  }

  function onErrorWindowClick() {
    closeErrorWindow();
  }

  function onSuccessLoad(response) {
    window.main.loadedData = response;
    window.pin.renderPinsForApartments(response);
    window.form.enableFormFields(window.filter.mapFiltersForm);
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

    clearPins: function () {
      for (var i = 0; i < window.pin.mapPinArray.length; i++) {
        window.pin.mapPinArray[i].remove();
      }
    },

    activateMapAndForms: function () {
      window.main.isPageActive = true;
      window.form.setInputReadOnly(window.form.addressInput);
      map.classList.remove('map--faded');
      window.data.adForm.classList.remove('ad-form--disabled');
      window.form.enableFormFields(window.data.adForm);
      window.backend.load(onSuccessLoad, window.main.onErrorLoading);
    },

    deactivateMapAndForms: function () {
      window.main.map.classList.add('map--faded');
      window.data.adForm.classList.add('ad-form--disabled');
      window.form.disableFormFields(window.data.adForm);
      window.form.disableFormFields(window.filter.mapFiltersForm);
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
