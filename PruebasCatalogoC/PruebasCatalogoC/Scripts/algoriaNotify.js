/****************************************************************************

Nombre      : algoriaNotify
Autor       : René Quintero Alvarez
Fecha       : 02/Sep/2013
Descripción : Permite crear un cuadro de diálogo tipo notificación.

Modo empleo :

var up = new AlgoriaUploader('dvContenedor');
up.setShowFileControl(false);  // Por default es true
up.create(url);

Dependencias: jQuery 1.4+
*****************************************************************************/

var aNotify = function () {
}

aNotify.show = function (type, message, position) {
    var aNot = new AlgoriaNotify();
    aNot.defaultLeft = 100;
    aNot.defaultTop = 0;
    aNot.defaultWidth = screen.width - 500;
    aNot.defaultHeight = 20;
    aNot.timeAutoClose = 5000; // 5 segundos para cerrarse automáticamente

    if (position == undefined || position == null || position == '') {
        aNot.setPosition('center-center');
    }
    aNot.setMessageType(type);
    aNot.show(message);

    return aNot;
}

aNotify.showInElement = function (type, element, message, autoClose, positionAt) {
    var aNot = new AlgoriaNotify();
    aNot.defaultWidth = 300;
    aNot.defaultHeight = 20;

    aNot.timeAutoClose = 10000; // 5 segundos para cerrarse automáticamente
    if (autoClose == false) {
        aNot.timeAutoClose = 0; // Se elimina autoClose
    }

    if (positionAt == undefined) {
        positionAt = 'left';
    }

    aNot.setMessageType(type);
    aNot.showInElement(element, message, positionAt);

    return aNot;
}

var AlgoriaNotify = function () {
    this.id = 'dvMessage' + new Date().getTime();
    this.message = '';
    this.functionOK = null;
    this.functionNo = null;
    this.functionCancel = null;

    //this.defaultWidth = 450;
    this.defaultLeft = 0;
    this.defaultTop = 0;
    this.defaultHeight = 60;

    // Tipos permitidos
    // success
    // error
    // warning
    // information
    // question
    // help
    this.messageType = 'information';

    // Posiciones soportadas son
    //  top-left
    //	top-center
    //  top-right
    //  center-left
    //	center-center
    //	center-right
    //	bottom-left
    //	bottom-center
    //	bottom-right
    this.position = 'top-left';

    // Variables del temporizador
    this.timeAutoClose = 0; // milisegundossegundos para cerrarse automáticamente, por default no se cierra en automático
    this.timeIn = null;
    this.timeOut = null;
    this.timeTimeOut = null;
    this.closeStarted = 0;
    this.transparency = 0;

    this.styleAttributeReaded = false;
    this.styleAttribute = '';

    this.objParent = null;
}

AlgoriaNotify.prototype.setMessageType = function (messageType) {
    var self = this;
    self.messageType = messageType;
}

AlgoriaNotify.prototype.setPosition = function (pos) {
    var self = this;
    self.position = pos;
}

AlgoriaNotify.prototype.setMessage = function (message) {
    var self = this;
    self.message = message;
}

AlgoriaNotify.prototype.setFunctionOK = function (func) {
    var self = this;
    self.functionOK = func;
}

AlgoriaNotify.prototype.setFunctionNo = function (func) {
    var self = this;
    self.functionNo = func;
}

AlgoriaNotify.prototype.setFunctionCancel = function (func) {
    var self = this;
    self.functionCancel = func;
}

AlgoriaNotify.prototype.createMessageContener = function (message, parent) {
    var self = this;

    var dv = document.createElement('div');
    dv.id = self.id;
    dv.innerHTML = message;

    self.objParent = null;
    if (parent != undefined && parent != null && parent != '') {
        self.objParent = document.getElementById(parent).parentNode;
    }

    if (self.objParent != null) {
        self.objParent.appendChild(dv);
    } else {
        document.body.appendChild(dv);
        self.objParent = document.body;
    }

    var dvClear = document.createElement('div');
    dvClear.setAttribute('style', 'clear:both;');

    dv.appendChild(dvClear);

    dv.setAttribute('class', 'aNotify ' + self.messageType);

    return dv;
}

AlgoriaNotify.prototype.showInElement = function (element, message, positionAt) {
    var self = this;

    // Verificar si existe el elmento indicado
    var elem = document.getElementById(element);

    // Se crea y se obtiene una referencia al div contenedor
    var dv = self.createMessageContener(message, element);

    var obj = self.getAbsoluteElementPosition(element);

    if (positionAt == undefined) {
        positionAt = 'bottom';
    }

    // Se asignan estilos con left y top = 0
    self.setStyle(0, 0, true);

    var x = 0;
    var y = 0;

    if (positionAt == 'top') {
        var posDiv = dv.scrollHeight;
        var heiMessage = posDiv + 23;

        x = obj.left;
        y = obj.top - heiMessage;

    } else if (positionAt == 'bottom') {
        var heiMessage = elem.scrollHeight; // Alto del elemento contenedor del mensaje
        heiMessage = heiMessage + 13;

        x = obj.left;
        y = obj.top + heiMessage;

    } else if (positionAt == 'left') {
        var widMessage = dv.scrollWidth + 2; // Ancho del elemento contenedor del mensaje

        // alert(widMessage);
        x = obj.left - widMessage - 32;
        y = obj.top + 2;

    } else if (positionAt == 'right') {
        var wid = elem.scrollWidth;
        wid += 32;

        x = (obj.left + wid);
        y = obj.top + 2;
    }

    var cla = dv.getAttribute('class');
    cla += ' show' + positionAt;

    dv.setAttribute('class', cla);

    self.setStyle(x, y, false);
    self.showCore();
}

AlgoriaNotify.prototype.show = function (message) {
    var self = this;

    var dv = self.createMessageContener(message);

    var heig = dv.style.height.replace('px', '');
    if (heig < self.defaultHeight) {
        heig = self.defaultHeight;
    }

    var x = self.defaultLeft;
    var y = self.defaultTop;

    var docSize = self.getDocumentSize();

    switch (self.position) {
        case 'top-left':
            //x = 100;
            //y = 100;
            break;
        case 'top-center':
            x = parseInt((docSize[0] - self.defaultWidth) / 2);
            break;
        case 'top-right':
            x = parseInt((docSize[0] - self.defaultWidth) - self.defaultLeft);
            break;
        case 'center-left':
            //x = 100;
            y = parseInt((docSize[1] - heig) / 2);
            break;
        case 'center-center':
            x = parseInt((docSize[0] - self.defaultWidth) / 2);
            y = parseInt((docSize[1] - heig) / 2);
            break;
        case 'center-right':
            x = parseInt((docSize[0] - self.defaultWidth) - self.defaultLeft);
            y = parseInt((docSize[1] - heig) / 2);
            break;
        case 'bottom-left':
            //x = 100;
            y = parseInt((docSize[1] - heig) - self.defaultTop);
            break;
        case 'bottom-center':
            x = parseInt((docSize[0] - self.defaultWidth) / 2);
            y = parseInt((docSize[1] - heig) - self.defaultTop);
            break;
        case 'bottom-right':
            x = parseInt((docSize[0] - self.defaultWidth) - self.defaultLeft);
            y = parseInt((docSize[1] - heig) - self.defaultTop);
            break;
    }

    // Se muestra en la posición indicada
    self.setStyle(x, y, true);
    self.showCore();
}

AlgoriaNotify.prototype.setStyle = function (left, top, fixed) {
    var self = this;

    var dv = document.getElementById(self.id);

    dv.setAttribute('style', 'visibility:hidden;');

    var pos = 'min-height:' + self.defaultHeight + 'px;width:' + self.defaultWidth + 'px;z-index:10;';
    pos += 'top:' + top + 'px;left:' + left + 'px;';

    var newstyle = self.getStyleOpacity(0);
    dv.setAttribute('style', pos + newstyle);

    if (fixed == true) {
        dv.style.position = 'fixed';
    } else {
        dv.style.position = 'absolute';
    }
}

AlgoriaNotify.prototype.showCore = function () {
    var self = this;

    var dv = document.getElementById(self.id);
    dv.onclick = function () { self.close(); };

    //dv.setAttribute('style', 'visibility:visible;');
    dv.style.visibility = 'visible';

    self.timeIn = setInterval(function () {
        self.fadeIn()
    }, 10);

    if (self.timeAutoClose > 0) {
        self.timeTimeOut = setTimeout(function () {
            self.close();
        }, self.timeAutoClose);
    }

    // Almacenamos en estilo actual del diálogo, porque lo usaremos para modificarlo por código
    self.styleAttribute = dv.getAttribute('style');

    // Se ha mostrado el mensaje
    self.closeStarted = 0;
}

AlgoriaNotify.prototype.close = function () {
    var self = this;

    if (self.closeStarted == 1) {
        return;
    }

    clearTimeout(self.timeOut);

    self.closeStarted = 1;
    self.timeOut = setInterval(function () { self.fadeOut() }, 10);
}

AlgoriaNotify.prototype.getDocumentSize = function () {
    var Tamanyo = [0, 0];
    if (typeof window.innerWidth != 'undefined') {
        Tamanyo = [
				window.innerWidth,
				window.innerHeight
			];
    }
    else if (typeof document.documentElement != 'undefined'
			  && typeof document.documentElement.clientWidth !=
			  'undefined' && document.documentElement.clientWidth != 0) {
        Tamanyo = [
				document.documentElement.clientWidth,
				document.documentElement.clientHeight
			];
    }
    else {
        Tamanyo = [
				document.getElementsByTagName('body')[0].clientWidth,
				document.getElementsByTagName('body')[0].clientHeight
			];
    }
    return Tamanyo;
}

AlgoriaNotify.prototype.showed = function () {
}

// var transparency = 0;
// var timeIn = null;
// var timeOut = null;		
// var closeStarted = 0;
AlgoriaNotify.prototype.fadeIn = function () {

    var self = this;

    //seteamos al div como objeto para poder usarlo con su ID
    obj = document.getElementById(self.id);

    //incrementamos el valor
    self.transparency += 4;
    var newStyle = self.getStyleOpacity(self.transparency);

    obj.setAttribute('style', self.styleAttribute + newStyle);

    //si termino la trnsicion borramos el intervalo
    if (self.transparency >= 100) {
        clearInterval(self.timeIn);
        self.showed();
    }
}

AlgoriaNotify.prototype.fadeOut = function (id) {

    var self = this;

    //seteamos al div como objeto para poder usarlo con su ID
    obj = document.getElementById(self.id);

    if (obj == null || obj == undefined) {
        return;
    }

    //decrementamos el valor
    self.transparency -= 4;
    var newStyle = self.getStyleOpacity(self.transparency);

    obj.setAttribute('style', self.styleAttribute + newStyle);

    //si termino la trnsicion borramos el intervalo
    if (self.transparency <= 0) {
        self.transparency = 0;
        clearInterval(self.timeOut);
        self.closeStarted = 0;
        var dv = document.getElementById(self.id);

        self.objParent.removeChild(dv);
        self.objParent = null;
    }
}

AlgoriaNotify.prototype.getStyleOpacity = function (transparency) {
    var newStyle = 'alpha(opacity=' + transparency + ');';
    newStyle += 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + transparency + ');';
    newStyle += '-moz-opacity:' + transparency / 100 + ';';
    newStyle += '-khtml-opacity:' + transparency / 100 + ';';
    newStyle += 'opacity:' + transparency / 100 + ';';

    return newStyle;
}

AlgoriaNotify.prototype.getAbsoluteElementPosition = function (el) {

    //try {
    var element = null;

    if (typeof el == "string") {
        element = document.getElementById(el)
    } else {
        element = el;
    }

   // console.log(element);
    if (element == null) return { top: 0, left: 0 };

    var y = 0;
    var x = 0;
    var h = 0;
    var w = 0;

    // element = element.offsetParent;

    // while (element.offsetParent) {
    x += element.offsetLeft;
    y += element.offsetTop;
    // }

    h = element.style.height.replace('px', '');
    //if (element.scrollHeight) { h = element.scrollHeight; }
    //else if (element.style.pixelHeight) { h = element.style.pixelHeight; }

    if (element.scrollWidth) { w = element.scrollWidth; }
    else if (element.style.pixelWidth) { w = element.style.pixelWidth; }

    return { top: y, left: x, height: h, width: w };

    // } catch (err) {
    //   return { top: 0, left: 0, height: 0, width: 0 };
    //}
}
