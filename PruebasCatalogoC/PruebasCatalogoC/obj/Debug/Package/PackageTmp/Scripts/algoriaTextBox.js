
(function ($) {

    $.fn.backgroundText = function (txt) {

        return this.each(function () {
            //esteTexto = txt;
            var caracs = 0;
            var origColor = $(this).css('color');
            var origStyle = $(this).css('font-style');
            var origType = $(this).attr('type');

            $(this).val(this.esteTexto);

            $(this).bind("focus.backgroundText", function (e) {
                if (caracs == 0)
                    $(this).val('');

                $(this).css('font-style', origStyle);
                $(this).css('color', origColor);
                //$(this).attr('type', origType);
            });

            $(this).bind("blur.backgroundText", function (e) {
                if ($(this).val().length > 0) {
                    caracs = $(this).val().length;
                    return;
                } else {
                    $(this).val('<'+txt+'>');
                    $(this).css('font-style', 'italic');
                    $(this).css('color', '#ccc');
                    //$(this).attr('type', 'text');
                    caracs = 0;
                }
            });

            $(this).blur();
        });
    }
})(jQuery);