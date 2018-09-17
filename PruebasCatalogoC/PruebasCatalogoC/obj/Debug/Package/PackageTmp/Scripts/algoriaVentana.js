/********************************************************************
*   algoriaVentana.js
*   Autor   :   Rene Quintero Alvarez
*   Fecha   :   22/Octubre/2012
*   Desc.   :   Crea una ventana con el contenido pasado como parámetro.
                
********************************************************************/

var AlgoriaVentana = function (title) {
    this.visibility = 'visible'; //hidden
    this.applyWindowAppearance = true;

    this.title = title;
    this.url = '';
    this.data = {};
    this.isModal = false;
    this.modalDialog = null;

    this.cID = 'dvWND' + new Date().getTime();
    this.parentContainer = 'body';

    this.divID = '';
    this.divIdGeneratedHere = false;
}

AlgoriaVentana.prototype.getParentContainer = function () {
    var self = this;
    if (self.parentContainer != 'body')
        return '#' + self.parentContainer;

    return self.parentContainer;
}

AlgoriaVentana.prototype.setParentContainer = function (id) {
    var self = this;
    if (id == null || id == undefined) {
        self.parentContainer = 'body';
    } else {
        self.parentContainer = id;
    }
}

AlgoriaVentana.prototype.load = function (divID, url, data) {

    var self = this;
    self.url = url;
    self.data = data;

    // Crear un div en caso de que el parámetro divID venga vacío o nullo o indefinido
    if (divID == undefined || divID == null || divID == '') {
        divID = 'divID' + new Date().getTime();
        var sdiv = '<div id="' + divID + '"></div>';
        $('body').append(sdiv);
        self.divIdGeneratedHere = true;
    }

    // Se guarda el divID
    self.divID = divID;

    var peti = new Peticion();
    peti.url = url;
    peti.datatype = 'html';
    //peti.contenType = 'json';
    peti.json = self.data;
    peti.async = false;
    peti.posSolicitar = function (response) {
        self.setContent(divID, response);
    };
    peti.solicitar();
};

AlgoriaVentana.prototype.setContent = function (divID, content) {

    var self = this;
    var strHTML = '';
    if (self.applyWindowAppearance == true) {
        strHTML = '<div id="' + self.cID + '">' +
                    '<div class="ventana">' +
                        '<div class="titulo">' +
                            '<div class="etiquetatitulo">' + self.title + '</div>' +
                            '<div class="ayudaventana">' +
                                '<input type="button" class="iconayudaventana" />' +
                            '</div>' +
                        '</div>' +
                        '<div class="contenidoventana">' + content + '</div>' +
                    '</div><br/>';
    } else {

        strHTML = '<div id="' + self.cID + '">' +
                    content +
                  '</div>';
    }

    self.setParentContainer(divID);
    $(self.getParentContainer()).html(strHTML);

    strHTML = '';

    self.applyVisibility();
}

AlgoriaVentana.prototype.applyVisibility = function () {

    var self = this;
    if (self.visibility == 'hidden') {
        $('#' + self.cID).css('display', 'none');
    } else {
        $('#' + self.cID).css('display', 'block');
    }
}

/********************************************************************/
/*************** Metodos para manejar el diálogo ********************/
AlgoriaVentana.prototype.loadAsDialog = function (divID, url, data) {
    var self = this;
    self.isModal = true;

    // Se crea el diálogo sobre el div indicado
    // Si el div indicado viene vacío o null, entonces se crea un div al vuelo
    // y se activa la opción destroyOnClose, la cuál hace que el diálogo se destruya por completo
    // al presionar la tecla ESC o cerrarlo de la esquina (x)
    self.modalDialog = new Modal(self.title, divID);
    self.load(self.modalDialog.id, url, data);
}

AlgoriaVentana.prototype.openDialog = function (title, options) {
    var self = this;
    if (self.isModal == true) {
        self.modalDialog.open(title, options);
    }
}

AlgoriaVentana.prototype.closeDialog = function (fn) {
    var self = this;
    if (self.isModal == true) {
        self.modalDialog.close(fn);
    }
    self.posClose();
}

AlgoriaVentana.prototype.posClose = function () { }

AlgoriaVentana.prototype.destroyDialog = function () {
    var self = this;
    if (self.isModal == true) {
        self.modalDialog.destroy();
    }
}
/*************** Metodos para manejar el diálogo ********************/
/********************************************************************/

AlgoriaVentana.prototype.dispose = function () {
    var self = this;
    if (self.modalDialog != null)
        self.modalDialog.destroy();

    if (self.divIdGeneratedHere == true) {
        $('#' + self.divID).remove();
    }
    self.modalDialog = null;
}
