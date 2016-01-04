(function($){
  $.fn.sidebar = function(){
    var self = this;
    var sidebar = {
      sidebar: null,
      sidebarY: null,
      isFixed: false,
      offset: 0,

      init: function(){
        sidebar.createSidebar();
        sidebar.findLinks();
        sidebar.attachEvents();
      },

      findLinks: function(){
        var wrapper = $(self);
        var items = $('h2, h3', wrapper);
        $(items).each(function(index, value){
          var current = $(value);
          var title = current.text();
          var anchor = current.find('a').attr('id');

          switch (current.prop('tagName')){
            case 'H2':
              var link = sidebar.createMenuItem(title, anchor, true);
              $('>ul', sidebar.sidebar).append(link);
              break;
            case 'H3':
              var parent = $(current).prevAll('h2').first().find('a').attr('id');
              var link = sidebar.createMenuItem(title, anchor, false);
              $('a[href="#'+parent+'"]', sidebar.sidebar).next('ul').append(link);
              break;
          }
        });
      },

      createMenuItem: function(title, anchor, withSub){
        withSub = withSub || false;
        if (withSub) {
          return $('<li class="parent"><a href="#'+anchor+'">' + title + '</a><ul></ul></li>');
        } else {
          return $('<li class="child"><a href="#'+anchor+'">' + title + '</a></li>');
        }
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

      attachEvents: function(){
        
        $('.parent', sidebar.sidebar).each(function(idx, val){
          if ($('li.child', this).length > 0){
            // Have submenu items
            $('> a', this).on('click', function(e){
              e.preventDefault();
              $(this).parent().toggleClass('open');
            });
            sidebar._attachAnimate('.child a', this);
          } 
          else {
            // Do not have submenu items
            sidebar._attachAnimate('a', this);
          }
        });
      },
      _attachAnimate: function(target, context){
        $(target, context).on('click', function(e){
          e.preventDefault();
          var target = $(this).attr('href');
          $('html, body').animate({
            scrollTop: $(target).offset().top
          }, 2000);
        });
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

    sidebar.init();
    $(window).scroll(sidebar.scroll);
    return this;
  }

  $(document).ready(function(){
    $('#main_content').sidebar();
  });
})(jQuery);