'use strict';

(function () {
  var ANY_OPTION = 'any';
  var housingType = window.form.mapFiltersForm.querySelector('#housing-type');
  var housingPrice = window.form.mapFiltersForm.querySelector('#housing-price');
  var housingRooms = window.form.mapFiltersForm.querySelector('#housing-rooms');
  var housingGuests = window.form.mapFiltersForm.querySelector('#housing-guests');
  var housingFeatures = window.form.mapFiltersForm.querySelector('#housing-features');

  function applyFilter() {
    //console.log('Здесь будет функция фильтрации....');
    //console.log('housingType.value', housingType.value);

    /* for (var i = 0; i < window.main.loadedData.length; i++) {
      var title = window.main.loadedData[i].offer.title;
      var type = window.main.loadedData[i].offer.type;
      var rooms = window.main.loadedData[i].offer.rooms;
      // if (housingType.value === ANY_OPTION) {
      //   console.log('ALL. title is: ', title, 'type is: ', type);
      // } else if (type === housingType.value) {
      //   console.log('title is: ', title, 'type is: ', type);
      // }

      console.log('fffff    ', housingRooms.value);
      if (housingRooms.value === ANY_OPTION) {
        console.log('ALL. title is: ', title, 'rooms is: ', rooms);
      } else if (rooms === housingRooms.value) {
        console.log('title is: ', title, 'rooms is: ', rooms);
      }
    } */

    console.clear(); //

    var arr = window.main.loadedData;

    var filteredArr = arr
      .filter(letterCheFilter)
      .filter(letterVeFilter);

    filteredArr.forEach(function(apartment) {
      console.log("[forEach] ", apartment.offer.title, apartment.offer.type);
    });

    // var filteredArr = arr
    //   .filter(apartmentTypeFilter)
    //   .filter(priceFilter)
    //   .filter(guestsFilter)
    //   .filter(featuresFilter);
  }

  function letterCheFilter(apartment) {
    console.log("[filter] ", apartment.offer.title);
    return apartment.offer.title.includes("Ч") || apartment.offer.title.includes("ч");
  };

  function letterVeFilter(apartment) {
    console.log("[filter 2] ", apartment.offer.title);
    return apartment.offer.title.includes("в");
  };

  // var apartmentTypeFilter = function(apartment) {
  //   ...
  // }

  function onFilterSelectorsChange() {
    //window.main.clearPins();
    applyFilter();
  }

  function initializeFilterSelectors() {
    housingType.addEventListener('change', onFilterSelectorsChange);
    housingPrice.addEventListener('change', onFilterSelectorsChange);
    housingRooms.addEventListener('change', onFilterSelectorsChange);
    housingGuests.addEventListener('change', onFilterSelectorsChange);
    housingFeatures.addEventListener('change', onFilterSelectorsChange);
  }

  initializeFilterSelectors();
})();
