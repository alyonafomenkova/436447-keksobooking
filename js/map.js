'use strict';

var NUMBER_OF_APARTMENTS = 8;
var CURRENCY_RUB = '\u20bd';
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var APARTMENT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var MIN_NUMBER_ROOMS = 1;
var MAX_NUMBER_ROOMS = 5;
var MIN_NUMBER_GUESTS = 1;
var MAX_NUMBER_GUESTS = 20;
var REGISTRATION_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = '';
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PHOTOS_WIDTH = 45;
var PHOTOS_HEIGHT = 40;
var LOCATION_X_MIN = 0;
var LOCATION_X_MAX = 1200;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var STEM_OF_PIN_WIDTH = 10;
var STEM_OF_PIN_HEIGHT = 22;
var ESC_KEYCODE = 27;

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPin = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var mapPinMain = document.querySelector('.map__pin--main');
var addressInput = adForm.querySelector('#address');
var isPageActive = false;
var priceInput = adForm.querySelector('#price');
var typeInput = adForm.querySelector('#type');
var checkinInput = adForm.querySelector('#timein');
var checkoutInput = adForm.querySelector('#timeout');
var capacityInput = adForm.querySelector('#capacity');
var roomInput = adForm.querySelector('#room_number');

function getAvatarUrlByIndex(index) {
  return 'img/avatars/user0' + index + '.png';
}

function getRandomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function getRandomString(arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

function concatenateStrings(a, b) {
  return a + ',' + b;
}

function shuffleArray(arr) {
  var out = arr.slice(0);
  var j;
  var temp;
  for (var i = out.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = out[j];
    out[j] = out[i];
    out[i] = temp;
  }
  return out;
}

function getRandomShuffledSubarray(arr) {
  var out = shuffleArray(arr);
  var index = getRandomInteger(1, out.length);
  return out.slice(0, index);
}

function generateApartments(count) {
  var apartmens = [];

  for (var i = 1; i <= count; i++) {
    var locationX = getRandomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);

    apartmens.push({
      author: {
        avatar: getAvatarUrlByIndex(i)
      },
      offer: {
        title: getRandomString(OFFER_TITLES),
        address: concatenateStrings(locationX, locationY),
        price: getRandomInteger(MIN_PRICE, MAX_PRICE),
        type: getRandomString(APARTMENT_TYPE),
        rooms: getRandomInteger(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
        guests: getRandomInteger(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
        checkin: getRandomString(REGISTRATION_TIME),
        checkout: getRandomString(REGISTRATION_TIME),
        features: getRandomShuffledSubarray(FEATURES),
        description: DESCRIPTION,
        photos: shuffleArray(PHOTOS),
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return apartmens;
}

function createPin(apartment) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (apartment.location.x - Math.round(STEM_OF_PIN_WIDTH / 2)) + 'px; top: ' + (apartment.location.y - STEM_OF_PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').src = apartment.author.avatar;
  pinElement.querySelector('img').alt = apartment.offer.description;
  return pinElement;
}

function onPinClickListener(apartment) {
  showCard(apartment);
}

function renderPinsForApartments(apartments) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < apartments.length; i++) {
    var apartment = apartments[i];
    var pinElement = createPin(apartment);
    pinElement.addEventListener('click', onPinClickListener.bind(null, apartment));
    fragment.appendChild(pinElement);
  }
  return fragment;
}

function mapApartmentName(type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return '';
  }
}

function createFeatures(features) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'popup__feature' + ' popup__feature--' + features[i];
    fragment.appendChild(featureItem);
  }
  return fragment;
}

function createPhotos(photoUrls) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photoUrls.length; i++) {
    var img = document.createElement('img');
    img.src = photoUrls[i];
    img.classList.add('popup__photo');
    img.width = PHOTOS_WIDTH;
    img.height = PHOTOS_HEIGHT;
    img.alt = 'Фотография жилья';
    fragment.appendChild(img);
  }
  return fragment;
}

function createCardForApartment(apartment) {
  var fragment = document.createDocumentFragment();
  var cardElement = cardTemplate.cloneNode(true);
  var features = apartment.offer.features;
  var photos = apartment.offer.photos;

  cardElement.querySelector('.popup__title').textContent = apartment.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = apartment.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = apartment.offer.price + CURRENCY_RUB + '/ночь';
  cardElement.querySelector('.popup__type').textContent = mapApartmentName(apartment.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = apartment.offer.rooms + ' комнаты для ' + apartment.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + apartment.offer.checkin + ', выезд до ' + apartment.offer.checkout;
  cardElement.replaceChild(createFeatures(features), cardElement.querySelector('.popup__features'));
  cardElement.querySelector('.popup__description').textContent = apartment.offer.description;
  cardElement.replaceChild(createPhotos(photos), cardElement.querySelector('.popup__photos'));
  cardElement.querySelector('.popup__avatar').src = apartment.author.avatar;
  cardElement.querySelector('.popup__close').addEventListener('click', onCardCloseClick);
  document.addEventListener('keydown', onCardCloseEcsPress);

  fragment.appendChild(cardElement);
  return fragment;
}

function onCardCloseClick() {
  destroyCard();
  document.removeEventListener('keydown', onCardCloseEcsPress);
}

function onCardCloseEcsPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    destroyCard();
    document.removeEventListener('keydown', onCardCloseEcsPress);
  }
}

function disableFormFields(formName) {
  for (var i = 0; i < formName.children.length; i++) {
    formName.children[i].disabled = true;
  }
}

function enableFormFields(formName) {
  for (var i = 0; i < formName.children.length; i++) {
    formName.children[i].disabled = false;
  }
}

function setInputReadOnly(inputName) {
  inputName.readOnly = true;
}

function getPinX() {
  var rect = mapPinMain.getBoundingClientRect();
  return Math.round(((rect.left + rect.right) / 2) + pageXOffset);
}

function getPinY() {
  var rect = mapPinMain.getBoundingClientRect();
  return isPageActive ?
    Math.round((((rect.top + rect.bottom) / 2) + STEM_OF_PIN_HEIGHT) + pageYOffset) :
    Math.round(((rect.top + rect.bottom) / 2) + pageYOffset);
}

function updateAddress() {
  var address = getPinX() + ', ' + getPinY();
  addressInput.value = address;
}

function showCard(apartment) {
  var card = map.querySelector('.map__card');
  if (card) {
    destroyCard();
  }
  map.insertBefore(createCardForApartment(apartment), mapFiltersContainer);
}

function destroyCard() {
  var card = map.querySelector('.map__card');
  map.removeChild(card);
}

function activateMapAndForms() {
  var apartments = generateApartments(NUMBER_OF_APARTMENTS);

  isPageActive = true;
  setInputReadOnly(addressInput);
  updateAddress();
  map.classList.remove('map--faded');
  enableFormFields(adForm);
  enableFormFields(mapFiltersForm);
  mapPin.appendChild(renderPinsForApartments(apartments));
}

function onMapPinMainMouseup() {
  activateMapAndForms();
  mapPinMain.removeEventListener('mouseup', onMapPinMainMouseup);
}

disableFormFields(adForm);
disableFormFields(mapFiltersForm);
updateAddress();

mapPinMain.addEventListener('mouseup', onMapPinMainMouseup);

function setMinPrice(apartmentType) {
  switch (apartmentType) {
    case 'bungalo':
      priceInput.setAttribute('min', 0);
      priceInput.setAttribute('placeholder', 0);
      break;
    case 'flat':
      priceInput.setAttribute('min', 1000);
      priceInput.setAttribute('placeholder', 1000);
      break;
    case 'house':
      priceInput.setAttribute('min', 5000);
      priceInput.setAttribute('placeholder', 5000);
      break;
    case 'palace':
      priceInput.setAttribute('min', 10000);
      priceInput.setAttribute('placeholder', 10000);
      break;
  }
}

function onSynchronizeCheckinAndCheckoutTimes() {
  checkoutInput.selectedIndex = checkinInput.selectedIndex = event.target.selectedIndex;
}

function setCapacity(quantityRooms) {
  switch (quantityRooms) {
    case '1':
      capacityInput.options[0].disabled = true;
      capacityInput.options[1].disabled = true;
      capacityInput.options[3].disabled = true;
      capacityInput.options[2].disabled = false;
      capacityInput.setCustomValidity('Можем принять только одного гостя');
      break;
    case '2':
      capacityInput.options[0].disabled = true;
      capacityInput.options[3].disabled = true;
      capacityInput.options[2].disabled = false;
      capacityInput.options[1].disabled = false;
      capacityInput.setCustomValidity('Можем принять одного или двух гостей');
      break;
    case '3':
      capacityInput.options[3].disabled = true;
      capacityInput.options[0].disabled = false;
      capacityInput.options[1].disabled = false;
      capacityInput.setCustomValidity('Можем принять одного, два или три гостя');
      break;
    case '100':
      capacityInput.options[2].disabled = true;
      capacityInput.options[1].disabled = true;
      capacityInput.options[0].disabled = true;
      capacityInput.options[3].disabled = false;
      capacityInput.setCustomValidity('Не можем принять гостей');
      break;
  }
}

typeInput.addEventListener('change', function () {
  var apartmentType = typeInput.value;
  setMinPrice(apartmentType);
});

checkinInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);
checkoutInput.addEventListener('change', onSynchronizeCheckinAndCheckoutTimes);

roomInput.addEventListener ('change', function() {
  var quantityRooms = roomInput.value;
  setCapacity(quantityRooms);
});

capacityInput.addEventListener ('change', function() {
  capacityInput.setCustomValidity('');
});
