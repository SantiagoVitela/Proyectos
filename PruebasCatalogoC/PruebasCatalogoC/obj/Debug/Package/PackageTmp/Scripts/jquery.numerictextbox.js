(function ($) {

    $.fn.numericTextBox = function (dec) {
        return this.each(function () {
            $(this).bind("keydown.numericTextBox", function (e) {

                if (
                    e.keyCode == 8 // backspace
                    || e.keyCode == 9 // tab
                    || e.keyCode == 13 // enter
                    || e.keyCode == 27 // escape
                    || e.keyCode == 46 // delete
                    || (e.keyCode >= 35 && e.keyCode <= 39) // end, home, left arrow, up arrow, right arrow
                ) {
                    return;
                }
                else {
                    if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == 109) || (e.keyCode == 173) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 110 || e.keyCode == 190)) {
                        // not 0-9, numpad 0-9, -
                        e.preventDefault();
                        return;
                    }
                    else {
                        var keyCode = e.keyCode;
                        //console.log(keyCode);
                        // Si es el signo de "restar"
                        // Solo el primer caracter puede ser el signo de restar (-)
                        if ((keyCode == 109 || keyCode == 173) && (this.selectionStart > 0 || $(this).val().indexOf('-') >= 0)) {
                            keyCode = 109;
                            e.preventDefault();
                            return;
                        }

                        // Si es el punto decimal, y ya hay unpunto decimal
                        if (keyCode == 110 || keyCode == 190) {
                            if ($(this).val().indexOf('.') >= 0) {
                                e.preventDefault();
                                return;
                            }
                            if (dec == 0) {
                                e.preventDefault();
                                return;
                            }
                        }

                        // Si hay punto decimal, revisar el número de decimales permitido
                        if ($(this).val().indexOf('.') >= 0) {
                            var cstr = $(this).val().split('.')[1].toString();
                            if (cstr.length - 1 > dec) {
                                e.preventDefault();
                                return;
                            }
                        }

                        if (keyCode >= 96 && keyCode <= 105) {
                            keyCode -= 48;
                        }
                        var value = $(this).val();
                        value = parseInt(value, 10)
                        var maxNumber = $(this).data("maxnumber");
                        if (maxNumber) {
                            maxNumber = parseInt(maxNumber);
                            if (value > maxNumber) {
                                e.preventDefault();
                            }
                        }
                        //console.log("No llegó aqui");
                    }
                }
            });
        });
    }
})(jQuery);