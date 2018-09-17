
/****************************************************************
*********** Clase para el manejo de las solicitudes *************
/****************************************************************/
var divContenedorMensajes = 'dvConts';

var SolicitudCuentaManager = function () { }

SolicitudCuentaManager.crearTablaHTMLSubAreas = function (claveSolicitud, sPadre) {
    var obj = {};
    obj.solicitud = claveSolicitud;

    var self = new Contenedor();
    var arr = null;
    if (sPadre) {
        arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/GetSubAreasDeSolicitudPadre', obj, false); 
    } else {
        arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/GetSubAreasDeSolicitud', obj, false); 
    }

    if (arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    if (arr.length > 0) {
        // Creamos la tabla de datos
        var str = '<table class="llsortable">';
        str += '<tr>';
        str += '<th>UN</th>';
        str += '<th>Proyecto</th>';
        str += '<th>Área</th>';
        str += '<th>Subarea</th>';
        str += '</tr>';

        for (var i = 0, len = arr.length; i < len; i++) {
            str += '<tr>';
            str += '<td>' + arr[i].UnidadNegocioTxt + '</td>';
            str += '<td>' + arr[i].OMProyectoTxt + '</td>';
            str += '<td>' + arr[i].AreaTxt + '</td>';
            str += '<td>' + arr[i].Descripcion + '</td>';
            str += '</tr>';
        }
        str += '</table>';

        return str;
    } else {
        return '';
    }
}

SolicitudCuentaManager.getSistemasSolicitudCambio = function (claveSolicitud) {
    var obj = {};
    obj.solicitud = claveSolicitud;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Solicitudes/Cambios/GetSistemasDeSolicitudCambioCuenta', obj, false);
    if (arr == null || arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    return arr;
}

SolicitudCuentaManager.getSistemasSolicitud = function (claveSolicitud) {
    var obj = {};
    obj.solicitud = claveSolicitud;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/GetSistemasDeSolicitud', obj, false);
    if (arr == null || arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    return arr;
}

SolicitudCuentaManager.crearTablaHTMLSistemas = function (arris) {

    // Creamos la tabla de datos
    var str = '<table class="llsortable">';
    str += '<tr>';
    str += '<th style="width:20%;">Sistema</th>';
    str += '<th style="width:20%;">Rol</th>';
    str += '<th style="width:50%;">Descripci&oacute;n</th>';
    str += '<th style="width:10%;">&nbsp;</th>';
    str += '</tr>';

    var arr = [];
    for (var i = 0, len = arris.length; i < len; i++) {
        if (arris[i].TipoSistema == 2) {
            arr.push(arris[i]);
        }
    }

    for (var i = 0, len = arr.length; i < len; i++) {

        //var rolesStr = '';
        if (arr[i].Roles != undefined && arr[i].Roles != null && arr[i].Roles.length > 0) {
            for (var j = 0, len1 = arr[i].Roles.length; j < len1; j++) {
                //rolesStr += (rolesStr == '') ? arr[i].Roles[j].Descripcion : ', ' + arr[i].Roles[j].Descripcion;
                str += '<tr>';
                str += '<td>' + arr[i].SistemaDesc + '</td>';
                str += '<td>' + arr[i].Roles[j].Rol + '</td>';

                if (arr[i].Roles[j].Descripcion != null) {
                    str += '<td>' + arr[i].Roles[j].Descripcion + '(' + arr[i].Roles[j].Rol + ')</td>';
                } else {
                    str += '<td>[' + arr[i].Roles[j].Clave + ' - Sin Descripción]</td>';
                }

                str += '<td style="text-align:center;">';
                str += '    <a name="aRol" href="javascript:void();" cve="' + arr[i].Roles[j].Clave + '">Atributos</a>&nbsp;';
                str += '</td>';
                str += '</tr>';
            }
        } else {
            str += '<tr>';
            str += '<td>' + arr[i].SistemaDesc + '</td>';
            str += '<td colspan="3">&nbsp;</td>';
            str += '</tr>';
        }
    }

    str += '</table>';

    return str;
}

SolicitudCuentaManager.loadDatosExtrasParaEdicionForm = function (objParams) {

    var opts = {};
    opts.sistema = objParams.sistema;
    opts.esSoloLectura = false;
    opts.etapaActual = objParams.etapaActual;
    opts.flujoSistema = objParams.flujoSistemaId;

    if (objParams.arrayLocal == null)
        objParams.arrayLocal = new Array();

    var arrLocal = objParams.arrayLocal;

    opts.tipoSistema = 2; // self.getProperty('TipoSistema');

    var ex = arrLocal.find(function (el) { return el.Sistema == objParams.sistema; });
    opts.esDesdeSistema = (ex == undefined || ex == null);
    opts.buscarDatosEnServidor = !(ex != undefined && ex != null && ex.DatosExtras != null && ex.DatosExtras.length > 0);

    if (ex == undefined || ex == null) {
        opts.sistemasList = [];
        opts.sistemasList.push({ Sistema: objParams.sistema });
    } else {
        opts.sistemasList = [];
        opts.sistemasList.push(ex);
    }

    SolicitudCuentaManager.loadDatosExtrasForm(opts, function (arr) {
        if (objParams.fnCallback) {
            objParams.fnCallback(arr);
        }
    }, objParams.tituloForm);
};

SolicitudCuentaManager.loadDatosExtrasForm = function (defOpts, fnPosAceptar, titulo) {

    var opts = {
        esDesdeSistema: false,
        esSoloLectura: false,
        sistema: null,
        flujoSistema: null,
        buscarDatosEnServidor: true,
        etapaActual: '',
        cuentaId: defOpts.cuentaId
        //preguntas: null,
        //tipoSistema: '2'  // Pongo por default al tipo "SISTEMA"
    };

    $.merge(defOpts, opts);

    var avDatosExtras = null;
    var frmDatosExtras = null;
    titulo = (titulo == undefined || titulo == '') ? 'Datos extras' : titulo;
    if (avDatosExtras == null) {
        avDatosExtras = new AlgoriaVentana();
        avDatosExtras.applyWindowAppearance = false;
        avDatosExtras.loadAsDialog('', urlMain + '/Solicitudes/Solicitud/DatosExtraSistemaForm');

        dialogOptions = { width: 600, height: 400 };
        avDatosExtras.openDialog(titulo, dialogOptions);

        frmDatosExtras = new DatosExtraSistemaForm();
        frmDatosExtras.sistema = defOpts.sistema;
        frmDatosExtras.flujoSistema = defOpts.flujoSistema;
        frmDatosExtras.esDesdeSistema = defOpts.esDesdeSistema;
        frmDatosExtras.esSoloLectura = defOpts.esSoloLectura;
        frmDatosExtras.sistemasList = defOpts.sistemasList;
        frmDatosExtras.buscarDatosEnServidor = defOpts.buscarDatosEnServidor;
        frmDatosExtras.tipoSistema = defOpts.tipoSistema;
        frmDatosExtras.etapaActual = defOpts.etapaActual;
        frmDatosExtras.loginId = defOpts.loginId;
        //frmDatosExtras.preguntas = defOpts.preguntas;

        frmDatosExtras.posAceptar = function (arr) {
            //preguntasSistema = arr;
            avDatosExtras.closeDialog();
            avDatosExtras.dispose();
            avDatosExtras = null;

            if (fnPosAceptar) {
                fnPosAceptar(arr);
            }
        }
        frmDatosExtras.salir = function (arr) {
            avDatosExtras.closeDialog();
            avDatosExtras.dispose();
            avDatosExtras = null;
        }
        frmDatosExtras.inicializa();
    }
};

SolicitudCuentaManager.mostrarDescripcionLargaRol = function (claveRol) {
    var obj = {};
    obj.clave = claveRol;

    var self = new Contenedor();
    var r = self.doJsonRequest(urlMain + '/Rol/GetRolPorClave', obj, false);
    if (r.ErrorNumber != undefined || r.DescripcionLarga == null) {
        r = {};
        r.DescripcionLarga = 'No hay información disponible';
    }

    $('#' + divContenedorMensajes).remove();

    var divs = '<div id="' + divContenedorMensajes + '" style="width:100%;height:100%;display:none;">' +
                       '<div id="dvFormaDetalleError" style="width:100%;height:100%;">' +
                           '<div id="dvInfoRolDescL" style="padding:15px;">' +
                           '<textarea style="height:530px;width:740;line-height: 1.5;" readonly>' + r.DescripcionLarga + '</textarea>' +
                           '</div>' +
                       '</div>' +
                    '</div>';

    $('body').append(divs);

    dialogOptions = { width: 750, height: 600 };
    dlgModal = new Modal('Rol', divContenedorMensajes, dialogOptions);
    dlgModal.close(function () {
        //dlgModal.destroy();
    });
    dlgModal.open();
}

SolicitudCuentaManager.validarConflitosDeRoles = function (emp, roles, rolesBaja) {
    var obj = {};
    obj.empleado = emp;
    obj.roles = roles;
    //obj.rolesBaja = rolesBaja;

    var a = 0;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/ValidarConflictosEnRoles', obj, true);

    if (a == null || arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    return arr;
}

SolicitudCuentaManager.mostrarConflitosDeRoles = function (solicitud) {
    var obj = {};
    obj.solicitud = solicitud;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/GetConflictosEnRoles', obj, true);
    if (arr == null || arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    SolicitudCuentaManager.mostrarTablaHTMLConflictoDeRoles(arr);
}

SolicitudCuentaManager.mostrarTablaHTMLConflictoDeRoles = function (arr) {

    var str = '<table class="llsortable">';
    str += '<tr>';
    str += '<th style="width:20%;">Conflicto</th>';
    str += '<th style="width:40%;">Descripci&oacute;n</th>';
    str += '<th style="width:40%;">Control compensatorio</th>';
    str += '</tr>';

    for (var i = 0, len = arr.length; i < len; i++) {
        //rolesStr += (rolesStr == '') ? arr[i].Roles[j].Descripcion : ', ' + arr[i].Roles[j].Descripcion;
        str += '<tr>';
        str += '<td>' + arr[i].ConflictoID + '</td>';
        str += '<td>' + arr[i].Descripcion + '</td>';
        str += '<td>' + arr[i].ControlCompensatorioDesc + '</td>';
        str += '</tr>';
    }

    str += '</table>';

    $('#' + divContenedorMensajes).remove();

    var divs = '<div id="' + divContenedorMensajes + '" style="width:100%;height:100%;display:none;">' +
                       '<div id="dvConflictosRol" class="gridPaginado" style="width:100%;height:100%;">' +
                           '<div class="generalGrid" style="padding:15px;">' +
                                '<div id="dvConfl" class="container">' +
                                    str +
                                '</div>' +
                           '</div>' +
                       '</div>' +
                    '</div>';

    $('body').append(divs);

    dialogOptions = { width: 750, height: 600 };
    dlgModal = new Modal('Conflictos', divContenedorMensajes, dialogOptions);
    dlgModal.close(function () {
        //dlgModal.destroy();
    });
    dlgModal.open();
}

SolicitudCuentaManager.getDatosExtrasDeSolicitud = function (claveSolicitud) {
    var obj = {};
    obj.solicitud = claveSolicitud;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Solicitudes/Solicitud/GetDatosExtrasParaTabla', obj, false);

    if (arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    return arr;
}

SolicitudCuentaManager.crearTablaDatosExtras = function (listaObj, crearLigaEdicionDatosExtras) {
    // Creamos la tabla de datos
    var str = '<table class="llsortable">';
    str += '<tr>';
    str += '<th>Sistema</th>';
    str += '<th>Pregunta</th>';
    str += '<th>Respuestas</th>';
    if (crearLigaEdicionDatosExtras == true) {
        str += '<th>Editar</th>';
    }
    str += '</tr>';

    if (listaObj.length > 0) {
        for (var i = 0, len = listaObj.length; i < len; i++) {

            var dExt = listaObj[i].DatosExtras;
            if (dExt != null && dExt.length > 0) {

                for (var j = 0, lenJ = dExt.length; j < lenJ; j++) {
                    str += '<tr>';
                    str += '<td>' + listaObj[i].SistemaDesc + '</td>';
                    str += '<td>' + dExt[j].Etiqueta + '</td>';
                    str += '<td>' + dExt[j].RespuestaDesc + '</td>';

                    if (crearLigaEdicionDatosExtras == true) {
                        if (j == 0) {
                            str += '<td><a href="javascript:void();" aDExt="' + listaObj[i].Sistema + '">Datos extras</a></td>';
                        } else {
                            str += '<td>&nbsp;</td>';
                        }
                    }

                    str += '</tr>';
                }
            } else {
                str += '<tr>';
                str += '<td>' + listaObj[i].SistemaDesc + '</td>';
                str += '<td></td>';
                str += '<td></td>';

                if (crearLigaEdicionDatosExtras == true) {
                    str += '<td><a href="javascript:void();" aDExt="' + listaObj[i].Sistema + '">Datos extras</a></td>';
                }

                str += '</tr>';
            }
        }
        str += '</table>';
    } else {
        str += '<td colspan="3">No hay datos extras para esta solicitud</td>';
    }

    return str;
}

/****************************************************************
*************** Clase para el manejo de los flujos **************
/****************************************************************/

var FlujoManager = function () {
}

FlujoManager.showLog = function (flujo) {
    $('#' + divContenedorMensajes).remove();

    var divs = '<div id="' + divContenedorMensajes + '" style="width:100%;height:100%;display:none;">' +
                       '<div id="dvFormaDetalleError" style="width:100%;height:100%;">' +
                           '<div id="dvBitacora" style="padding:15px;">' +
                           '</div>' +
                       '</div>' +
                    '</div>';

    $('body').append(divs);

    $('#dvBitacora').html(FlujoManager.getLogs(flujo));

    dialogOptions = { width: 650, height: 500 };
    dlgModal = new Modal('Bitacora', divContenedorMensajes, dialogOptions);
    dlgModal.close(function () {
        //dlgModal.destroy();
    });
    dlgModal.open();
}

FlujoManager.showComments = function (flujo) {
    $('#' + divContenedorMensajes).remove();

    var divs = '<div id="' + divContenedorMensajes + '" style="width:100%;height:100%;display:none;">' +
                       '<div id="dvFormaDetalleError" style="width:100%;height:100%;">' +
                           '<div id="dvBitacora" style="padding:15px;">' +
                           '</div>' +
                       '</div>' +
                    '</div>';

    $('body').append(divs);

    $('#dvBitacora').html(FlujoManager.getComments(flujo));

    dialogOptions = { width: 650, height: 500 };
    dlgModal = new Modal('Comentarios', divContenedorMensajes, dialogOptions);
    dlgModal.close(function () {
        //dlgModal.destroy();
    });
    dlgModal.open();
}

FlujoManager.getComments = function (flujo) {

    var self = new Contenedor();
    var objeto = self.doJsonRequest(urlMain + '/Flujo/GetFlujoComentarioListPorFlujo/' + flujo);
    if (objeto == null) {
        objeto = new Array();
    }
    
     var htmlComentarios = new StringBuilder();
    for (i = 0; i < objeto.length; i++) {
        htmlComentarios.append('<label> Comment from: ' + objeto[i].UsuarioDesc + ' el ' + parseDateStringToString(objeto[i].Fecha) + '</label><br>');
        htmlComentarios.append('<label> <b>Process number: ' + objeto[i].Folio + '</b></label><br>');
        htmlComentarios.append('<label> Status: ' + objeto[i].Actividad + ' ' + objeto[i].ActividadDesc + '</label><br>');
        htmlComentarios.append('<label>' + objeto[i].Comentario + '</label><br>');
        htmlComentarios.append('<label>---------------------------------------------------------------------</label><br>');
    }

    return htmlComentarios.toString();
}

FlujoManager.getLogs = function (flujo) {
    var self = new Contenedor();
    var bitacora = self.doJsonRequest(urlMain + '/Flujo/GetHistorialPorClaveFlujo/' + flujo);
    if (bitacora == null) {
        bitacora = new Array();
    }

    var htmlComentarios = new StringBuilder();
    for (i = 0; i < bitacora.length; i++) {
        var accion = bitacora[i].Accion;
        if (accion == 'E') {
            accion = 'Enviar';
        }
        else if (accion == 'A') {
            accion = 'Aceptar';
        }
        else if (accion == 'R') {
            accion = 'Rechazar';
        }

        htmlComentarios.append('<label> Fecha Hora: ' + parseDateStringToString(bitacora[i].FechaActualizacion) + '</label>&emsp;&emsp;<b>Folio: ' + bitacora[i].Folio + '</b><br>');
        //htmlComentarios.append('<label> Folio: ' + bitacora[i].Folio + '</label><br>');
        htmlComentarios.append('<label> Usuario: ' + bitacora[i].UsuarioLog + '</label><br>');
        htmlComentarios.append('<label> Accion: ' + accion + '</label><br>');
        htmlComentarios.append('<label> Estatus inicial: ' + bitacora[i].Actividad + '</label><br>');
        htmlComentarios.append('<label> Estatus final: ' + bitacora[i].ActividadSalida + '</label><br>');
        htmlComentarios.append('<label>---------------------------------------------------------------------</label><br>');
    }

    return htmlComentarios.toString();
}


/****************************************************************
*************** Clase para el manejo de los empleados **************
/****************************************************************/
var EmpleadoManager = function () {
}

EmpleadoManager.getMensajeCaracteristicas = function (empleado) {
    var obj = {};
    obj.empleado = empleado;

    var self = new Contenedor();
    var arr = self.doJsonRequest(urlMain + '/Empleado/GetCaracteristicasPorEmpleado', obj, false);
    if (arr == null || arr.ErrorNumber != undefined) {
        arr = new Array();
    }

    var mensaje = '';
    for (var i = 0, len = arr.length; i < len; i++) {
        var o = arr[i];

        if (o.Mostrar == '1') {
            mensaje += '<b>'+o.Descripcion+'</b>';
            mensaje += '<br/>&emsp;' + o.TextoSolicitudes+'<br/><br/>';
        }
    }

    return mensaje;
}

EmpleadoManager.modificarDialogoDeCaracteristicas = function () {
    // modificar el diálogo mostrado
    $('div.dialogo').attr('style', 'width:80%;position:relative;margin:auto;');
    $('div.iconodialogo').hide();
    $('div.mensajedialogo').attr('style', 'padding:20px;width:90%;');
}