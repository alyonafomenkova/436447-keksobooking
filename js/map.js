'use strict';

var NUMBER_OF_APARTMENTS = 8;
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
var MAX_NUMBER_GUESTS = 20; // max какой задавать?
var REGISTRATION_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = '';
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_MIN = 0;
var LOCATION_X_MAX = 630;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

function getAvatarUrlByIndex(index) {
  var avatarUrl = 'img/avatars/user0${index}.png';
  return avatarUrl;
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

function shuffle(arr) {
  var out = arr.slice(0);
  var j, temp;
  for (var i = out.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = out[j];
    out[j] = out[i];
    out[i] = temp;
  }
  return out;
}

function getRandomShuffledSubarray(arr) {
  var out = shuffle(arr);
  var index = randomInteger(0, out.length);
  return out.slice(0, index);
}

function generateApartmens(count) {
  var apartmens = [];

  for (var i = 1; i <= count; i++) {
    var emptyString = ' ';

    apartmens.push({
      author: {
        avatar: getAvatarUrlByIndex(i)
      },
      offer: {
        title: OFFER_TITLES[i],
        address: concatenateStrings(location.x, location.y),
        price: randomInteger(MIN_PRICE, MAX_PRICE),
        type: randomString(APARTMENT_TYPE),
        rooms: randomInteger(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
        guests: randomInteger(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
        checkin: randomString(REGISTRATION_TIME),
        checkout: randomString(REGISTRATION_TIME),
        features: getRandomShuffledSubarray(FEATURES),
        description: DESCRIPTION,
        photos: shuffle(PHOTOS),
      },
      location: {
        x: randomInteger(LOCATION_X_MIN, LOCATION_X_MAX),
        y: randomInteger(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    });
  }
  return apartmens;
}

alert(generateApartmens(NUMBER_OF_APARTMENTS));

