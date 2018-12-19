'use strict';

(function () {
  var housingType = window.form.mapFiltersForm.querySelector('#housing-type');
  var housingPrice = window.form.mapFiltersForm.querySelector('#housing-price');
  var housingRooms = window.form.mapFiltersForm.querySelector('#housing-rooms');
  var housingGuests = window.form.mapFiltersForm.querySelector('#housing-guests');
  var housingFeatures = window.form.mapFiltersForm.querySelector('#housing-features');

  function onApplyFilter () {
    console.log('Здесь будет функция фильтрации....');
  }

  function initializeFilterSelectors() {
    housingType.addEventListener('change', onApplyFilter);
    housingPrice.addEventListener('change', onApplyFilter);
    housingRooms.addEventListener('change', onApplyFilter);
    housingGuests.addEventListener('change', onApplyFilter);
    housingFeatures.addEventListener('change', onApplyFilter);
  }

  initializeFilterSelectors();
})();
