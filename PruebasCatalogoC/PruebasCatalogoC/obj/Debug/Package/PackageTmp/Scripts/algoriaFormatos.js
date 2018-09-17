
var AlgoriaFormat = function () {
}

AlgoriaFormat.initObject = function (objField, options) {
    var self = this;
    var defaultOptions = { align: 'right' };
    $.extend(defaultOptions, options);

    var tipo = $(objField).attr('data-type');
    var sep = tipo.split(',');
    var type = $(objField).attr('type');
    var tag = $(objField).tagName;

    if (type == undefined || type == null)
        type = '';

    if (tag == undefined || tag == null)
        tag = '';

    if (sep[0] == 'number') {

        var decs = AlgoriaFormat.getDefaultDecimals();
        if (sep[1] != undefined) {
            decs = parseInt(sep[1]);
        }

        // Si es un objeto que tenga el método jQuery val()
        if (type == 'text' || tag == 'textarea') {

            // Se aplica alineación al objeto
            $(objField).css('text-align', defaultOptions.align);

            $(objField).on('blur.number', function () {
                var v = $(this).val();
                $(this).val(AlgoriaFormat.format(v, decs));
            });
            $(objField).on('change.number', function () {
                var v = $(this).val();
                $(this).val(AlgoriaFormat.format(v, decs));
            });
            // Se asocian los eventos focus y blur, para que se desformatee y formatee respectivamente
            $(objField).on('focus.number', function () {
                var v = $(this).val();
                $(this).val(AlgoriaFormat.unformat(v));
                $(this).select();
            });

            // Se le pone el valor formateado
            var v = $(objField).val();
            $(objField).val(AlgoriaFormat.format(v, decs));

            // Bloquear entrada de números
            $(objField).numericTextBox(decs);
        }

        if (tag == 'label') {
            // Se le pone el valor formateado
            var v = $(objField).text();
            $(objField).text(AlgoriaFormat.format(v, decs));
        }
    }

    if (sep[0] == 'unformatnumber') {

        var decs = AlgoriaFormat.getDefaultDecimals();
        if (sep[1] != undefined)
            decs = parseInt(sep[1]);

        // Si es un objeto que tenga el método jQuery val()
        if (type == 'text' || tag == 'textarea') {

            // Se aplica alineación al objeto
            $(objField).css('text-align', defaultOptions.align);

            // Bloquear entrada de números
            $(objField).numericTextBox(decs);
        }
    }

    if (sep[0] == 'fillright') {
        var car = '0';
        if (sep[1] != undefined) {
            car = sep[1];
        }
        var len = 0;
        if (sep[2] != undefined)
            len = parseInt(sep[2]);

        // Si es un objeto que tenga el método jQuery val()
        if (type == 'text' || tag == 'textarea') {
            $(objField).on('blur.fillright', function () {
                var v = $(this).val();
                $(this).val(AlgoriaFormat.fillright(v, car, len));
            });

            // Se le pone el valor formateado
            var v = $(objField).val();
            $(objField).val(AlgoriaFormat.fillright(v, car, len));
        }

        if (tag == 'label') {
            // Se le pone el valor formateado
            var v = $(objField).text();
            $(objField).text(AlgoriaFormat.fillright(v, car, len));
        }
    }
    if (sep[0] == 'fillleft') {
        var car = '0';
        if (sep[1] != undefined) {
            car = sep[1];
        }
        var len = 0;
        if (sep[2] != undefined)
            len = parseInt(sep[2]);

        // Si es un objeto que tenga el método jQuery val()
        if (type == 'text' || tag == 'textarea') {
            $(objField).on('blur.fillleft', function () {
                var v = $(this).val();
                $(this).val(AlgoriaFormat.fillleft(v, car, len));
            });

            // Se le pone el valor formateado
            var v = $(objField).val();
            $(objField).val(AlgoriaFormat.fillleft(v, car, len));
        }

        if (tag == 'label') {
            // Se le pone el valor formateado
            var v = $(objField).text();
            $(objField).text(AlgoriaFormat.fillleft(v, car, len));
        }
    }
}

AlgoriaFormat.getDataTypeInfo = function (objField) {

    // Si el objeto actual tiene el atributo data-type, y el atributo data-type = number, 
    // entonces se formatea y se asignan eventos al control para formatear y desformatear en el
    // evento focus y blur
    var dataType = $(objField).attr('data-type');
    if (dataType != undefined && dataType != null) {
        var sep = dataType.split(',');
        if (sep[0] != undefined && sep[0] == 'number') {

            var decs = AlgoriaFormat.getDefaultDecimals();
            if (sep[1] != null && sep[1] != undefined)
                decs = parseInt(sep[1]);

            // Se regresa el objeto con las propiedades
            return { dataType: sep[0], decimales: decs };
        }

        if (sep[0] != undefined && sep[0] == 'unformatnumber') {

            var decs = AlgoriaFormat.getDefaultDecimals();
            if (sep[1] != null && sep[1] != undefined)
                decs = parseInt(sep[1]);

            // Se regresa el objeto con las propiedades
            return { dataType: sep[0], decimales: decs };
        }

        if (sep[0] != undefined && (sep[0] == 'fillleft' || sep[0] == 'fillright')) {

            var car = '0';
            if (sep[1] != null && sep[1] != undefined)
                car = sep[1];

            var len = 0;
            if (sep[2] != null && sep[2] != undefined)
                len = sep[2];

            // Se regresa el objeto con las propiedades
            return { dataType: sep[0], character: car, length: len };
        }
    }
    else
    // Si no, regresa null
        return null;
}
/***********************************************************
Funciones para formatear los números, cuando un elemnto
tengo asignada el atributo data-type="number"
***********************************************************/
AlgoriaFormat.format = function (value, decimales) {

    var valor = '';
    if (value != undefined && value != null && value != '') {
        valor = parseFloat(value.toString().replace(/,/gi, ''));
        valor = AlgoriaFormat.round(valor, decimales);
    }
    if (isNaN(valor)) {
        return;
    }

    var esNegativo = (valor < 0);

    // Trabaja sobre el valor absoluto
    valor = Math.abs(valor);

    var vals = valor.toString(); //valor.toString().replace(/,/gi, '');
    var partes = vals.split('.');
    var entero = '';
    var decs = '';
    var cont = 0;

    for (var i = partes[0].length - 1; i >= 0; i--) {
        cont++;
        entero = partes[0][i] + entero;

        // Si es el tercer carácter, se le pone una coma
        if (cont % 3 == 0 && i > 0)
            entero = ',' + entero;
    }

    var strDecs = '';
    for (var j = 1; j <= decimales; j++)
        strDecs += '0';

    if (partes[1] != null && partes[1] != undefined) {
        decs = partes[1];
        decs = (decs + strDecs).substring(0, decimales);
    }
    else
        decs += strDecs;

    var resp = '';
    if (decimales > 0)
        resp = entero + '.' + decs;
    else
        resp = entero;

    if (esNegativo == true)
        resp = '-' + resp;

    // Se regresa el valor formateado correctamente
    return resp;
}

AlgoriaFormat.unformat = function (value) {
    var valor = '';
    if (value != undefined && value != null && value != '')
        valor = parseFloat(value.toString().replace(/,/gi, ''));
    if (isNaN(valor))
        return;

    return valor.toString().replace(/,/gi, '');
}

AlgoriaFormat.fillleft = function (value, caracter, len) {

    if (value.toString().length >= len)
        return value;

    var caracteres = '';
    for (var i = 1; i <= len - value.toString().length; i++) {
        caracteres += caracter;
    }
    value = caracteres + value;
    if (len == 0)
        return value;
    else {
        return value.substring(0, len);
    }
}

AlgoriaFormat.fillright = function (value, caracter, len) {

    if (value.toString().length >= len)
        return value;

    var caracteres = '';
    for (var i = 1; i <= len; i++) {
        caracteres += caracter;
    }
    value += caracteres;

    if (len == 0)
        return value;
    else
        return value.substring(0, len);
}

AlgoriaFormat.round = function (value, decimals) {
    var original = parseFloat(value);
    var expon = Math.pow(10, decimals);
    var result = Math.round(original * expon) / expon;
    return result;
}

AlgoriaFormat.getDateStandardFormat = function (fecha) {

    // fecha : 2012-03-28 00:00:00.000

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
AlgoriaFormat.getDefaultDecimals = function () {
    var decs = 0;
    
    return decs;
}