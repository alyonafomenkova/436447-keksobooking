'use strict';

(function () {
  var CURRENCY_RUB = '\u20bd';
  var PHOTOS_WIDTH = 45;
  var PHOTOS_HEIGHT = 40;
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

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

    if (window.main.isDescriptionNotEmpty(features)) {
      cardElement.replaceChild(createFeatures(features), cardElement.querySelector('.popup__features'));
    } else {
      cardElement.querySelector('.popup__features').remove();
    }

    cardElement.querySelector('.popup__description').textContent = apartment.offer.description;
    cardElement.replaceChild(createPhotos(photos), cardElement.querySelector('.popup__photos'));
    cardElement.querySelector('.popup__avatar').src = apartment.author.avatar;
    cardElement.querySelector('.popup__close').addEventListener('click', onCardCloseClick);
    document.addEventListener('keydown', onCardCloseEcsPress);

    fragment.appendChild(cardElement);
    return fragment;
  }

  function onCardCloseClick() {
    window.card.destroyCard();
    window.pin.disablePreviousPin();
    document.removeEventListener('keydown', onCardCloseEcsPress);
  }

  function onCardCloseEcsPress(evt) {
    if (evt.keyCode === window.util.ESC) {
      window.card.destroyCard();
      window.pin.disablePreviousPin();
      document.removeEventListener('keydown', onCardCloseEcsPress);
    }
  }

  window.card = {
    showCard: function (apartment) {
      var card = window.main.map.querySelector('.map__card');
      if (card) {
        window.card.destroyCard();
      }
      window.main.map.insertBefore(createCardForApartment(apartment), mapFiltersContainer);
    },

    destroyCard: function () {
      var card = window.main.map.querySelector('.map__card');
      if (card) {
        card.remove();
      }
    }
  };
})();
