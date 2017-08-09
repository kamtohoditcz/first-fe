$(function() {
  var $logo = $('.js-logo');
  var $value = $('.js-ideas-value');
  var $result = $('.js-ideas-result');

  var apiUrl = 'http://api.kamtohodit.cz';

  $value.focus(function() {
  });

  var ideasXhr;
  $value.autoComplete({
      minChars: 0,
      delay: 300,
      source: function(term, response){
        console.log({term});
        try { ideasXhr.abort(); } catch(e){}
        ideasXhr = $.getJSON(apiUrl, { q: term }, function(data){
          if ($logo.is(':visible')) {
            $logo.animate({ height: 0, opacity: 0 }, 'fast', function() {
              response(data);
            });
          } else {
            response(data);
          }
        });
      },
      renderItem: function(item, search) {
        console.log({item, search});
        var name = item.name;
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        return '<div class="autocomplete-suggestion" data-name="' + item.name + '" data-img="' + apiUrl + item.imagePath + '" data-desc="' + item.description+ '">' + name.replace(re, "<b>$1</b>") + '</div>';
      },
      onSelect: function(event, term, item) {
        event.preventDefault();
        console.log('desc: ' + item.data('desc'));
        var $card = $( 
          '<div class="card">' +
          '  <div class="kth-card">' +
          '    <img class="image" src="' + item.data('img') + '"/>' +
          '    <div class="card-block text-center" style="padding: 1.25rem 0;">' +
          '      <h2 class="card-title">' + item.data('name') + '</h2>' +
          '      <p class="card-text">' + marked(item.data('desc')) + '</p>' +
          '    </div>' +
          '  </div>' +
          '</div>').hide();
        $result.empty().append($card);
        //$logo.animate({ height: 0, opacity: 0 }, 'slow', function() {
        $card.fadeIn('slow');
        //});
      },
  });
});
