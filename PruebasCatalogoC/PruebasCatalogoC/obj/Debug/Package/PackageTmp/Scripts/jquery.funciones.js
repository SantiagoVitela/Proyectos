
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

/// fecha : 22/01/2012
function obtenerFechaActual() {

    var f = new Date();
    var mes = (f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1)
    var hours = f.getHours()
    var minutes = f.getMinutes()
    return f.getDate() + "/" + mes + "/" + f.getFullYear();
}

function limpiarDivContent() {
    $('#content').html('<div id="imglogocentral"></div>');
}

/// fecha : 22/01/2012 14:46
function obtenerFechaHoraActual() {

    var f = new Date();
    var mes = (f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1)
    var hours = f.getHours()
    var minutes = f.getMinutes()
    return f.getDate() + "/" + mes + "/" + f.getFullYear() + " " + hours + ":" + minutes;
}

// fecha : 22/01/2012 14:46
function obtenerFechaHoraCompletaActual() {

    var f = new Date();
    var day = (f.getDate() + 1) < 10 ? '0' + (f.getDate() + 1) : (f.getDate() + 1);
    var month = (f.getMonth() + 1) < 10 ? '0' + (f.getMonth() + 1) : (f.getMonth() + 1);
    var hours = f.getHours();
    var minutes = f.getMinutes();
    var seconds = f.getSeconds();
    return day + "/" + month + "/" + f.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
}

/// fecha : 14:46
function obtenerHoraActual() {

    var f = new Date();
    var hours = f.getHours()
    var minutes = f.getMinutes()
    return hours + ":" + minutes;
}

// fecha : 2012-03-28 00:00:00.000
function obtenerFechaDateTime(fecha){

    var dia = Number(fecha.substring(0, 2));
    var mes = Number(fecha.substring(3, 5));
    var anio = Number(fecha.substring(6, 10));
        
    //return dia + '/' + mes + '/' + anio + ' 00:00:00.000';
    return anio + '-' + mes + '-' + dia;

    //return new Date(anio, mes, dia, 0, 0, 0, 0);
    //return "2012-08-31"
}

function focus(input) {
    $(input).focus();
}

/// muestra el html pasado como parametro y lo imprime
function imprimirHTML(strHTML) {
    var str = '<head>';
    str += '<link href="../Content/jquery-ui.css" rel="stylesheet" type="text/css" />';
    str += '<link href="../Content/grid.css" rel="stylesheet" type="text/css" />';
    str += '<link href="../Content/plantilla.css" rel="stylesheet" type="text/css" />';
    str += '<link href="../Content/modulos.css" rel="stylesheet" type="text/css" />';
    str += '<link href="../Content/dialog.css" rel="stylesheet" type="text/css" />';
    str += '</head>';
    str += '<div>';
    str += strHTML;
    str += '</div>';
    var ventimp = window.open(' ', 'impresion', 'location=yes,resizable=yes,scrollbars=yes,status=yes');
    ventimp.document.write(str);
    ventimp.document.close();
    ventimp.print();
    ventimp.close();
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

function getStringFromDate(date) {

    var curr_date = date.getDate();
    var curr_month = date.getMonth() + 1;
    var curr_year = date.getFullYear();

    value = curr_date + "/" + curr_month + "/" + curr_year;

    return value;
}

function parseDateStringToString(value) {

    var millis = value.replace('/Date(', '').replace(')/', '');
    var v1 = new Date(parseInt(millis)); //(eval(value.slice(1, -1)));
    value = ('0' + v1.getDate()).right(2) + '/' +
                            ('0' + (v1.getMonth() + 1)).right(2) + '/' +
                            v1.getFullYear() + ' ' + ('0' + v1.getHours()).right(2) + ':' + ('0' + v1.getMinutes()).right(2);
   
    return value;
}