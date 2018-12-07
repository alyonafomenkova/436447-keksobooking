'use strict';

(function () {
  var KEY_CODE = {
    ESC: 27,
  };

  window.util = {
    ESC: KEY_CODE.ESC,

    getRandomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    },

    getRandomString: function (arr) {
      var rand = Math.floor(Math.random() * arr.length);
      return arr[rand];
    },

    concatenateStrings: function (a, b) {
      return a + ',' + b;
    },

    shuffleArray: function (arr) {
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
    },

    getRandomShuffledSubarray: function (arr) {
      var out = window.util.shuffleArray(arr);
      var index = window.util.getRandomInteger(1, out.length);
      return out.slice(0, index);
    }
  };
})();
