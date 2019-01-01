'use strict';

(function () {
  var MinPriceApartment = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var NumberOfRooms = {
    ROOM_1: '1',
    ROOMS_2: '2',
    ROOMS_3: '3',
    ROOMS_100: '100'
  };

  var ApartmentTypes = {
    bungalo: 'bungalo',
    flat: 'flat',
    house: 'house',
    palace: 'palace'
  }

  var CAPACITY_0 = '0';
  var CAPACITY_1 = '1';
  var CAPACITY_2 = '2';
  var CAPACITY_3 = '3';

  var titleInput = window.data.adForm.querySelector('#title');
  var addressInput = window.data.adForm.querySelector('#address');
  var typeInput = window.data.adForm.querySelector('#type');
  var priceInput = window.data.adForm.querySelector('#price');
  var checkinInput = window.data.adForm.querySelector('#timein');
  var checkoutInput = window.data.adForm.querySelector('#timeout');
  var roomInput = window.data.adForm.querySelector('#room_number');
  var capacityInput = window.data.adForm.querySelector('#capacity');
  var features = window.data.adForm.querySelectorAll('.features input[type="checkbox"]');
  var descriptionInput = window.data.adForm.querySelector('#description');
  var clearButton = window.data.adForm.querySelector('.ad-form__reset');
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

    if (rooms === NumberOfRooms.ROOM_1) {
      message = capacity === CAPACITY_1 ? '' : errorMessageOneRoom;

    } else if (rooms === NumberOfRooms.ROOMS_2) {
      message = capacity === CAPACITY_1 || capacity === CAPACITY_2 ? '' : errorMessageTwoRooms;

    } else if (rooms === NumberOfRooms.ROOMS_3) {
      message = capacity === CAPACITY_1 || capacity === CAPACITY_2 || capacity === CAPACITY_3 ? '' : errorMessageThreeRooms;

    } else {
      message = capacity === CAPACITY_0 ? '' : errorMessageHundredRooms;
    }

    capacityInput.setCustomValidity(message);
    threeGuestsOption.disabled = rooms !== NumberOfRooms.ROOMS_3;
    twoGuestsOption.disabled = rooms === NumberOfRooms.ROOM_1 || rooms === NumberOfRooms.ROOMS_100;
    oneGuestOption.disabled = rooms === NumberOfRooms.ROOMS_100;
    noGuestsOption.disabled = rooms !== NumberOfRooms.ROOMS_100;
  }

  function setMinPrice(apartmentType) {
    switch (apartmentType) {
      case ApartmentTypes.bungalo:
        priceInput.setAttribute('min', MinPriceApartment.BUNGALO);
        priceInput.setAttribute('placeholder', MinPriceApartment.BUNGALO);
        break;
      case ApartmentTypes.flat:
        priceInput.setAttribute('min', MinPriceApartment.FLAT);
        priceInput.setAttribute('placeholder', MinPriceApartment.FLAT);
        break;
      case ApartmentTypes.house:
        priceInput.setAttribute('min', MinPriceApartment.HOUSE);
        priceInput.setAttribute('placeholder', MinPriceApartment.HOUSE);
        break;
      case ApartmentTypes.palace:
        priceInput.setAttribute('min', MinPriceApartment.PALACE);
        priceInput.setAttribute('placeholder', MinPriceApartment.PALACE);
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
    priceInput.value = MinPriceApartment.HOUSE;
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
    if (evt.keyCode === window.data.ESC) {
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
    window.upload.resetFileInput(window.upload.fileChooserAvatar);
    window.upload.resetFileInput(window.upload.fileChooserPhotos);
    setDefaultSelects();
    window.main.deactivateMapAndForms();
  }

  window.form = {
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

  window.form.disableFormFields(window.data.adForm);
  window.form.disableFormFields(window.form.mapFiltersForm);

  window.data.adForm.addEventListener('submit', function (evt) {
    var formData = new FormData(window.data.adForm);
    window.backend.save(formData, onSuccessSave, window.main.onErrorLoading);
    evt.preventDefault();
  });

  clearButton.addEventListener('click', onClearForm);
  clearButton.addEventListener('keydown', onClearForm);
  window.upload.uploadAvatar();
  window.upload.uploadPhotos();
})();
