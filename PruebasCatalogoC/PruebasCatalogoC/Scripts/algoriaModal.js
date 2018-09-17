var indexFondo = 1000;
var opened = null;
var lastOpened = null;
var id = null;
var lastFocused = null;
var fondosAbiertos = 0;
var modalesAbiertos = 0;

var Modal = function (tituloMensaje, div, myOptions) {
    this.id = null;
    this.strHTML = '';
    this.div = div;
    this.divHijo = null;
    this.recreate = true;
    this.dialogObject;
    this.fnClose = null;

    // Se guarda la referencia del padre
    this.padre = '';

    var self = this;

    // Esta variable se pondrá en true si no se ha especificado un nombre de div sobre el cuál
    // crear el cuadro de diálogo
    var destOnClose = true;
    if (myOptions && myOptions.destroyOnClose) {
        destOnClose = myOptions.destroyOnClose;
    }

    // Si no se ha especificado un div, entonces se crea un div al vuelo
    if (div == null || div == undefined || div == '') {

        var n1 = 'divFly' + new Date().getTime();
        var divC = '<div id="' + n1 + '"></div>';
        $('body').append(divC);
        self.divHijo = n1;

        //destOnClose = true;

    } else {

        self.divHijo = $('#' + div + ' div:first').attr('id');

        // Si no hay un div hijo, entonces se crea uno y se agrega al div padre
        if (self.divHijo == null || self.divHijo == undefined) {
            var n = 'divFly' + new Date().getTime();
            var divT = '<div id="' + n + '"></div>';
            $('#' + div).append(divT);
            self.divHijo = n;
        }
    }

    // Al final, el id expuesto, siempre será en realidad el idGenerado del hijo
    self.id = self.divHijo;

    //console.log(self.id);

    // Opciones generales del cuadro de diálogo
    var options = { width: 350,
        height: 160,
        title: tituloMensaje,
        stack: false,
        closeOnEscape: false,
        autoOpen: false,
        modal: false,
        show: 'slide',
        hide: 'slide',
        closeOnEscape: true,
        destroyOnClose: destOnClose,
        open: function (type, data) {
            //$('#' + self.id).append($('#'+self.divHijo));
        },
        beforeClose: function () {
            //self.preClose();
            if ($.isFunction(self.fnClose)) {
                self.fnClose();
            }
        },
        close: function () {
            // La funcioón para cerrar el diálogo
            var self = this;
            opened = self.padre;
            closeTransparent();

            // Variable para controlar los z-index de los cuadros de diálogo modales.
            modalesAbiertos--;
            if ($(this).dialog('option', 'destroyOnClose') == true) {
                $(this).remove();
            }
        }
    };

    $.extend(options, myOptions);
    this.dialogObject = $('#' + self.divHijo).dialog(options);
};

Modal.prototype.open = function (titulo, options) {

    var self = this;

    self.padre = opened;
    opened = self.divHijo;

    // Variable para controlar los z-index de los cuadros de diálogo modales.
    modalesAbiertos++;

    openTransparent();

    // Se agregan las opciones al cuadro de diálogo
    if (options != null && options != undefined) {
        for (var p in options) {
            $(self.dialogObject).dialog('option', p, options[p]);
        }
    }

    // Se agrega el título, si es que hay uno
    if (titulo != null && titulo != undefined)
        $(self.dialogObject).dialog('option', 'title', titulo);

    // SE abre el cuadro de diálogo
    $(self.dialogObject).parent().css('z-index', 1000 + (modalesAbiertos * 20));
    $(self.dialogObject).dialog('open');
};

Modal.prototype.close = function (fn) {
    var self = this;
    try {
        if ($.isFunction(fn)) {
            self.fnClose = fn;
        }
        else {
            $(self.dialogObject).dialog('close');
        }

    } catch (err) { }
    
    self.posClose();
};

Modal.prototype.preClose = function () {
}

Modal.prototype.posClose = function () {
}

Modal.prototype.destroy = function () {
    var self = this;
    
    try {
        $(self.dialogObject).dialog('destroy');
    } catch (err) { }

    self.dialogObject = null;
    $('#' + self.divHijo).remove();
}

Modal.prototype.dispose = function () {
    var self = this;
    self.destroy();
}

function mostrarMensajeDialog(tituloMensaje, div, myOptions) {
    var miDialogo = new Modal();
    miDialogo.open(tituloMensaje, div, myOptions);
}

function openTransparent(fn) {
    if (fn != null && fn != undefined && fn > 0) {
        fondosAbiertos = fn;
    }
    else {
        fondosAbiertos++;
    }

    // Si es la primer tela que se abre
    // entonces se crea el div transparente..
    // Si no es la primer tela, entonces a la misma tela abierta se le incremente
    // su z-index, para posicionarlo un nivel más arriba
    if (fondosAbiertos == 1) {
        var bgdiv = $('<div>').attr({
            'class': 'bgtransparentBlanco',
            id: 'divbgtransparent'
        });
        $('body', top.document).append(bgdiv);
    }

    // Se posiciona la tela un nivel más arriba
    indexFondo = (1000 + (fondosAbiertos * 20)) - 10;

    var wscr = top.document.documentElement.scrollWidth;
    var hscr = top.getDocHeight();
    $('#divbgtransparent', top.document).css("width", wscr);
    $('#divbgtransparent', top.document).css("height", hscr);
    $("#divbgtransparent", top.document).css("z-index", indexFondo);
}

function closeTransparent() {

    //console.log('cerrando ' + fondosAbiertos);
    fondosAbiertos--;

    if (fondosAbiertos <= 0) {
        // Se elimina el fondo transparente
        $('.bgtransparentBlanco', top.document).remove();
    } else {
        openTransparent(fondosAbiertos);
    }
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

function getDocHeight() {
    var D = top.document;
    return Math.max(Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight,
			D.documentElement.clientHeight));
}

function resizeTela() {
    if (fondosAbiertos > 0) {
        var wscr = top.document.documentElement.scrollWidth;
        var hscr = top.getDocHeight();
        $('#divbgtransparent', top.document).css("width", wscr);
        $('#divbgtransparent', top.document).css("height", hscr);
    }
}