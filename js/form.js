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
  var CAPACITY_0 = '0';
  var CAPACITY_1 = '1';
  var CAPACITY_2 = '2';
  var CAPACITY_3 = '3';

  var adForm = document.querySelector('.ad-form');
  var titleInput = adForm.querySelector('#title');
  var addressInput = adForm.querySelector('#address');
  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var checkinInput = adForm.querySelector('#timein');
  var checkoutInput = adForm.querySelector('#timeout');
  var roomInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var features = adForm.querySelectorAll('.features input[type="checkbox"]');
  var descriptionInput = adForm.querySelector('#description');
  var clearButton = adForm.querySelector('.ad-form__reset');
  var errorMessageOneRoom = 'Можем принять только одного гостя';
  var errorMessageTwoRooms = 'Можем принять одного или двух гостей';
  var errorMessageThreeRooms = 'Можем принять одного, два или три гостя';
  var errorMessageHundredRooms = 'Не можем принять гостей';
  var threeGuestsOption = capacityInput.options[0];
  var twoGuestsOption = capacityInput.options[1];
  var oneGuestOption = capacityInput.options[2];
  var noGuestsOption = capacityInput.options[3];
  var defaultRoomInputIndex = roomInput.selectedIndex;
  var defaultTypeInputIndex = typeInput.selectedIndex;
  var defaultCheckinInputIndex = checkinInput.selectedIndex;
  var defaultCheckoutInputIndex = checkoutInput.selectedIndex;
  var defaultCapacityInputIndex = capacityInput.selectedIndex;

  function onSynchronizeCheckinAndCheckoutTimes(evt) {
    checkoutInput.selectedIndex = checkinInput.selectedIndex = evt.target.selectedIndex;
  }

  function validateCapacity() {
    var rooms = roomInput.value;
    var capacity = capacityInput.value;
    var message;

    if (rooms === ROOM_1) {
      message = capacity === CAPACITY_1 ? '' : errorMessageOneRoom;

    } else if (rooms === ROOMS_2) {
      message = capacity === CAPACITY_1 || capacity === CAPACITY_2 ? '' : errorMessageTwoRooms;

    } else if (rooms === ROOMS_3) {
      message = capacity === CAPACITY_1 || capacity === CAPACITY_2 || capacity === CAPACITY_3 ? '' : errorMessageThreeRooms;

    } else {
      message = capacity === CAPACITY_0 ? '' : errorMessageHundredRooms;
    }

    capacityInput.setCustomValidity(message);
    threeGuestsOption.disabled = rooms !== ROOMS_3;
    twoGuestsOption.disabled = rooms === ROOM_1 || rooms === ROOMS_100;
    oneGuestOption.disabled = rooms === ROOMS_100;
    noGuestsOption.disabled = rooms !== ROOMS_100;
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

  function resetFeatures() {
    for (var i = 0; i < features.length; i++) {
      features[i].checked = false;
    }
  }

  function resetInput() {
    titleInput.value = '';
    addressInput.value = '';
    descriptionInput.value = '';
    priceInput.value = MIN_PRICE_FOR_HOUSE;
    resetFeatures();
    window.upload.resetPhotos();
    window.upload.setDefaultAvatar();
  }

  function setDefaultSelects() {
    roomInput.selectedIndex = defaultRoomInputIndex;
    typeInput.selectedIndex = defaultTypeInputIndex;
    checkinInput.selectedIndex = defaultCheckinInputIndex;
    checkoutInput.selectedIndex = defaultCheckoutInputIndex;
    capacityInput.selectedIndex = defaultCapacityInputIndex;
  }

  function showSuccessWindow() {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successWindow = successTemplate.cloneNode(true);
    window.main.map.insertBefore(successWindow, window.main.mapPin);
  }

  function closeSuccessWindow() {
    var successWindow = window.main.map.querySelector('.success');
    window.main.map.removeChild(successWindow);
    document.removeEventListener('click', onSuccessWindowClick);
    document.removeEventListener('keydown', onSuccessWindowEcsPress);
    window.main.deactivateMapAndForms();
  }

  function onSuccessWindowClick() {
    closeSuccessWindow();
  }

  function onSuccessWindowEcsPress(evt) {
    if (evt.keyCode === window.util.ESC) {
      closeSuccessWindow();
    }
  }

  function onSuccessSave() {
    resetInput();
    setDefaultSelects();
    showSuccessWindow();
    document.addEventListener('click', onSuccessWindowClick);
    document.addEventListener('keydown', onSuccessWindowEcsPress);
  }

  function onClearForm() {
    resetInput();
    setDefaultSelects();
    window.main.deactivateMapAndForms();
  }

  window.form = {
    adForm: adForm,
    mapFiltersForm: document.querySelector('.map__filters'),
    addressInput: addressInput,

    enableFormFields: function (formName) {
      for (var i = 0; i < formName.children.length; i++) {
        formName.children[i].disabled = false;
      }
    },

    setInputReadOnly: function (inputName) {
      inputName.readOnly = true;
    },

    disableFormFields: function (formName) {
      for (var i = 0; i < formName.children.length; i++) {
        formName.children[i].disabled = true;
      }
    }
  };

  typeInput.addEventListener('change', function () {
    var apartmentType = typeInput.value;
    setMinPrice(apartmentType);
  });

  checkinInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);
  checkoutInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);
  roomInput.addEventListener('change', function () {
    validateCapacity();
  });

  capacityInput.addEventListener('change', function () {
    validateCapacity();
  });

  window.form.disableFormFields(window.form.adForm);
  window.form.disableFormFields(window.form.mapFiltersForm);

  adForm.addEventListener('submit', function (evt) {
    var formData = new FormData(adForm);
    window.backend.save(formData, onSuccessSave, window.main.onErrorLoading);
    evt.preventDefault();
  });

  clearButton.addEventListener('click', onClearForm);
  clearButton.addEventListener('keydown', onClearForm);
  window.upload.uploadAvatar();
  window.upload.uploadPhotos();
})();
