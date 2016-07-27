(function($) {

    $('.readMore').on('click', function() {

        event.preventDefault();
        $(this).hide();
        $('.more').css({'height': 'auto'});

    });

})(jQuery);
