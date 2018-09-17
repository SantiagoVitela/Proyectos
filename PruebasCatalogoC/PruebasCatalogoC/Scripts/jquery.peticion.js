var loadingRequest = false;
var peticiones = 0;

var Peticion = function() {
    this.url = null;
    this.json = null;
    this.addwait = true;
    this.datatype = null;
    this.action = null;
    this.Action = null;
    this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    this.async = true;
};

function Action() {
    this.Accion = null;
};

/**
* Evento solicitar
* 
* @json
* json a mostrar
*/

Peticion.prototype.solicitar = function (json) {

    var objself = this;
    if (objself.addwait == true) {

        // Se abre la tela transparente
        loading();
    }

    if (json != null) {
        this.json = json;
    }

    if (this.datatype == null)
        this.solicitarJson();
    else if (this.datatype == 'json')
        this.solicitarJson();
    else
        this.solicitarDefault();
};

Peticion.prototype.solicitarJson = function () {
    var objself = this;
    if (JSON.stringify(this.json).indexOf('\\"') == -1) {
        this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        $.extend(true, this.json, this.Action);
    } else {
        this.contentType = 'application/json; charset=utf-8';
        this.json = JSON.parse(this.json);
        $.extend(true, this.json, this.Action);
        this.json = JSON.stringify(this.json);
    }

    // SE incrementa el número de peticiones
    //peticiones++;

    //console.log(json);

    var myjson = this.json;
    var peticion = $.ajax({
        url: objself.url,
        dataType: "json",
        contentType: objself.contentType,
        data: myjson,
        type: "post",
        async: objself.async,
        success: function (salida) {

            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }

            // función success configurada
            if (salida == null || salida.ErrorNumber != undefined && salida.ErrorNumber != 0) {
                objself.error(salida);
            } else {
                objself.posSolicitar(salida);
            }
        },
        error: function (request, ajaxOptions, sald) {

            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }
            // Función de error configurada
            objself.error(sald);
        },
        complete: function () {
            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }
        }
    });
};

Peticion.prototype.solicitarDefault = function () {
    var objself = this;

    if (objself.json != null && objself.json != undefined) {
        if (JSON.stringify(objself.json).indexOf('\\"') == -1) {
            objself.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            $.extend(true, objself.json, objself.Action);
        } else {
            objself.contentType = 'application/json; charset=utf-8';
            objself.json = JSON.parse(objself.json);
            $.extend(true, objself.json, objself.Action);
            objself.json = JSON.stringify(objself.json);
        }
    }
    var myjson = objself.json;

    var peticion = $.ajax({
        url: objself.url,
        dataType: objself.datatype,
        contentType: objself.contentType,
        data: myjson,
        type: "post",
        async: objself.async,
        success: function (salida) {

            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }
            // función success configurada
            if (salida == null || salida.ErrorNumber != undefined && salida.ErrorNumber != 0)
                objself.error(salida);
            else
                objself.posSolicitar(salida);
        },
        error: function (request, ajaxOptions, sald) {

            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }

            // Función de error configurada
            objself.error(sald);
        },
        complete: function () {
            if (objself.addwait == true) {
                closeLoading();
                objself.addwait = false;
            }
        }
    });
};

/**
* Evento posSolicitar
* 
*/
Peticion.prototype.posSolicitar = function (data) {
};

/**
* Evento error
* 
*/
Peticion.prototype.error = function (data) {
};

Peticion.isLoading = function() {
    
    //    console.log('inicio pet: ' + peticiones);
    if (loadingRequest == null) {
        return false;
    }
    return loadingRequest;
}

function loading() {

    // Se incrementa el número de peticiones
    peticiones++;

    openTransparent();

    $("#divbgtransparent").addClass('imgloader');

    loadingRequest = true;
}

function closeLoading() {
    peticiones--;
    //console.log('Peticiones abiertas = ', peticiones);

    closeTransparent();

    if (peticiones < 1) {
        peticiones = 0;
        loadingRequest = false;

        $("#divbgtransparent").removeClass('imgloader');
    }
}

function sleep(millisegundos) {
    var inicio = new Date().getTime();
    while ((new Date().getTime() - inicio) < millisegundos) {
    }
}