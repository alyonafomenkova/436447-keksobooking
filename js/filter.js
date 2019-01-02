'use strict';

(function () {
  var ANY_OPTION = 'any';
  var PriceLevels = {
    LOW: 10000,
    HIGH: 50000
  };
  var PriceTypes = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };
  var mapFiltersForm = document.querySelector('.map__filters');
  var housingType = mapFiltersForm.querySelector('#housing-type');
  var housingPrice = mapFiltersForm.querySelector('#housing-price');
  var housingRooms = mapFiltersForm.querySelector('#housing-rooms');
  var housingGuests = mapFiltersForm.querySelector('#housing-guests');
  var housingFeatures = mapFiltersForm.querySelector('#housing-features');
  var defaultHousingTypeIndex = housingType.selectedIndex;
  var defaultHousingPriceIndex = housingPrice.selectedIndex;
  var defaultHousingRoomsIndex = housingRooms.selectedIndex;
  var defaultHousingGuestsIndex = housingGuests.selectedIndex;

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
      if (selectorValue === PriceTypes.LOW) {
        return PriceLevels.LOW > apartment.offer.price;
      } else if (selectorValue === PriceTypes.MIDDLE) {
        return PriceLevels.LOW <= apartment.offer.price && PriceLevels.HIGH > apartment.offer.price;
      } else if (selectorValue === PriceTypes.HIGH) {
        return PriceLevels.HIGH <= apartment.offer.price;
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
      var containFeatures = true;

      checkedFeatures.every(function (selectedFeatures) {
        containFeatures = apartment.offer.features.indexOf(selectedFeatures) !== -1;
        return containFeatures;
      });

      return containFeatures;
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

  function resetCheckboxes() {
    var checkedFeatureInputs = housingFeatures.querySelectorAll('input[type=checkbox]:checked');
    checkedFeatureInputs.forEach(function (element) {
      element.checked = false;
    });
  }

  function setDefaultSelectsOnFilterForm () {
    housingType.selectedIndex = defaultHousingTypeIndex;
    housingPrice.selectedIndex = defaultHousingPriceIndex;
    housingRooms.selectedIndex = defaultHousingRoomsIndex;
    housingGuests.selectedIndex = defaultHousingGuestsIndex;
  }

  window.filter = {
    mapFiltersForm: mapFiltersForm,
    resetCheckboxes: resetCheckboxes,
    setDefaultSelectsOnFilterForm: setDefaultSelectsOnFilterForm
  };

  initializeFilterSelectors();
})();
