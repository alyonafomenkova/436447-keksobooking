'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var Image = {
    WIDTH: '70px',
    HEIGHT: '70px'
  };

  // вынести константу ad-form в отдельный модуль, чтобы не искать по всему документу

  var fileChooserAvatar = document.querySelector('.ad-form-header__input');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var defaultAvatar = getDefaultAvatar();
  var fileChooserPhotos = document.querySelector('.ad-form__input');
  var photosContainer = document.querySelector('.ad-form__photo-container');
  var previewPhoto = document.querySelector('.ad-form__photo');
  var isFirstUploading = true;

  function resetInputOnClick(input) {
    input.addEventListener('click', function () {
      input.value = null;
    });
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
    resetInputOnClick(fileChooserAvatar);

    fileChooserAvatar.addEventListener('change', function () {
      var file = fileChooserAvatar.files[0];
      showPreview(file, previewAvatar);
    });
  }

  function uploadPhotos() {
    resetInputOnClick(fileChooserPhotos);

    fileChooserPhotos.addEventListener('change', function () {
      var files = fileChooserPhotos.files;

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
