'use strict';

(function(){
  $( document ).ready(function() {
    $('.prevent').on('click', (e) => {
      e.preventDefault();
    })
  });
}());
