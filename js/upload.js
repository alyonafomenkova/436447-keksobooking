'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var Image = {
    WIDTH: '70px',
    HEIGHT: '70px'
  };
  var avatarDropArea = document.querySelector('.ad-form-header__drop-zone');
  var photosDropArea = document.querySelector('.ad-form__drop-zone');
  var avatarInput = window.data.adForm.querySelector('.ad-form-header__input');
  var previewAvatar = window.data.adForm.querySelector('.ad-form-header__preview img');
  var defaultAvatar = getDefaultAvatar();
  var uploadPhotosInput = window.data.adForm.querySelector('.ad-form__input');
  var photosContainer = window.data.adForm.querySelector('.ad-form__photo-container');
  var previewPhoto = window.data.adForm.querySelector('.ad-form__photo');
  var isFirstUploading = true;

  function declineDefaultAndPropagation(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  function highlight(evt) {
    evt.currentTarget.classList.add('highlight');
  }

  function unhighlight(evt) {
    evt.currentTarget.classList.remove('highlight');
  }

  function handleDrop(evt) {
    var fileInput = evt.target.parentElement.querySelector('input[type="file"]');

    if (window.data.adForm.classList.contains('ad-form--disabled')) {
      return;
    }

    if (fileInput) {
      fileInput.files = evt.dataTransfer.files;

      if (evt.currentTarget === avatarDropArea) {
        uploadAvatar();
      } else {
        uploadPhotos();
      }
    }
  }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    avatarDropArea.addEventListener(eventName, declineDefaultAndPropagation, false);
    photosDropArea.addEventListener(eventName, declineDefaultAndPropagation, false);
  });

  ['dragenter', 'dragover'].forEach(function (eventName) {
    avatarDropArea.addEventListener(eventName, highlight, false);
    photosDropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(function (eventName) {
    avatarDropArea.addEventListener(eventName, unhighlight, false);
    photosDropArea.addEventListener(eventName, unhighlight, false);
  });

  function resetFileInput(input) {
    input.value = null;
  }

  function showPreview(file, element) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        element.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function uploadAvatar() {
    var file = avatarInput.files[0];
    showPreview(file, previewAvatar);
  }

  function uploadPhotos() {
    var files = uploadPhotosInput.files;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageContainer = isFirstUploading ? previewPhoto : previewPhoto.cloneNode();
      var img = document.createElement('img');
      showPreview(file, img);
      img.style.width = Image.WIDTH;
      img.style.height = Image.HEIGHT;
      imageContainer.appendChild(img);
      photosContainer.appendChild(imageContainer);
      isFirstUploading = false;
    }
  }

  function getDefaultAvatar() {
    return previewAvatar.getAttribute('src');
  }

  function setDefaultAvatar() {
    previewAvatar.src = defaultAvatar;
  }

  function resetPhotos() {
    var photos = photosContainer.querySelectorAll('.ad-form__photo');

    photos.forEach(function (item) {
      photosContainer.removeChild(item);
    });
  }

  avatarDropArea.addEventListener('drop', handleDrop, false);
  photosDropArea.addEventListener('drop', handleDrop, false);
  avatarInput.addEventListener('change', uploadAvatar);
  uploadPhotosInput.addEventListener('change', uploadPhotos);

  window.upload = {
    resetFileInput: resetFileInput,
    uploadAvatar: uploadAvatar,
    uploadPhotos: uploadPhotos,
    resetPhotos: resetPhotos,
    setDefaultAvatar: setDefaultAvatar
  };
})();
