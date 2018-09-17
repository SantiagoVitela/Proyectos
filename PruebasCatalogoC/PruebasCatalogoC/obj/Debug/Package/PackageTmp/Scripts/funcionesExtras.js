function getFechaUniversal(fecha) {

    var dia = Number(fecha.substring(0, 2));
    var mes = Number(fecha.substring(3, 5));
    var anio = Number(fecha.substring(6, 10));

    //return dia + '/' + mes + '/' + anio + ' 00:00:00.000';
    return anio + '-' + mes + '-' + dia;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);    
    console.log('decodedCookie: ' + document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var xtk = undefined;

(function ($) {

    $.ajaxPrefilter(function( options ) {
        if ( !options.beforeSend) {
            options.beforeSend = function (xhr) { 
                xhr.setRequestHeader('X-TOKEN', xtk);
            }
        }
    });

})(jQuery);