'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // вынести константу ad-form в отдельный модуль, чтобы не искать по всему документу

  var fileChooserAvatar = document.querySelector('.ad-form-header__input');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var defaultAvatar = getDefaultAvatar();
  var fileChooserPhotos = document.querySelector('.ad-form__input');
  var photosContainer = document.querySelector('.ad-form__photo-container');
  var previewPhoto = document.querySelector('.ad-form__photo');
  var isFirstUploading = true;

  function uploadAvatar() {
    fileChooserAvatar.addEventListener('change', function () {
      var file = fileChooserAvatar.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          previewAvatar.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    });
  }

  function uploadPhotos() {
    fileChooserPhotos.addEventListener('change', function () {
      var file = fileChooserPhotos.files[0];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var imageContainer = isFirstUploading ? previewPhoto : previewPhoto.cloneNode();
          var img = document.createElement('img');

          img.style = 'width: 70px; height: 70px';
          img.src = reader.result;
          imageContainer.appendChild(img);
          photosContainer.appendChild(imageContainer);
          isFirstUploading = false;
        });
        reader.readAsDataURL(file);
      }
    });
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

  window.upload = {
    uploadAvatar: uploadAvatar,
    uploadPhotos: uploadPhotos,
    resetPhotos: resetPhotos,
    setDefaultAvatar: setDefaultAvatar
  };
})();
