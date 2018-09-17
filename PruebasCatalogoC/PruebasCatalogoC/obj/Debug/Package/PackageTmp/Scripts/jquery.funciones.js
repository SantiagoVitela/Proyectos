
function round(value, decimals) {
    var p = Math.pow(10, decimals);
    return Math.round(value * p) / p;
}

// Función trim agrega al prototipo
if (!('trim' in String.prototype)) {
    String.prototype.trim = function () {
        return this.toString().replace(/^\s+/g, '').replace(/\s+$/g, '');
    };
}

/// comprueba el formato de fecha dd/mm/yyyy
function comprobarFecha(fecha) {
    //var patron = new RegExp("^[0-9]{2}-[0-9]{2}-[0-9]{4}$");        
    var patron = new RegExp("^[0-9]{2}/[0-9]{2}/[0-9]{4}$");
    if (patron.test(fecha)) {
        return true;
    }
    else {
        return false;
    }
}

function comprobarHora(hora) {
    var patron = new RegExp("^[0-9]{2}:[0-9]{2}$");
    if (patron.test(hora)) {
        var horaArray = hora.split(':');
        if (horaArray[0] <= 23 && horaArray[1] <= 59) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

/// fecha : 22/01/2012
function obtenerFechaActual() {

    var f = new Date();
    var mes = (f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1)
    var hours = f.getHours()
    var minutes = f.getMinutes()
    return f.getDate() + "/" + mes + "/" + f.getFullYear();
}

/// fecha : 22/01/2012 14:46
function obtenerFechaHoraActual() {

    var f = new Date();
    var mes = (f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1)
    var hours = f.getHours()
    var minutes = f.getMinutes()
    return f.getDate() + "/" + mes + "/" + f.getFullYear() + " " + hours + ":" + minutes;
}

// fecha : 2012-03-28 00:00:00.000
function obtenerFechaDateTime(fecha){

    var dia = Number(fecha.substring(0, 2));
    var mes = Number(fecha.substring(3, 5));
    var anio = Number(fecha.substring(6, 10));

    if (dia < 10)
        dia = '0' + dia;

    if (mes < 10)
        mes = '0' + mes;
       
    //return dia + '/' + mes + '/' + anio + ' 00:00:00.000';
    return anio + '-' + mes + '-' + dia;
}

function focus(input) {
    $(input).focus();
}

/// muestra el html pasado como parametro y lo imprime
function imprimirHTML(strHTML) {
    //console.log(urlMain);
    var str = '<html><head>';
    str += '<link rel="stylesheet" type="text/css" href="../../Content/jquery-ui.css" media="print" />';
    str += '<link rel="stylesheet" type="text/css" href="../../Content/grid.css" media="print" />';
    str += '<link rel="stylesheet" type="text/css" href="../../Content/plantilla.css" media="print" />';
    str += '<link rel="stylesheet" type="text/css" href="../../Content/modulos.css" media="print" />';
    str += '<link rel="stylesheet" type="text/css" href="../../Content/dialog.css" media="print" />';
    str += '</head>';
    str += '<div>';
    str += strHTML;
    str += '</div></html>';
    
    var ventimp = window.open('about:blank', 'impresion', 'location=yes,resizable=yes,scrollbars=yes,status=yes');
    ventimp.document.write(str);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
}

function parseDateStringToString(value) {
    var millis = value.replace('/Date(', '').replace(')/', '');
    var v1 = new Date(parseInt(millis)); //(eval(value.slice(1, -1)));
    value = ('0' + v1.getDate()).right(2) + '/' +
                            ('0' + (v1.getMonth() + 1)).right(2) + '/' +
                            v1.getFullYear();
    return value;
}

if (!('left' in String.prototype)) {
    String.prototype.left = function (n) {
        if (n <= 0)
            return "";
        else if (n > String(this).length)
            return str;
        else
            return String(this).substring(0, n);
    };
}

if (!('right' in String.prototype)) {
    String.prototype.right = function (n) {
        if (n <= 0)
            return "";
        else if (n > String(this).length)
            return this;
        else {
            var iLen = String(this).length;
            return String(this).substring(iLen, iLen - n);
        }
    };
}

$(function () {
    $.fn.NumericMaxMin = function (options) {
        return this.each(function () {
            var $this = $(this);

            $this.keydown(options, function (event) {
                var ctrlDown = event.ctrlKey || event.metaKey;
                var cKey = (window.event) ? event.keyCode : event.which;

                // Allow only backspace and delete
                if (KeyNoNumValido(event.keyCode, ctrlDown) == true) {
                    // let it happen, don't do anything
                } else {
                    // Ensure that it is a number and stop the keypress
                    if ((cKey < 48 || cKey > 57)
                            && (cKey < 96 || cKey > 105)) {
                        event.preventDefault();
                    } else {
                        // check range
                        var result = this.value;
                        if (result > event.data.max || result < event.data.min) {
                            event.preventDefault();
                        }
                    }
                }
            });
        });
    };
    $.fn.Numerico = function (options) {
        return this.each(function () {
            var $this = $(this);
            //$this.addClass('CampoNumerico');
            $this.css('text-align', 'right');
            $this.blur(options, function (event) {
                //this.value = 
            });
            $this.focus(options, function (event) {

            });
            $this.keydown(options, function (event) {
                var ctrlDown = event.ctrlKey || event.metaKey;
                var cKey = (window.event) ? event.keyCode : event.which;
                alert(cKey);
                // Allow only backspace and delete
                if (KeyNoNumValido(cKey, ctrlDown) == true) {
                    // let it happen, don't do anything
                }
                else {
                    // Ensure that it is a number and stop the keypress
                    if ((cKey < 48 || cKey > 57) && (cKey < 96 || cKey > 105)) {
                        event.preventDefault();
                    }
                }
            });
        });
    };

    $.fn.NumericoDecimal = function (options) {
        return this.each(function () {
            var $this = $(this);
            //$this.addClass('CampoNumerico');
            $this.css('text-align', 'right');
            $this.keydown(options, function (event) {
                var ctrlDown = event.ctrlKey || event.metaKey;
                var cKey = (window.event) ? event.keyCode : event.which;

                // Allow only backspace and delete
                if (KeyNoNumValido(cKey, ctrlDown) == true) {
                    // Esta bien
                }
                else if (cKey == 110 || cKey == 190) // .
                {
                    if (this.value.split('.').length > 2 || this.value.split('.')[1].length > 2)
                        event.preventDefault();
                }
                else {
                    // Ensure that it is a number and stop the keypress
                    if ((cKey < 48 || cKey > 57) && (cKey < 96 || cKey > 105)) {
                        event.preventDefault();
                    }
                    else {
                        if (this.value.split('.').length > 2 || this.value.split('.')[1].length >= 2) {
                            if ((cKey < 48 || cKey > 57) && (cKey < 96 || cKey > 105))
                                event.preventDefault();
                        }
                    }
                }
            });
        });
    };
});

function KeyNoNumValido(keyCode, ctrlDown) {
    if (keyCode == 46 ||
        keyCode == 8 ||
        keyCode == 3 ||
        keyCode == 37 ||
        keyCode == 39 ||
        keyCode == 9 ||
        (keyCode == 86 && ctrlDown) ||  // Copy
        (keyCode == 67 && ctrlDown)) // Paste
    {
        return true;
    }
    else {
        return false;
    }
}

function esNumero(value) {
    return (/^([0-9])*[.]?[0-9]*$/.test(value))
}

function esNumeroEntero(value) {
    return (/^([0-9])*$/.test(value));
}

/*******************************************************************
***********************************************************************/
// Se solicita un objeto Json al servidor..
// Este método siempre es sincrono, es decir, permanecerá en éste método hasta que
// el servidor haya respondido la petición
var doJsonRequest = function (url, params, options) {
    var self = this;

    var resp = null;
    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'json';
    peticion.async = false;

    if (options != undefined) {
        if (options.addwait != undefined) {
            peticion.addwait = options.addwait;
        }
    }

    if (params != undefined && params != null) {
        peticion.json = JSON.stringify(params);
    }

    peticion.error = function (data) { resp = data; };
    peticion.posSolicitar = function (data) { resp = data; };
    peticion.solicitar();

    return resp;
}

var doHTMLRequest = function (url, params, options) {
    var self = this;

    var resp = null;

    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'html';
    peticion.async = false;

    if (params != undefined && params != null)
        peticion.json = JSON.stringify(params);

    peticion.error = function (data) { resp = data; };
    peticion.posSolicitar = function (data) { resp = data; };
    peticion.solicitar();

    return resp;
}
var doValidarPermiso = function (perm) {
    var r = doJsonRequest(urlMain+'/Home/ValidarPermiso', { 'perm': perm }, { 'addwait': false });
    return r;
}