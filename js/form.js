'use strict';

(function () {
  var MIN_PRICE_FOR_BUNGALO = 0;
  var MIN_PRICE_FOR_FLAT = 1000;
  var MIN_PRICE_FOR_HOUSE = 5000;
  var MIN_PRICE_FOR_PALACE = 10000;
  var ROOM_1 = '1';
  var ROOMS_2 = '2';
  var ROOMS_3 = '3';
  var ROOMS_100 = '100';

  var adForm = document.querySelector('.ad-form');
  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var checkinInput = adForm.querySelector('#timein');
  var checkoutInput = adForm.querySelector('#timeout');
  var roomInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var threeGuestsOption = capacityInput.options[0];
  var twoGuestsOption = capacityInput.options[1];
  var oneGuestOption = capacityInput.options[2];
  var noGuestsOption = capacityInput.options[3];
  var errorMessageOneRoom = 'Можем принять только одного гостя';
  var errorMessageTwoRooms = 'Можем принять одного или двух гостей';
  var errorMessageThreeRooms = 'Можем принять одного, два или три гостя';
  var errorMessageHundredRooms = 'Не можем принять гостей';

  function onSynchronizeCheckinAndCheckoutTimes() {
    checkoutInput.selectedIndex = checkinInput.selectedIndex = event.target.selectedIndex;
  }

  function setMinPrice(apartmentType) {
    switch (apartmentType) {
      case 'bungalo':
        priceInput.setAttribute('min', MIN_PRICE_FOR_BUNGALO);
        priceInput.setAttribute('placeholder', MIN_PRICE_FOR_BUNGALO);
        break;
      case 'flat':
        priceInput.setAttribute('min', MIN_PRICE_FOR_FLAT);
        priceInput.setAttribute('placeholder', MIN_PRICE_FOR_FLAT);
        break;
      case 'house':
        priceInput.setAttribute('min', MIN_PRICE_FOR_HOUSE);
        priceInput.setAttribute('placeholder', MIN_PRICE_FOR_HOUSE);
        break;
      case 'palace':
        priceInput.setAttribute('min', MIN_PRICE_FOR_PALACE);
        priceInput.setAttribute('placeholder', MIN_PRICE_FOR_PALACE);
        break;
    }
  }

  function setCapacity(roomsCount) {
    switch (roomsCount) {
      case ROOM_1:
        capacityInput.setCustomValidity(errorMessageOneRoom);
        break;
      case ROOMS_2:
        capacityInput.setCustomValidity(errorMessageTwoRooms);
        break;
      case ROOMS_3:
        capacityInput.setCustomValidity(errorMessageThreeRooms);
        break;
      case ROOMS_100:
        capacityInput.setCustomValidity(errorMessageHundredRooms);
        break;
    }

    threeGuestsOption.disabled = roomsCount !== ROOMS_3;
    twoGuestsOption.disabled = roomsCount === ROOM_1 || roomsCount === ROOMS_100;
    oneGuestOption.disabled = roomsCount === ROOMS_100;
    noGuestsOption.disabled = roomsCount !== ROOMS_100;
  }

  function disableFormFields(formName) {
    for (var i = 0; i < formName.children.length; i++) {
      formName.children[i].disabled = true;
    }
  }

  function showErrorWindow() {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindow = errorTemplate.cloneNode(true);
    window.map.map.insertBefore(errorWindow, window.main.mapPin);
  }

  function closeErrorWindow() {
    var errorWindow = window.map.map.querySelector('.error');
    window.map.map.removeChild(errorWindow);
    document.removeEventListener('click', onErrorWindowCloseButtonClick);
    document.removeEventListener('click', onErrorWindowClick);
    document.removeEventListener('keydown', onErrorWindowEcsPress);
  }

  function onErrorWindowCloseButtonClick() {
    closeErrorWindow();
    console.log('button click');
  }

  function onErrorWindowEcsPress(evt) {
    if (evt.keyCode === window.util.ESC) {
      closeErrorWindow();
      console.log('esc pressed');
    }
  }

  function onErrorWindowClick() {
    closeErrorWindow();
  }

  function onSuccessSave () {
    console.log('SuccessSave');
  }

  function onErrorSave () {
    showErrorWindow();
    console.log('ErrorSave111');
    var errorCloseButton = document.querySelector('.error__button');
    errorCloseButton.addEventListener('click', onErrorWindowCloseButtonClick);
    document.addEventListener('click', onErrorWindowClick);
    document.addEventListener('keydown', onErrorWindowEcsPress);
    console.log('ErrorSave');
  }

  window.form = {
    adForm: adForm,
    mapFiltersForm: document.querySelector('.map__filters'),
    addressInput: adForm.querySelector('#address'),

    updateAddress: function () {
      var address = window.map.getPinX() - window.map.mapX() + ', ' + window.map.getPinY();
      window.form.addressInput.value = address;
    },

    enableFormFields: function (formName) {
      for (var i = 0; i < formName.children.length; i++) {
        formName.children[i].disabled = false;
      }
    },

    setInputReadOnly: function (inputName) {
      inputName.readOnly = true;
    },
  };

  typeInput.addEventListener('change', function () {
    var apartmentType = typeInput.value;
    setMinPrice(apartmentType);
  });
  checkinInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);
  checkoutInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);
  roomInput.addEventListener('change', function () {
    var quantityRooms = roomInput.value;
    setCapacity(quantityRooms);
  });
  capacityInput.addEventListener('change', function () {
    capacityInput.setCustomValidity('');
  });
  disableFormFields(window.form.adForm);
  disableFormFields(window.form.mapFiltersForm);
  adForm.addEventListener('submit', function (evt) {
    var formData = new FormData(adForm);
    window.backend.save(formData, onSuccessSave, onErrorSave);
    evt.preventDefault();
  });
})();
