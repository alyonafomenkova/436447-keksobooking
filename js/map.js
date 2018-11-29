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

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPin = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var mapPinMain = document.querySelector('.map__pin--main');

function getAvatarUrlByIndex(index) {
  return 'img/avatars/user0' + index + '.png';
}

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function randomString(arr) {
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
  var index = randomInteger(1, out.length);
  return out.slice(0, index);
}

function generateApartments(count) {
  var apartmens = [];

  for (var i = 1; i <= count; i++) {
    var locationX = randomInteger(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX);

    apartmens.push({
      author: {
        avatar: getAvatarUrlByIndex(i)
      },
      offer: {
        title: OFFER_TITLES[i],
        address: concatenateStrings(locationX, locationY),
        price: randomInteger(MIN_PRICE, MAX_PRICE),
        type: randomString(APARTMENT_TYPE),
        rooms: randomInteger(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
        guests: randomInteger(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
        checkin: randomString(REGISTRATION_TIME),
        checkout: randomString(REGISTRATION_TIME),
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

function createPin(pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementWidth = getComputedStyle(pinTemplate, '::after').getPropertyValue('width');
  var pinElementHeight = getComputedStyle(pinTemplate, '::after').getPropertyValue('height');

  pinElement.style = 'left: ' + (pin.location.x - Math.round(pinElementWidth / 2)) + 'px; top: ' + (pin.location.y - pinElementHeight) + 'px;';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.description;
  return pinElement;
}

function renderPinsForApartments(pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createPin(pins[i]));
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

  fragment.appendChild(cardElement);

  return fragment;
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

function activateMapAndForms() {
  //var apartments = generateApartments(NUMBER_OF_APARTMENTS);
  map.classList.remove('map--faded');
  enableFormFields(adForm);
  enableFormFields(mapFiltersForm);
  //mapPin.appendChild(renderPinsForApartments(apartments));
  //map.insertBefore(createCardForApartment(apartments[0]), mapFiltersContainer);
}

function onMapPinMainMouseup() {
  activateMapAndForms();
}


disableFormFields(adForm);
disableFormFields(mapFiltersForm);
mapPinMain.addEventListener('mouseup', function() {
  onMapPinMainMouseup();
});
