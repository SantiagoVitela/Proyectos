var ALERT_BUTTON_TEXT = "ACEPTAR";
var divOculto;

var BUTTONS = {
    OK : 0,
    CANCEL : 1
};
Object.freeze(BUTTONS)

var myCallback = "ll";

function dialog(tipo, titulo, mensaje, callback1, callback2, buttonDefault) {

    if (buttonDefault == undefined) {
        buttonDefault = BUTTONS.OK;
    }

    if (isNaN(tipo)) {
        switch (tipo) {
            case "informativo":
                mostrarMensajeInformativo(titulo, mensaje, callback1);
                //openTransparent();
                myCallback = callback1;
                break;
            case "error":
                mostrarMensajeError(titulo, mensaje, callback1);
                //openTransparent();
                myCallback = callback1;
                break;
            case "decisivo1":
                mostrarMensajeDecisivoAceptarCancelar(titulo, mensaje, callback1, callback2, buttonDefault);
                //openTransparent();
                myCallback = callback2;
                break;
            case "decisivo2":
                mostrarMensajeDecisivoSiNo(titulo, mensaje, callback1, callback2, buttonDefault);
                //openTransparent();
                myCallback = callback2;
                break;
        }
    } else {
        var tipoN = Number(tipo);
        switch (tipoN) {
            case 2:
                mostrarMensajeError(titulo, mensaje, callback1, buttonDefault);
                //openTransparent();
                myCallback = callback1;
                break;
            default:
                mostrarMensajeInformativo(titulo, mensaje, callback1, buttonDefault);
                //openTransparent();
                myCallback = callback1;
        }
    }
}

function removeCustomAlertPopUp() {
    //closeTransparent();
    $('#modalContainer').remove();
}

function mostrarMensajeInformativo(titulo, mensaje, callback) {
    d = document;

    if (d.getElementById("modalContainer")) {
        return;
    }
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    document.body.appendChild(mObj);
    divVisible = alertObj.appendChild(d.createElement("div"));
    divVisible.id = "divVisible";
    divTitulo = divVisible.appendChild(d.createElement("div"));
    divTitulo.id = "divTitulo";
    divTitulo.innerHTML = "&nbsp &nbsp " + titulo;
    divTitulo.style.align = "middle";
    divContContMensaje = divVisible.appendChild(d.createElement("div"));
    divContContMensaje.id = "divContContMensaje";
    divContMensaje = divContContMensaje.appendChild(d.createElement("div"));
    divContMensaje.id = "divContMensaje";
    divImagen = divContMensaje.appendChild(d.createElement("div"));
    divImagen.id = "divImagen";
    $("#divImagen").addClass("mensajeInformativo");

    divMensaje = divContMensaje.appendChild(d.createElement("div"));
    divMensaje.id = "divMensaje";
    divMensaje.innerHTML = mensaje;
    divBotones = divVisible.appendChild(d.createElement("div"));
    divBotones.id = "divBotones";
    btn = divBotones.appendChild(d.createElement("button"));
    btn.id = "closeBtn";
    btn.innerHTML = ALERT_BUTTON_TEXT;
    btn.href = "#";

    //btn.onclick = function () { removeCustomAlertPopUp(); eval(callback); var myCallback = ""; return false; };
    btn.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(callback);
        if (esFunc) { callback(); } else eval(callback);
        var myCallback = "";
        return false;
    };

    ancho = alertObj.style.height;
    alertObj.style.left = ((d.documentElement.scrollWidth - alertObj.offsetWidth) + ancho) / 2 + "px";
//    dialogmask.style.height = '5000px';
    $("#closeBtn").focus();
}

function mostrarMensajeError(titulo, mensaje, callback) {
    d = document;
    if (d.getElementById("modalContainer")) return;
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";
    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    document.body.appendChild(mObj);
    divVisible = alertObj.appendChild(d.createElement("div"));
    divVisible.id = "divVisible";
    divTitulo = divVisible.appendChild(d.createElement("div"));
    divTitulo.id = "divTitulo";
    divTitulo.innerHTML = "&nbsp &nbsp " + titulo;
    divTitulo.style.align = "middle";
    divContContMensaje = divVisible.appendChild(d.createElement("div"));
    divContContMensaje.id = "divContContMensaje";
    divContMensaje = divContContMensaje.appendChild(d.createElement("div"));
    divContMensaje.id = "divContMensaje";
    divImagen = divContMensaje.appendChild(d.createElement("div"));
    divImagen.id = "divImagen";
    $("#divImagen").addClass("mensajeError");

    divMensaje = divContMensaje.appendChild(d.createElement("div"));
    divMensaje.id = "divMensaje";
    divMensaje.innerHTML = mensaje;
    divBotones = divVisible.appendChild(d.createElement("div"));
    divBotones.id = "divBotones";
    btn = divBotones.appendChild(d.createElement("button"));
    btn.id = "closeBtn";
    btn.innerHTML = ALERT_BUTTON_TEXT;
    btn.href = "#";
//    btn.onclick = function () {
//        removeCustomAlertPopUp();
//        eval(callback);
//        var myCallback = "";
//        return false;
//    };
    btn.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(callback);
        if (esFunc) { callback(); } else eval(callback);
        var myCallback = "";
        return false;
    };
    divOculto = alertObj.appendChild(d.createElement("div"));
    divOculto.id = "divOculto";
    $("#divOculto").width(alertObj.offsetWidth);
    msgOculto = divOculto.appendChild(d.createElement("p"));
    msgOculto.id = "msgOculto";
    divOculto.style.height = '5px';
    ancho = alertObj.style.height;
    alertObj.style.left = ((d.documentElement.scrollWidth - alertObj.offsetWidth) + ancho) / 2 + "px";
//    dialogmask.style.height = '5000px';
    $("#closeBtn").focus();
}

function mostrarMensajeDecisivoSiNo(titulo, mensaje, nombreFuncionSi, nombreFuncionNo, buttonDefault) {
    d = document;
    if (d.getElementById("modalContainer")) return false;
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    document.body.appendChild(mObj);
    divVisible = alertObj.appendChild(d.createElement("div"));
    divVisible.id = "divVisible";
    divTitulo = divVisible.appendChild(d.createElement("div"));
    divTitulo.id = "divTitulo";
    divTitulo.innerHTML = "&nbsp &nbsp " + titulo;
    divTitulo.style.align = "middle";
    divContContMensaje = divVisible.appendChild(d.createElement("div"));
    divContContMensaje.id = "divContContMensaje";
    divContMensaje = divContContMensaje.appendChild(d.createElement("div"));
    divContMensaje.id = "divContMensaje";
    divImagen = divContMensaje.appendChild(d.createElement("div"));
    divImagen.id = "divImagen";
    $("#divImagen").addClass("mensajeInformativo");

    divMensaje = divContMensaje.appendChild(d.createElement("div"));
    divMensaje.id = "divMensaje";
    divMensaje.innerHTML = mensaje;
    divBotones = divVisible.appendChild(d.createElement("div"));
    divBotones.id = "divBotones";
    btn1 = divBotones.appendChild(d.createElement("button"));
    btn1.id = "btnSi";
    btn1.innerHTML = "SI";
    btn1.href = "#";
    btn1.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionSi);
        if (esFunc) { nombreFuncionSi(); } else eval(nombreFuncionSi);
        var myCallback = "";
        return false;
    };
    btn2 = divBotones.appendChild(d.createElement("button"));
    btn2.id = "btnNo";
    btn2.innerHTML = "NO";
    btn2.href = "#";
    btn2.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionNo);
        if (esFunc) { nombreFuncionNo(); } else eval(nombreFuncionNo);
        var myCallback = "";
        return false;
    };
    divOculto = alertObj.appendChild(d.createElement("div"));
    divOculto.id = "divOculto";
    $("#divOculto").width(alertObj.offsetWidth);
    msgOculto = divOculto.appendChild(d.createElement("p"));
    msgOculto.id = "msgOculto";
    divOculto.style.height = '5px'
    ancho = alertObj.style.height;
    alertObj.style.left = ((d.documentElement.scrollWidth - alertObj.offsetWidth) + ancho) / 2 + "px";
    alertObj.style.top = "0px";

    var wscr = $(window).width();
    var hscr = $(window).height();
    viewportwidth = window.innerWidth,
    viewportheight = window.innerHeight

    if (buttonDefault == BUTTONS.OK) {
        $("#btnSi").focus();
    } else {
        $("#btnNo").focus();
    }
}

function mostrarMensajeDecisivoAceptarCancelar(titulo, mensaje, nombreFuncionSi, nombreFuncionNo, buttonDefault) {
    d = document;
    if (d.getElementById("modalContainer")) return false;
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = document.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    document.body.appendChild(mObj);
    divVisible = alertObj.appendChild(d.createElement("div"));
    divVisible.id = "divVisible";
    divTitulo = divVisible.appendChild(d.createElement("div"));
    divTitulo.id = "divTitulo";
    divTitulo.innerHTML = "&nbsp &nbsp " + titulo;
    divTitulo.style.align = "middle";
    divContContMensaje = divVisible.appendChild(d.createElement("div"));
    divContContMensaje.id = "divContContMensaje";
    divContMensaje = divContContMensaje.appendChild(d.createElement("div"));
    divContMensaje.id = "divContMensaje";
    divImagen = divContMensaje.appendChild(d.createElement("div"));
    divImagen.id = "divImagen";
    $("#divImagen").addClass("mensajeInformativo");

    divMensaje = divContMensaje.appendChild(d.createElement("div"));
    divMensaje.id = "divMensaje";
    divMensaje.innerHTML = mensaje;
    divBotones = divVisible.appendChild(d.createElement("div"));
    divBotones.id = "divBotones";
    btn1 = divBotones.appendChild(d.createElement("button"));
    btn1.id = "btnAc";
    btn1.innerHTML = "ACEPTAR";
    btn1.href = "#";
    btn1.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionSi);
        if (esFunc) { nombreFuncionSi(); } else eval(nombreFuncionSi);
        var myCallback = "";
        return false;
    };

    btn2 = divBotones.appendChild(d.createElement("button"));
    btn2.id = "btnCa";
    btn2.innerHTML = "CANCELAR";
    btn2.href = "#";
    btn2.onclick = function (e) {
        removeCustomAlertPopUp();
        var esFunc = $.isFunction(nombreFuncionNo);
        if (esFunc) { nombreFuncionNo(); } else eval(nombreFuncionNo);
        var myCallback = "";
        return false;
    };
    divOculto = alertObj.appendChild(d.createElement("div"));
    divOculto.id = "divOculto";
    $("#divOculto").width(alertObj.offsetWidth);
    msgOculto = divOculto.appendChild(d.createElement("p"));
    msgOculto.id = "msgOculto";
    divOculto.style.height = '5px'
    ancho = alertObj.style.height;
    alertObj.style.left = ((d.documentElement.scrollWidth - alertObj.offsetWidth) + ancho) / 2 + "px";
    alertObj.style.top = "0px";

    var wscr = $(window).width();
    var hscr = $(window).height();
    viewportwidth = window.innerWidth,
    viewportheight = window.innerHeight

    if (buttonDefault == BUTTONS.OK) {
        $("#btnAc").focus();
    } else {
        $("#btnCa").focus();
    }
}

function callkeydownhandler(evnt) {
    var ev = (evnt) ? evnt : event;
    var code = (ev.which) ? ev.which : ev.keyCode;
    if (code == 27) {
        if($('#alertBox').length > 0){
            removeCustomAlertPopUp();
            eval(myCallback); 
            return false;
        } else if (opened != null && opened != lastOpened && !dialogCerrado) {

            $('#' + opened + '').dialog('close');
            dialogCerrado = false;
            lastOpened = null;
        }
        dialogCerrado = false;
    }
}

if (window.document.addEventListener) {
    window.document.addEventListener("keydown", callkeydownhandler, false);
} else {
    window.document.attachEvent("onkeydown", callkeydownhandler);
}