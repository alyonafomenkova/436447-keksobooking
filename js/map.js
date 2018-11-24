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
  var avatarUrl = 'img/avatars/user0' + index + '.png';
  return avatarUrl;
}

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function shuffle(arr) {
  var j, temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function getRandomShuffledSubarray(arr) {
  shuffle(arr);
  return arr.slice(0, randomInteger(0, arr.length)); //проверить randomInteger(0, arr.length) от 0 или от 1
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
        address: location.x + ',' + location.y,
        price: randomInteger(MIN_PRICE, MAX_PRICE),
        type: randomInteger(0, APARTMENT_TYPE.length - 1),
        rooms: randomInteger(MIN_NUMBER_ROOMS, MAX_NUMBER_ROOMS),
        guests: randomInteger(MIN_NUMBER_GUESTS, MAX_NUMBER_GUESTS),
        checkin: randomInteger(0, REGISTRATION_TIME.length - 1),
        checkout: randomInteger(0, REGISTRATION_TIME.length - 1),
        features: shuffle(FEATURES),
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
generateApartmens(NUMBER_OF_APARTMENTS);

