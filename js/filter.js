'use strict';

(function () {
  var ANY_OPTION = 'any';
  var PriceLevel = {
    LOW: 10000,
    HIGH: 50000
  };
  var PriceType = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };
  var housingType = window.form.mapFiltersForm.querySelector('#housing-type');
  var housingPrice = window.form.mapFiltersForm.querySelector('#housing-price');
  var housingRooms = window.form.mapFiltersForm.querySelector('#housing-rooms');
  var housingGuests = window.form.mapFiltersForm.querySelector('#housing-guests');
  var housingFeatures = window.form.mapFiltersForm.querySelector('#housing-features');

  function getSelectedFeatures() {
    var checkedFeatureInputs = housingFeatures.querySelectorAll('input[type=checkbox]:checked');
    return Array.from(checkedFeatureInputs).map(function (input) {
      return input.value;
    });
  }

  function applyFilter(array) {
    return array
      .filter(createApartmentTypeFilter(housingType.value))
      .filter(createApartmentPriceFilter(housingPrice.value))
      .filter(createApartmentRoomsFilter(housingRooms.value))
      .filter(createApartmentGuestsFilter(housingGuests.value))
      .filter(createApartmentFeaturesFilter(getSelectedFeatures()));
  }

  function createApartmentTypeFilter(selectorValue) {
    return function (apartment) {
      return selectorValue === ANY_OPTION || selectorValue === apartment.offer.type;
    };
  }

  function createApartmentPriceFilter(selectorValue) {
    return function (apartment) {
      if (selectorValue === PriceType.LOW) {
        return PriceLevel.LOW > apartment.offer.price;
      } else if (selectorValue === PriceType.MIDDLE) {
        return PriceLevel.LOW <= apartment.offer.price && PriceLevel.HIGH > apartment.offer.price;
      } else if (selectorValue === PriceType.HIGH) {
        return PriceLevel.HIGH <= apartment.offer.price;
      }
      return true;
    };
  }

  function createApartmentRoomsFilter(selectorValue) {
    return function (apartment) {
      return selectorValue === ANY_OPTION || selectorValue === apartment.offer.rooms.toString();
    };
  }

  function createApartmentGuestsFilter(selectorValue) {
    return function (apartment) {
      return selectorValue === ANY_OPTION || selectorValue === apartment.offer.guests.toString();
    };
  }

  function createApartmentFeaturesFilter(checkedFeatures) {
    return function (apartment) {
      var isFeatureExists = true;

      checkedFeatures.every(function (selectedFeatures) {
        isFeatureExists = apartment.offer.features.indexOf(selectedFeatures) !== -1;
        return isFeatureExists;
      });

      return isFeatureExists;
    };
  }

  function updateFilteredPins(array) {
    window.main.clearPins();
    window.card.destroyCard();
    var filteredArray = applyFilter(array);
    window.pin.renderPinsForApartments(filteredArray);
  }

  var onFilterSelectorsChange = window.debounce(function () {
    updateFilteredPins(window.main.loadedData);
  });

  function initializeFilterSelectors() {
    housingType.addEventListener('change', onFilterSelectorsChange);
    housingPrice.addEventListener('change', onFilterSelectorsChange);
    housingRooms.addEventListener('change', onFilterSelectorsChange);
    housingGuests.addEventListener('change', onFilterSelectorsChange);
    housingFeatures.addEventListener('change', onFilterSelectorsChange);
  }

  initializeFilterSelectors();
})();
