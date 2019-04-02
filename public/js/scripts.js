'use strict';

(function () {
  var search = $('#search');
  var searchmenu = $('#searchmenu');
  search.on('keyup', function(e) {
    var val = e.target.value;
    var url = '/search/' + val;
    $.get(url, function(data) {
      console.log(data);
      var html = '';
      var max = data.length > 4 ? 5 : data.length;
      for (var i = 0; i < max; i += 1) {
        html += '<a href="#" class="list-group-item">Dapibus ac facilisis in</a>';
      }
      searchmenu.html(html);
    });
  });

  $( document ).ready(function () {
    $('.prevent').on('click', (e) => {
      e.preventDefault();
    });
  });
}());
