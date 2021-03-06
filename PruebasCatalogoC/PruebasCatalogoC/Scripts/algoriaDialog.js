﻿var ALERT_BUTTON_TEXT = "ACEPTAR";
var divOculto;

var myCallback = "ll";

function dialog(tipo, titulo, mensaje, callback1, callback2) {

    if (isNaN(tipo)) {
        switch (tipo) {
            case "informativo":
                mostrarMensajeInformativo(titulo, mensaje, callback1);
                openTransparent();
                myCallback = callback1;
                break;
            case "error":
                mostrarMensajeError(titulo, mensaje, callback1);
                openTransparent();
                myCallback = callback1;
                break;
            case "decisivo1":
                mostrarMensajeDecisivoAceptarCancelar(titulo, mensaje, callback1, callback2);
                openTransparent();
                myCallback = callback2;
                break;
            case "decisivo2":
                mostrarMensajeDecisivoSiNo(titulo, mensaje, callback1, callback2);
                openTransparent();
                myCallback = callback2;
                break;
            case "prompt":
                mostrarMensajePrompt(titulo, mensaje, callback1, callback2, false);
                openTransparent();
                myCallback = callback2;
                break;
            case "prompt-pwd":
                mostrarMensajePrompt(titulo, mensaje, callback1, callback2, true);
                openTransparent();
                myCallback = callback2;
                break;
        }
    } else {
        var tipoN = Number(tipo);
        switch (tipoN) {
            case 2:
                mostrarMensajeError(titulo, mensaje, callback1);
                openTransparent();
                myCallback = callback1;
                break;
            default:
                mostrarMensajeInformativo(titulo, mensaje, callback1);
                openTransparent();
                myCallback = callback1;
        }
    }
}

function removeCustomAlertPopUp() {
    closeTransparent();
    $('#modalContainer').remove();
}

function mostrarMensajeInformativo(titulo, mensaje, callback) {
    d = document;

    if (d.getElementById("modalContainer")) {
        return;
    }

    var strDialogo = '<div class="dialogo">' +
                     '   <div class="titulo">' +
                     '      <div class="etiquetatitulo">' + titulo + '</div>' +
                     '   </div>' +
                     '   <div class="contenidodialogo">' +
                     '      <div class="iconodialogo" />' +
                     '      <div class="mensajedialogo" />' +
                     '  </div>' +
                     '  <div class="botonesdialogo">' +
                     '     <input type="button" id="closeBtn">' +
                     '  </div>' +
                     '</div>';

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    mObj.style.top = (document.documentElement.scrollTop + 110) + "px";

    $('body').append(mObj);

    $('#modalContainer').append(strDialogo);

    $('#modalContainer div.mensajedialogo').html(mensaje);
    $('#modalContainer div.iconodialogo').addClass('mensajeInformativo');
    $('#modalContainer #closeBtn').attr('value', '  ' + (ALERT_BUTTON_ACEPTAR === 'undefined' ? 'Aceptar' : ALERT_BUTTON_ACEPTAR) + '  ');
    $('#modalContainer #closeBtn').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(callback);
        if (esFunc) { callback(); } else eval(callback);
        var myCallback = "";
        return false;
    });
    $("#modalContainer #closeBtn").focus();

    var anchoPantalla = d.documentElement.scrollWidth;
    var altoPantalla = d.documentElement.scrollHeight;
    var ancho = $('#modalContainer div.dialogo').css('width');
    var alto = $('#modalContainer div.dialogo').css('height');

    ancho = ancho.replace('px', '');
    alto = alto.replace('px', '');

    $('#modalContainer div.dialogo').css('left', ((anchoPantalla - ancho) / 2) + 'px');
    //$('#modalContainer div.dialogo').css('top', (((altoPantalla - alto) / 2) - 50) + 'px');
}

function mostrarMensajeError(titulo, mensaje, callback) {
    d = document;

    if (d.getElementById("modalContainer")) {
        return;
    }

    var strDialogo = '<div class="dialogo">' +
                     '   <div class="titulo">' +
                     '      <div class="etiquetatitulo">' + titulo + '</div>' +
                     '   </div>' +
                     '   <div class="contenidodialogo">' +
                     '      <div class="iconodialogo" />' +
                     '      <div class="mensajedialogo" />' +
                     '  </div>' +
                     '  <div class="botonesdialogo">' +
                     '     <input type="button" id="closeBtn">' +
                     '  </div>' +
                     '</div>';

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    mObj.style.top = (document.documentElement.scrollTop + 110) + "px";
    //console.log(document.documentElement.scrollTop);

    $('body').append(mObj);

    $('#modalContainer').append(strDialogo);
    
    $('#modalContainer div.mensajedialogo').html(mensaje);
    $('#modalContainer div.iconodialogo').addClass('mensajeError');
    $('#modalContainer #closeBtn').attr('value', '  ' + (ALERT_BUTTON_ACEPTAR === 'undefined' ?  'Aceptar' : ALERT_BUTTON_ACEPTAR) + '  ');
    $('#modalContainer #closeBtn').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(callback);
        if (esFunc) { callback(); } else eval(callback);
        var myCallback = "";
        return false;
    });
    $("#modalContainer #closeBtn").focus();

    var anchoPantalla = d.documentElement.scrollWidth;
    var altoPantalla = d.documentElement.scrollHeight;
    var ancho = $('#modalContainer div.dialogo').css('width');
    var alto = $('#modalContainer div.dialogo').css('height');

    ancho = ancho.replace('px', '');
    alto = alto.replace('px', '');

    $('#modalContainer div.dialogo').css('left', ((anchoPantalla - ancho) / 2) + 'px');
}

function mostrarMensajeDecisivoSiNo(titulo, mensaje, nombreFuncionSi, nombreFuncionNo) {
    d = document;
    if (d.getElementById("modalContainer")) return false;

    var strDialogo = '<div class="dialogo">' +
                     '   <div class="titulo">' +
                     '      <div class="etiquetatitulo">' + titulo + '</div>' +
                     '   </div>' +
                     '   <div class="contenidodialogo">' +
                     '      <div class="iconodialogo" />' +
                     '      <div class="mensajedialogo" />' +
                     '  </div>' +
                     '  <div class="botonesdialogo">' +
                     '          <input type="button" id="btnSi">' +
                     '          <input type="button" id="btnNo">' +
                     '  </div>' +
                     '</div>';

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    mObj.style.top = (document.documentElement.scrollTop + 110) + "px";

    $('body').append(mObj);

    $('#modalContainer').append(strDialogo);

    $('#modalContainer div.mensajedialogo').html(mensaje);
    $('#modalContainer div.iconodialogo').addClass('mensajeDecisivo');

    $('#modalContainer #btnSi').attr('value', '  ' + ALERT_BUTTON_SI + '  ');
    $('#modalContainer #btnSi').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionSi);
        if (esFunc) { nombreFuncionSi(); } else eval(nombreFuncionSi);
        var myCallback = "";
        return true;
    });
    $("#modalContainer #btnSi").focus();

    $('#modalContainer #btnNo').attr('value', '  ' + ALERT_BUTTON_NO + '  ');
    $('#modalContainer #btnNo').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionNo);
        if (esFunc) nombreFuncionNo(); else eval(nombreFuncionNo);
        var myCallback = "";
        return true;
    });
    $("#modalContainer #btnNo").focus();

    var anchoPantalla = d.documentElement.scrollWidth;
    var altoPantalla = d.documentElement.scrollHeight;
    var ancho = $('#modalContainer div.dialogo').css('width');
    var alto = $('#modalContainer div.dialogo').css('height');

    ancho = ancho.replace('px', '');
    alto = alto.replace('px', '');

    $('#modalContainer div.dialogo').css('left', ((anchoPantalla - ancho) / 2) + 'px');
    //$('#modalContainer div.dialogo').css('top', (((altoPantalla - alto) / 2) - 50) + 'px');

}

function mostrarMensajeDecisivoAceptarCancelar(titulo, mensaje, nombreFuncionSi, nombreFuncionNo) {
    d = document;
    if (d.getElementById("modalContainer")) return false;

    var strDialogo = '<div class="dialogo">' +
                     '   <div class="titulo">' +
                     '      <div class="etiquetatitulo">' + titulo + '</div>' +
                     '   </div>' +
                     '   <div class="contenidodialogo">' +
                     '      <div class="iconodialogo" />' +
                     '      <div class="mensajedialogo" />' +
                     '  </div>' +
                     '  <div class="botonesdialogo">' +
                     '          <input type="button" id="btnAc">' +
                     '          <input type="button" id="btnCa">' +
                     '  </div>' +
                     '</div>';

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    mObj.style.top = (document.documentElement.scrollTop + 110) + "px";

    $('body').append(mObj);

    $('#modalContainer').append(strDialogo);

    $('#modalContainer div.mensajedialogo').html(mensaje);
    $('#modalContainer div.iconodialogo').addClass('mensajeDecisivo');

    $('#modalContainer #btnAc').attr('value', '  ' + (ALERT_BUTTON_ACEPTAR === 'undefined' ?  'Aceptar' : ALERT_BUTTON_ACEPTAR) + '  ');
    $('#modalContainer #btnAc').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionSi);
        if (esFunc) nombreFuncionSi(); else eval(nombreFuncionSi);
        var myCallback = "";
        return true;
    });
    $("#modalContainer #btnAc").focus();

    $('#modalContainer #btnCa').attr('value', '  ' + ALERT_BUTTON_CANCELAR + '  ');
    $('#modalContainer #btnCa').click(function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionNo);
        if (esFunc) nombreFuncionNo(); else eval(nombreFuncionNo);
        var myCallback = "";
        return true;
    }); $("#modalContainer #btnCa").focus();

    var anchoPantalla = d.documentElement.scrollWidth;
    var altoPantalla = d.documentElement.scrollHeight;
    var ancho = $('#modalContainer div.dialogo').css('width');
    var alto = $('#modalContainer div.dialogo').css('height');

    ancho = ancho.replace('px', '');
    alto = alto.replace('px', '');

    $('#modalContainer div.dialogo').css('left', ((anchoPantalla - ancho) / 2) + 'px');
    //$('#modalContainer div.dialogo').css('top', (((altoPantalla - alto) / 2) - 50) + 'px');
}

function mostrarMensajePrompt(titulo, mensaje, nombreFuncionSi, nombreFuncionNo, isPassword) {
    d = document;
    if (d.getElementById("modalContainer")) return false;

    var inputname = 'inptxt' + new Date().getTime();

    var inputtype = 'text';
    if (isPassword == true) {
        inputtype = 'password';
    }

    var strDialogo = '<div class="dialogo">' +
                     '   <div class="titulo">' +
                     '      <div class="etiquetatitulo">' + titulo + '</div>' +
                     '   </div>' +
                     '   <div class="contenidodialogo">' +
                     '      <div class="iconodialogo" />' +
                     '      <div class="mensajeprompt">' +
                     '          <label>' + mensaje + '</label>' +
                     '      </div>'+
                     '      <div class="inputprompt">' +
                     '          <input type="'+inputtype+'" id="'+inputname+'" style="width:95%;" />' +
                     '      </div>' +
                     '  </div>' +
                     '  <div class="botonesdialogo">' +
                     '          <input type="button" id="btnAc">' +
                     '          <input type="button" id="btnCa">' +
                     '  </div>' +
                     '</div>';

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    mObj.style.top = (document.documentElement.scrollTop + 110) + "px";

    $('body').append(mObj);

    $('#modalContainer').append(strDialogo);

    //$('#modalContainer div.mensajeprompt').html(mensaje);
    $('#modalContainer div.iconodialogo').addClass('mensajePrompt');

    $('#modalContainer #btnAc').attr('value', '  ' + (ALERT_BUTTON_ACEPTAR === 'undefined' ?  'Aceptar' : ALERT_BUTTON_ACEPTAR) + '  ');
    $('#modalContainer #btnAc').click(function (e) {
        var value = $('#' + inputname).val();
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionSi);
        if (esFunc) nombreFuncionSi(value); else eval(nombreFuncionSi);
        var myCallback = "";
        return true;
    });
    $("#modalContainer #btnAc").focus();

    $('#modalContainer #btnCa').attr('value', '  ' + ALERT_BUTTON_CANCELAR + '  ');
    $('#modalContainer #btnCa').click(function (e) {
        var value = $('#' + inputname).val();
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionNo);
        if (esFunc) nombreFuncionNo(value); else eval(nombreFuncionNo);
        var myCallback = "";
        return true;
    }); $("#modalContainer #btnCa").focus();

    var anchoPantalla = d.documentElement.scrollWidth;
    var altoPantalla = d.documentElement.scrollHeight;
    var ancho = $('#modalContainer div.dialogo').css('width');
    var alto = $('#modalContainer div.dialogo').css('height');

    ancho = ancho.replace('px', '');
    alto = alto.replace('px', '');

    $('#modalContainer div.dialogo').css('left', ((anchoPantalla - ancho) / 2) + 'px');
    //$('#modalContainer div.dialogo').css('top', (((altoPantalla - alto) / 2) - 50) + 'px');

    $('#' + inputname).keypress(function (e) {
        var kc = (e.keyCode) ? e.keyCode : e.which;
        if (kc == 13) {
            $('#modalContainer #btnAc').click();
        }
    });
    $('#' + inputname).focus();
}

function callkeydownhandler(ev) {

    var code = (ev.which) ? ev.which : ev.keyCode;
    if (code == 27) {
        ev.preventDefault();
        if ($('#modalContainer div.dialogo').length > 0) {
            removeCustomAlertPopUp();
            eval(myCallback);
            return false;
        } else if (opened != null) {
            $('#' + opened).dialog('close');
        }
    }
}

if (window.document.addEventListener) {
    window.document.addEventListener("keydown", function (e) { callkeydownhandler(e); }, false);
} else {
    window.document.attachEvent("onkeydown", function (e) { callkeydownhandler(e); });
}