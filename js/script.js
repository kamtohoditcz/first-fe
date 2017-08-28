$(function() {
  var $logo = $('.js-logo');
  var $value = $('.js-ideas-value');
  var $result = $('.js-ideas-result');
  var $searchIcon = $('.js-search-icon');

  var apiUrl = 'http://api.kamtohodit.cz';

  var ideasXhr;
  $value.autoComplete({
      minChars: 0,
      delay: 300,
      source: function(term, response){
        $searchIcon.removeClass('fa-search').addClass('fa-pulse fa-spinner');
        try { ideasXhr.abort(); } catch(e){}
        ideasXhr = $.getJSON(apiUrl, { q: term }, function(data){
          $searchIcon.addClass('fa-search').removeClass('fa-pulse fa-spinner');
          if ($logo.is(':visible')) {
            $logo.animate({ width: 0, height: 0, opacity: 0 }, 'fast', function() {
              response(data);
            });
          } else {
            response(data);
          }
        });
      },
      renderItem: function(item, search) {
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        return '<div class="autocomplete-suggestion" data-name="' + item.name + '" data-img="' + apiUrl + item.imagePath + '" data-desc="' + item.description+ '">' + item.name.replace(re, "<b>$1</b>") + '</div>';
      },
      onSelect: function(event, term, item) {
        event.preventDefault();
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
        $card.fadeIn('slow');
      },
  });

  // Fill stats, eg:
  // Pracujeme na <b class="js-stats-draft"><i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i></b> odpadcích.
  ['all', 'draft', 'pub', 'pic', 'lastweek'].forEach(function(statsType) {
    var $elems = $('.js-stats-' + statsType);
    if ($elems.length) {
      $.getJSON(apiUrl + '/stats', { q: statsType }, function(num) {
        console.log('filling: ' + statsType);
        $elems.text(num);
      });
    }
  });

});
