(function($){
  var sidebar = {
    sidebar: null,
    sidebarY: null,
    isFixed: false,
    offset: 0,

    init: function(){
      sidebar.createSidebar();
      sidebar.findLinks();

      $('a', sidebar.sidebar).on('click', function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
          scrollTop: $(target).offset().top
        }, 2000);
      });
    },

    findLinks: function(){
      var wrapper = $('#main_content');
      var items = $('h2, h3', wrapper);
      $(items).each(function(index, value){
        var current = $(value);
        var title = current.text();
        var anchor = current.find('a').attr('id');

        switch (current.prop('tagName')){
          case 'H2':
            var link = sidebar.createMenuItem(title, anchor);
            $('ul', sidebar.sidebar).append(link);
            break;
          case 'H3':
            var parent = $(current).prevAll('h2').first().find('a').attr('href');
            if ($('a[href="'+parent+'"]', sidebar.sidebar).siblings('ul').length == 0) {
              //$('a[href="'+parent+'"]', sidebar.sidebar).after('<ul></ul>');
            }
            //console.log(parent);
            break;
        }

        
        
        
      });
    },

    createMenuItem: function(title, anchor){
      return $('<li><a href="#'+anchor+'">' + title + '</a></li>');
    },

    createSidebar: function(){
      sidebar.offset = $('#header_wrap').outerHeight() + $('#nav_wrap').outerHeight();

      $('<div id="sidebar"><ul></ul></div>')
      .css({
        top: sidebar.offset
      })
      .prependTo('body');

      sidebar.sidebar = $('#sidebar');
      sidebar.sidebarY = sidebar.sidebar.offset().top;
    },

    scroll: function(event){
      var scrollTop = $(window).scrollTop();
      var shouldBeFixed = scrollTop > sidebar.sidebarY;
      if (shouldBeFixed && !sidebar.isFixed) {
        sidebar.sidebar.css({
          position: 'fixed',
          top: 0
        });
        sidebar.isFixed = true;
      } else if (!shouldBeFixed && sidebar.isFixed) {
        sidebar.sidebar.css({
          position: 'absolute',
          top: sidebar.offset
        });
        sidebar.isFixed = false;
      }
    }
  }

  $(document).ready(function(){
    sidebar.init();
  });

  $(window).scroll(sidebar.scroll);

})(jQuery);