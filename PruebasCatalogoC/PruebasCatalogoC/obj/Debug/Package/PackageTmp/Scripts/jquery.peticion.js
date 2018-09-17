var loadingRequest = false;
var peticiones = 0;

function Peticion() {
    this.url = null;
    this.json = null;
    this.addwait = true;
    this.datatype = null;
    this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    this.async = true;
};

/**
* Evento solicitar
* 
* @json
* json a mostrar
*/

Peticion.prototype.solicitar = function (json) {

    var objself = this;
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
        objself.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    } else {
        objself.contentType = 'application/json; charset=utf-8';
        objself.json = JSON.parse(this.json);
        objself.json = JSON.stringify(this.json);
    }

    if (objself.addwait == true) {
        loading();
    }

    var myjson = objself.json;
    $.ajax({
        url: objself.url,
        dataType: "json",
        contentType: objself.contentType,
        data: myjson,
        type: "post",
        async: objself.async,
        success: function (salida, jqXHR, textStatus) {


            if (salida == null)
                objself.error(salida, jqXHR, textStatus);
            else if (salida[0] == null) {
                objself.error(salida, jqXHR, textStatus);
                //objself.error("Salida nula", jqXHR, textStatus);
            }
            else if (salida[0].Clave == 0)
                objself.posSolicitar(salida);
            else
                objself.error(salida, jqXHR, textStatus);

            // Cerrar la tela
            if (objself.addwait == true) {
                closeLoading();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            /*console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);*/
            var salida = [{ "clave": -1, "descripcion": "error desconocido", "MensajeUsuario": jqXHR}];
            objself.error(salida, jqXHR, textStatus, errorThrown);

            // Cerrar la tela
            if (objself.addwait == true) {
                closeLoading();
            }
        }
    });
};

Peticion.prototype.solicitarDefault = function () {
    var objself = this;

    if (JSON.stringify(this.json).indexOf('\\"') == -1) {
        this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    } else {
        this.contentType = 'application/json';
        this.json = JSON.parse(this.json);
        this.json = JSON.stringify(this.json);
    }

    if (objself.addwait == true) {
        loading();
    }

    $.ajax({
        url: objself.url,
        dataType: objself.datatype,
	    contentType: objself.contentType,
        data: objself.json,
        type: "post",
        async: objself.async,
        success: function (salida) {

            if (salida == null)
                objself.error("Salida nula");
            else 
                objself.posSolicitar(salida);

            // Cerrar la tela
            if (objself.addwait == true) {
                closeLoading();
            }
        },
        error: function () {

            var salida = [{ "clave": -1, "descripcion": "error desconocido"
            }];
            objself.error(salida);

            // Cerrar la tela
            if (objself.addwait == true) {
                closeLoading();
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

function loading() {
    
    // Se incrementa el número de peticiones
    peticiones++;

    //openTransparent();

    // dimensiones de la ventana del explorer
    var wscr = $(window).width();
    var hscr = $(window).height();

    // obtener posicion central
    var mleft = (wscr - 80) / 2;
    var mtop = (hscr - 76) / 2;

    if (peticiones == 1) {
        var temp = "<div id='divLoading' style=\"position:absolute; left:" + mleft + "px; top:" + mtop + "px; background:transparent;z-index:10000; \">";
        temp += "   <img src=\"" + '' + "/Content/images/img_trans.gif\" width=\"1px\"  height=\"1px\" style=\"width: 80px; height: 76px; background: url(" + '' + "/Content/images/loadinfo.gif) -1190px -120px;\" />";
        temp += "</div>";

        $('body').append(temp);
    }

    loadingRequest = true;
}

function closeLoading() {
    peticiones--;

    //closeTransparent();

    if (peticiones == 0) {
        peticiones = 0;
        loadingRequest = false;

        // Se elimina el div central de donde esté
        $('#divLoading').remove();
    }
}

function sleep(millisegundos) {
    var inicio = new Date().getTime();
    while ((new Date().getTime() - inicio) < millisegundos) {
    }
}