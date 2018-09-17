/*
* 
* Empieza la clase para el ordenamiento del grid
* 
*/
var ctrl = false;
var shift = false;
function lazysorttable(divName, grid) {
    this.div = document.getElementById(divName);
    this.grid = grid;
}

lazysorttable.makeGridSortable = function (myGrid) {
    this.grid = myGrid;
},

lazysorttable.prototype.init = function () {

    if (this.done)
        return;
    this.done = true;
    this.makeSortable(this.div.getElementsByTagName('table')[0]);
};

lazysorttable.prototype.init2 = function () {
    if (!document.createElement || !document.getElementsByTagName)
        return;
    this.makeSortable(this.div.getElementsByTagName('table')[0]);
};

lazysorttable.prototype.makeSortable = function (table) {
    this.headrow = table.tHead.rows[0].cells;
    var objSortable = this;
    var total = 0;
    for (var i = 0; i < this.headrow.length; i++) {
        total = this.headrow.length;
        this.headrow[i].sorttable_tbody = table.tBodies[0];
        dean_addEvent(this.headrow[i], "click", function (e) {
            if (this.id.indexOf("_nosort") != -1) {
                return;
            }
            objSortable.grid.ir_a_pagina_ordenada(this.id.replace(this.name, ''), total);
        });
    }
};

function dean_addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else {
        // assign each event handler a unique ID
        if (!handler.$$guid)
            handler.$$guid = dean_addEvent.guid++;
        // create a hash table of event types for the element
        if (!element.events)
            element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            // store the existing event handler (if there is one)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = handleEvent;
    }
};
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    }
};

function handleEvent(event) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};

function fixEvent(event) {
    // add W3C standard event methods
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function () {
    this.returnValue = false;
};
fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
}

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
* forEach, version 1.0 Copyright 2006, Dean Edwards License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
    Array.forEach = function (array, block, context) {
        for (var i = 0; i < array.length; i++) {
            block.call(context, array[i], i, array);
        }
    };
}

// generic enumeration
Function.prototype.forEach = function (object, block, context) {
    for (var key in object) {
        if (typeof this.prototype[key] == "undefined") {
            block.call(context, object[key], key, object);
        }
    }
};

// character enumeration
String.forEach = function (string, block, context) {
    Array.forEach(string.split(""), function (chr, index) {
        block.call(context, chr, index, string);
    });
};

// globally resolve forEach enumeration
var forEach = function (object, block, context) {
    if (object) {
        var resolve = Object; // default
        if (object instanceof Function) {
            // functions have a "length" property
            resolve = Function;
        } else if (object.forEach instanceof Function) {
            // the object implements a custom forEach method so use that
            object.forEach(block, context);
            return;
        } else if (typeof object == "string") {
            // the object is a string
            resolve = String;
        } else if (typeof object.length == "number") {
            // the object is array-like
            resolve = Array;
        }
        resolve.forEach(object, block, context);
    }
};

// Determine if an attribute is a number
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
* 
* Empieza la clase del grid
* 
*/

function lazygrid(name, div, lazyUrl) {
    this.isNew = 0;
    if (name) {
        this.name = name;
    } else {
        this.name = "grid";
    }

    if (div) {
        this.div = div;
    } else {
        this.div = "div";
    }

    if (lazyUrl) {
        this.lazyUrl = lazyUrl;
        this.url = lazyUrl;
    } else {
        this.lazyUrl = " ";
        this.url = " ";
    }

    this.shif1 = null;
    this.shif2 = null;

    this.otroGrid = null;
    this.current_page = 0;
    this.mensajeError = 0;
    this.number_of_pages = 1;
    this.headrow;
    this.isLazy = "true";
    this.json = null;
    this.selectedItem = null;
    this.show_per_page = null;
    this.selectMultiple = null;
    this.sortable = new lazysorttable(this.div, this);
    this.paginacion = new datospaginacion();
    this.selectPP = false;
}

function datospaginacion() {
    this.objJavascript = "";
    this.pagina = "";
    this.porPagina = "";
    this.orderby = "";
    this.ordertype = "";
    //    this.objJavascript = null;
    //    this.pagina = null;
    //    this.porPagina = null;
    //    this.orderby = null;
    //    this.ordertype = null;
    this.campobusqueda = '';
    this.valorbusqueda = '';
    this.CriteriosSQL = new Array();
}

lazygrid.prototype.gridSearchReset = function (campobusqueda) {
    $('#search_' + campobusqueda + '').val('');
    this.gridSearch(campobusqueda);
};

lazygrid.prototype.getCriteriosSQL = function () {
    var self = this;

    var array = new Array();

    if ($('#' + self.div).find('input[typ="tsearch"]').length > 0) {
        $('#' + self.div).find('input[typ="tsearch"]').each(function () {
            var v = $(this).val();
            if (v != null && v != undefined && v != '') {
                var otis = {};
                otis.Campo = $(this).attr('header');
                otis.Valor = $(this).val();
                array.push(otis);
            }
        });
    }

    return array;
};

lazygrid.prototype.gridSearch = function (campobusqueda) {
    var thisObj = this;
    var valorbusqueda = $('#search_' + campobusqueda + '').val();
    thisObj.selectedItem = null;

    if (this.paginacion.campobusqueda != null)
        campobusqueda = campobusqueda.replace(this.name, '');
    this.paginacion.campobusqueda = campobusqueda;
    this.paginacion.valorbusqueda = valorbusqueda;
    this.paginacion.objJavascript = thisObj.name;
    this.paginacion.pagina = "0";
    this.paginacion.CriteriosSQL = thisObj.getCriteriosSQL();
    //console.log();
    var objGrid = this.paginacion;
    $.extend(true, objGrid, this.json);

    var peticionBusquedaGrid = new Peticion();
    peticionBusquedaGrid.url = thisObj.url;
    peticionBusquedaGrid.datatype = 'html';
    peticionBusquedaGrid.json = JSON.stringify(objGrid); ;

    //    var peticionBusquedaGrid = $.ajax({
    //        type: "POST",
    //        data: objGrid,
    //        url: thisObj.url,
    //        dataType: "html"
    //    });
    peticionBusquedaGrid.posSolicitar = function (datos) {
        var array_datos = datos.split("<script>");
        var error = array_datos[0];
        array_datos.splice(0, 1);
        thisObj.mensajeError = error;
        if (array_datos.length <= 1) {
            thisObj.error(error);
        } else {
            eval(array_datos[0]);
            $("#" + thisObj.div).html(array_datos[1]);
            thisObj.configPaginador(0);
            thisObj.paginacion.campobusqueda = campobusqueda;
            thisObj.paginacion.valorbusqueda = valorbusqueda;

            $('#search_' + thisObj.paginacion.campobusqueda + '').focus();
            $('#search_' + thisObj.paginacion.campobusqueda + '').val(thisObj.paginacion.valorbusqueda);
            $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchandcleanbox');
            $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchbox');
            $('#' + thisObj.div + ' .cleanbox').hide();

            var criterios = thisObj.paginacion.CriteriosSQL;
            criterios.forEach(function (item) {
                $('#' + thisObj.div + ' #search_' + item.Campo).val(item.Valor);
                $('#' + thisObj.div + ' #searchicon_' + item.Campo).removeClass('searchbox');
                $('#' + thisObj.div + ' #searchicon_' + item.Campo).addClass('searchandcleanbox');
                $('#' + thisObj.div + ' #cleanicon_' + item.Campo).show();
            });

            if (thisObj.paginacion.valorbusqueda != '') {
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchbox');
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchandcleanbox');
                $('#' + thisObj.div + ' #cleanicon_' + thisObj.paginacion.campobusqueda).show();

            }

            //				this.paginacion = new datospaginacion();
            thisObj.sortable.init2();
            thisObj.isNew = 1;
        }
        thisObj.posMostrar();
        thisObj.normalizeTextIcons();
        maskChecksAndRadios();
    };
    peticionBusquedaGrid.error = function (jqXHR) {

    };
    peticionBusquedaGrid.solicitar();
};

lazygrid.prototype.normalizeTextIcons = function () {
    $('div.searchbox').addClass('fa fa-search');
    $('div.searchandcleanbox').addClass('fa fa-search');
    $('div.cleanbox').addClass('fa fa-remove');
}

/**
* Realiza una consulta por el grid y muestra el grid
*/

lazygrid.prototype.mostrar = function () {

    $(document).keydown(function (e) {
        if (e.ctrlKey == true) {
            ctrl = true;
        }
        if (e.metaKey == true) {
            ctrl = true;
        }
    });
    $(document).keyup(function (e) {
        if (e.which == 17) {
            ctrl = false;
        }
        if (e.which == 16) {
            shift = false;
            this.shift1 = null;
            this.shift2 = null;
        }
    });

    $(document).keydown(function (e) {
        if (e.shiftKey == true) {
            shift = true;
        }
    });


    var thisObj = this;
    this.paginacion.campobusqueda = "";
    this.paginacion.valorbusqueda = "";
    thisObj.paginacion.pagina = 0;
    thisObj.selectedItem = null;
    this.paginacion.objJavascript = thisObj.name;
    var objGrid = this.paginacion;
    $.extend(true, objGrid, this.json);

    var peticionMostrarGrid = new Peticion();
    peticionMostrarGrid.url = thisObj.url;
    peticionMostrarGrid.datatype = 'html';
    peticionMostrarGrid.json = JSON.stringify(objGrid); ;

    //    var peticionMostrarGrid = $.ajax({
    //        type: "POST",
    //        data: objGrid,
    //        url: thisObj.url,
    //        dataType: "html"
    //    });
    peticionMostrarGrid.posSolicitar = function (datos) {
        var array_datos = datos.split("<script>");
        var error = array_datos[0];

        if (error == '') {
            error = "error interno";
        }
        else if (error != 'sin error' && error != '1') {
            //alert(error);
            var datos2 = JSON.parse(datos);
            if (datos2.Clave == 11) {
                error = datos2.MensajeUsuario;
            }
        }
        array_datos.splice(0, 1);
        //alert(array_datos);
        if (array_datos.length <= 1) {
            thisObj.error(error);
        } else {
            eval(array_datos[0]);
            $("#" + thisObj.div).html(array_datos[1]);
            thisObj.configPaginador(0);
            $('#' + thisObj.div + ' td:not(.trbusqueda)').attr('unselectable', 'on');
            $('#' + thisObj.div + ' .cleanbox').hide();
            
            thisObj.posMostrar();
            thisObj.normalizeTextIcons();
            maskChecksAndRadios();
        }

    };
    peticionMostrarGrid.error = function (jqXHR) {

    };
    peticionMostrarGrid.solicitar();
};

/**
* Configura el tipo de paginador
*/
lazygrid.prototype.configPaginador = function (page_num) {
    this.sortable.init();
    this.number_of_items = $('#' + this.div + '  input[name="number_of_items"]:last').val();
    this.selectMultiple = $('#' + this.div + '  input[name="select_multiple"]:last').val();

    if (this.conPaginado() == "true") {
        this.show_paginado = $('#' + this.div + ' input[name="show_pages"]:first').val();
        this.show_per_page = $('#' + this.div + ' input[name="show_per_page"]:first').val();
        this.number_of_pages = Math.ceil(this.number_of_items / this.show_per_page);
        var spp = '';
        if (this.selectPP) {
            spp = ' <div id="grddvPorAPagina" class="styled-select"><select id="' + this.name + 'porPagina" type="text" style="width:78px;" onchange="' + this.name + '.changePorPagina(this.value)"><option value="10" ' + (this.show_per_page == 10 ? 'selected="selected"' : '') + '>10</option><option value="20" ' + (this.show_per_page == 20 ? 'selected="selected"' : '') + '>20</option><option value="50" ' + (this.show_per_page == 50 ? 'selected="selected"' : '') + '>50</option><option value="100" ' + (this.show_per_page == 100 ? 'selected="selected"' : '') + '>100</option><option value="300" ' + (this.show_per_page == 300 ? 'selected="selected"' : '') + '>300</option><option value="500" ' + (this.show_per_page == 500 ? 'selected="selected"' : '') + '>500</option></select></div>'
        }
        console.log(ElementosEncontrados);
        if (this.number_of_pages < 2) {
            $('#' + this.div + ' div.paginacion').html('<span name="leyenda">' + this.number_of_items + " " + ElementosEncontrados + " </span>" + spp);
            return;
        }
        this.paginado = Math.ceil(this.number_of_pages / this.show_paginado);

        this.current_paginacion_page = 0;
        var navigation_html = '<span name="leyenda"> </span>';
        var paginaInicial = 0;
        var paginaFinal = 0;
        paginaInicial = Math.floor(page_num / this.show_paginado) * this.show_paginado;
        if ((this.number_of_pages - paginaInicial) >= this.show_paginado)
            paginaFinal = (Number(paginaInicial) + Number(this.show_paginado));
        else
            paginaFinal = this.number_of_pages;

        navigation_html += spp;
        if (this.number_of_items > 0) {
            navigation_html += '<span><ul>';
            var current_link = paginaInicial;
            if (paginaInicial != 0) {
                navigation_html += '<li class="previous_link" ><a href="javascript:' + this.name + '.primero();">|&lt;&lt;</a>|</li>';
                navigation_html += '<li class="previous_link" ><a href="javascript:' + this.name + '.anterior(' + paginaInicial + ');">&lt;&lt;</a>|</li>';
            }
            while (paginaFinal > current_link) {
                navigation_html += '<li class="page_action"><a class="page_link" title="Ir a" href="javascript:' + this.name + '.ir_a_pagina(' + current_link + ', \'aux2\')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>|</li>';
                current_link++;
            }
            if (this.needArrows() && paginaFinal != this.number_of_pages) {
                navigation_html += '<li class="next_link"><a  href="javascript:' + this.name + '.siguiente(' + paginaFinal + ');">&gt;&gt;</a>|</li>';
                navigation_html += '<li class="next_link" ><a href="javascript:' + this.name + '.ultimo();">&gt;&gt;|</a></li>';
            }
            navigation_html += '</ul></span>';
            if (this.needArrows()) {
                navigation_html += '<span id="grddvIrAPagina">Ir a p&aacute;gina: <input id="' + this.name + 'busquedaPagina" type="text" style="width:30px;" onkeydown="if (event.keyCode == 13){ ' + this.name + '.buscarPagina(\'' + this.name + 'busquedaPagina\');}"/></span>';
            }


        }
        $('#' + this.div + ' div.paginacion').html(navigation_html);
        var tbody_visible = Math.floor(page_num / this.show_paginado);
    }
    $('#' + this.div + ' a.activo').removeClass('activo');
    var ancho = $('#' + this.div + ' .generalgrid').css('width');
    //    alert(ancho);

    //    $('#' + this.div + ' .paginacion ul').css('margin', '0 auto');
    //    $('#' + this.div + ' .paginacion ul').css('text-align', 'center');
    //    $('#' + this.div + ' .paginacion ul').css('left', '150px');
    //    $('#' + this.div + ' .paginacion ul').css('width', '350px');
    $('#' + this.div + ' .page_link[longdesc=' + page_num + ']').addClass('activo');

    this.leyenda();
};

lazygrid.prototype.changePorPagina = function (val) {
    //console.log(val);
    this.show_per_page = val;
    this.paginacion.porpagina = val;
    this.porPagina = val;
    this.ir_a_pagina(0);
};


lazygrid.prototype.needArrows = function () {
    if (this.number_of_items > (this.show_per_page * this.show_paginado))
        return true;
    return false;
};

/**
* @event anterior muestra el paginado anterior
*/
lazygrid.prototype.anterior = function (paginaActual) {
    this.ir_a_pagina((paginaActual - 1));
};

/**
* Verifica si utilizara paginado
*/
lazygrid.prototype.conPaginado = function () {

    var x = $('#' + this.div + ' input[name="use_paginator"]:first').val();
    if (x != null)
        x = x.toLowerCase();
    return x;
};

/**
* @event siguiente muestra el paginado siguientes
*/
lazygrid.prototype.siguiente = function (paginaActual) {
    this.ir_a_pagina(paginaActual);
};

lazygrid.prototype.primero = function () {
    this.ir_a_pagina(0);
};

lazygrid.prototype.ultimo = function () {

    this.ir_a_pagina(this.number_of_pages - 1);
};

/**
* muestra la pagina que se le pasa como parametro
* 
* @param page_num
*            numero de pagina a ir
*/

lazygrid.prototype.irAPagina = function (page_num) {
    this.refresh();
    this.ir_a_pagina(page_num - 1, 'aux2');
    this.selectedItem = null;

}

lazygrid.prototype.buscarPagina = function (divName) {
    if (!isNaN($('#' + divName).val())) {
        this.ir_a_pagina(Number($('#' + divName).val()) - 1, 'aux2');
    }
}

lazygrid.prototype.refresh = function () {
    
    this.selectedItem = null;
    this.ir_a_pagina(this.current_page, 'aux3');    
}

lazygrid.prototype.ir_a_pagina = function (page_num, aux) {
    var thisObj = this;

    thisObj.selectedItem = null;

    if (page_num < 0)
        page_num = 0;
    if (this.isLazy == "false") {
        this.otroGrid.ir_a_pagina(page_num, aux);
    } else {
        var thisObj = this;
        var salidaJSON = 1;
        if (aux == "aux") {
            return;
        }

        if (page_num == undefined) {
            page_num = this.current_page;
        }
        this.current_page = page_num;
        if (this.paginacion.valorbusqueda == null)
            this.paginacion.valorbusqueda = "";

        if (this.paginacion.ordertype == null)
            this.paginacion.ordertype = "";
        if (this.paginacion.orderby == null)
            this.paginacion.orderby = "";
        this.paginacion.objJavascript = this.name;
        this.paginacion.pagina = page_num;
        this.paginacion.porpagina = this.show_per_page;
        this.paginacion.porPagina = this.show_per_page;
        var objGrid = this.paginacion;
        $.extend(true, objGrid, this.json);
       
        var peticionIrPaginaGrid = new Peticion();
        peticionIrPaginaGrid.url = this.lazyUrl;
        peticionIrPaginaGrid.datatype = 'html';
        peticionIrPaginaGrid.json = JSON.stringify(objGrid); 

        //        var peticionIrPaginaGrid = $.ajax({
        //            url: this.lazyUrl,
        //            data: objGrid,
        //            dataType: "html",
        //            type: 'POST'
        //        });
        peticionIrPaginaGrid.posSolicitar = function (data) {
            salidaJSON = data;
            var array_datos = salidaJSON.split("<script>");
            var errorGrid = array_datos[0];
            array_datos.splice(0, 1);

            if (errorGrid == '1' && page_num > 0) {
                if (errorGrid == null || errorGrid == '') {
                    errorGrid = "Error Interno";
                }
                if (page_num > 0 && thisObj.number_of_pages > 0 && array_datos != "") {
                    if (aux == 'aux3')
                        thisObj.number_of_pages = thisObj.number_of_pages - 1;
                    thisObj.ir_a_pagina(thisObj.number_of_pages - 1, 'aux2');
                    return;
                } else {
                    thisObj.error(errorGrid);
                    return;
                }
            } else {
                eval(array_datos[0]);
                $("#" + thisObj.div).html(array_datos[1]);

                if (thisObj.paginacion.orderby != null && thisObj.paginacion.orderby != "null" && thisObj.paginacion.orderby != "") {
                    var valor = $('#' + thisObj.div + ' #' + thisObj.paginacion.orderby).html();
                    var htmlCode;
                    if (thisObj.paginacion.ordertype == 'asc') {
                        htmlCode = ' <div class="ascendente"  id="imgOrdenamiento">&#9650;</div>';
                    } else {
                        htmlCode = ' <div class="descendente"  id="imgOrdenamiento">&#9660;</div>';
                    }
                    $('#' + thisObj.div + ' #' + thisObj.paginacion.orderby).html(htmlCode + valor);
                } else {
                    $('#' + thisObj.div).html(htmlCode);
                }
                $('#' + thisObj.div + ' #search_' + thisObj.paginacion.campobusqueda).val(thisObj.paginacion.valorbusqueda);
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchandcleanbox');
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchbox');
                $('#' + thisObj.div + ' .cleanbox').hide();
                if (thisObj.paginacion.valorbusqueda != '') {
                    $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchbox');
                    $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchandcleanbox');
                    $('#' + thisObj.div + ' #cleanicon_' + thisObj.paginacion.campobusqueda).show();
                }
                var criterios = thisObj.paginacion.CriteriosSQL;
                criterios.forEach(function (item) {
                    $('#' + thisObj.div + ' #search_' + item.Campo).val(item.Valor);
                    $('#' + thisObj.div + ' #searchicon_' + item.Campo).removeClass('searchbox');
                    $('#' + thisObj.div + ' #searchicon_' + item.Campo).addClass('searchandcleanbox');
                    $('#' + thisObj.div + ' #cleanicon_' + item.Campo).show();
                });

                if (thisObj.isNew = 1) {
                    thisObj.configPaginador(page_num);
                }
                $("#" + thisObj.div).show();
                var desde = (page_num * thisObj.show_per_page) + 1;
                var hasta = ((page_num + 1) * thisObj.show_per_page);
                if (hasta > thisObj.number_of_items) {
                    hasta = thisObj.number_of_items;
                }

                $('#' + thisObj.div + ' span[name="leyenda"]:first ').html(desde + " a " + hasta + " de " + thisObj.number_of_items);
                thisObj.sortable.init2();
                thisObj.isNew = 1;
            }
            //}
            thisObj.posMostrar();
            thisObj.posRefresh();
            thisObj.normalizeTextIcons();
            maskChecksAndRadios();
        };

        peticionIrPaginaGrid.error = function (jqXHR) {

        };
        peticionIrPaginaGrid.solicitar();
    }
};

lazygrid.prototype.ir_a_pagina_ordenada = function (orderby, total) {
    var salidaJSON = 1;

    var ordertype = "asc";
    if (this.headrow == undefined) {
        this.headrow = new Array(total);
    }
    for (var i = 0; i < total; i++) {
        if (orderby == this.sortable.headrow[i].id) {
            if (this.headrow[i] == undefined) {
                this.headrow[i] = "asc";
                ordertype = "asc";
            } else {
                if (this.headrow[i] == "asc") {
                    this.headrow[i] = "desc";
                    ordertype = "desc";
                } else {
                    this.headrow[i] = "asc";
                    ordertype = "asc";
                }
            }
        } else {
            this.headrow[i] = undefined;
        }
    }
    orderby = orderby.replace(this.name, '');
    this.orderby = orderby;
    this.ordertype = ordertype;
    page_num = 0;
    var thisObj = this;

    this.paginacion.campobusqueda = this.paginacion.campobusqueda.replace(this.name, '');

    this.paginacion.objJavascript = thisObj.name;
    this.paginacion.pagina = 0;
    this.paginacion.porPagina = thisObj.show_per_page;
    this.paginacion.orderby = orderby;
    this.paginacion.ordertype = ordertype;
    var objGrid = this.paginacion;
    $.extend(true, objGrid, this.json);

    var peticionIrPaginaOrdenadaGrid = new Peticion();
    peticionIrPaginaOrdenadaGrid.url = thisObj.lazyUrl;
    peticionIrPaginaOrdenadaGrid.datatype = 'html';
    peticionIrPaginaOrdenadaGrid.json = JSON.stringify(objGrid); ;

    //    peticionIrPaginaOrdenadaGrid = $.ajax({
    //        url: thisObj.lazyUrl,
    //        data: objGrid,
    //        //        data: 'objJavascript=' + thisObj.name + '&pagina=' + 0 + '&porPagina=' + thisObj.show_per_page + "&orderby=" + orderby + "&ordertype=" + ordertype + "&campobusqueda="
    //        //				+ thisObj.paginacion.campobusqueda.replace(this.name, '') + "&valorbusqueda=" + thisObj.paginacion.valorbusqueda,
    //        dataType: "html",
    //        type: 'POST'
    //    });
    peticionIrPaginaOrdenadaGrid.posSolicitar = function (data) {
        salidaJSON = data;
        var array_datos = salidaJSON.split("<script>");
        var errorGrid = array_datos[0];
        array_datos.splice(0, 1);
        if (array_datos.length <= 1) {
            if (errorGrid == null || errorGrid == '') {
                errorGrid = "Error Interno";
            }
            thisObj.error(errorGrid);
        } else {
            var page_num = 0;
            eval(array_datos[0]);
            $("#" + thisObj.div).html(array_datos[1]);
            var valor = $('#' + thisObj.div + ' #' + orderby).html();
            var htmlCode;
            if (ordertype == 'asc') {
                htmlCode = ' <div class="ascendente"  id="imgOrdenamiento">&#9650;</div>';
            } else {
                htmlCode = ' <div class="descendente"  id="imgOrdenamiento">&#9660;</div>';
            }
            thisObj.paginacion.ordertype = ordertype;
            $('#' + thisObj.div + ' #' + orderby).html(htmlCode + valor);

            $('#search_' + thisObj.paginacion.campobusqueda + '').focus();
            $('#search_' + thisObj.paginacion.campobusqueda + '').val(thisObj.paginacion.valorbusqueda);
            $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchandcleanbox');
            $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchbox');
            $('#' + thisObj.div + ' .cleanbox').hide();
            if (thisObj.paginacion.valorbusqueda != '') {
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).removeClass('searchbox');
                $('#' + thisObj.div + ' #searchicon_' + thisObj.paginacion.campobusqueda).addClass('searchandcleanbox');
                $('#' + thisObj.div + ' #cleanicon_' + thisObj.paginacion.campobusqueda).show();
            }
            var criterios = thisObj.paginacion.CriteriosSQL;
            criterios.forEach(function (item) {
                $('#' + thisObj.div + ' #search_' + item.Campo).val(item.Valor);
                $('#' + thisObj.div + ' #searchicon_' + item.Campo).removeClass('searchbox');
                $('#' + thisObj.div + ' #searchicon_' + item.Campo).addClass('searchandcleanbox');
                $('#' + thisObj.div + ' #cleanicon_' + item.Campo).show();
            });

            thisObj.configPaginador(0);
            $("#" + thisObj.div).show();
            var desde = 1;
            var hasta = thisObj.show_per_page;
            if (hasta > thisObj.number_of_items) {
                hasta = thisObj.number_of_items;
            }
            $('#' + thisObj.div + ' span[name="leyenda"]:first ').html(desde + " a " + hasta + " de " + thisObj.number_of_items);
            thisObj.sortable.init2();
            
            thisObj.posMostrar();
            thisObj.normalizeTextIcons();
            maskChecksAndRadios();
        }
    };
    peticionIrPaginaOrdenadaGrid.error = function (jqXHR) {

    };
    peticionIrPaginaOrdenadaGrid.solicitar();
};

/**
* muestra la leyenda de la pagina actual
* 
* @param page_num
*            numero de pagina a ir
*/
lazygrid.prototype.leyenda = function () {
    var a;
    page_num = this.current_page;
    page_num++;
    if (page_num == this.number_of_pages)
        a = this.number_of_items;
    else
        a = this.show_per_page * page_num;
    if (typeof this.show_per_page == "undefined" || this.number_of_items == 0) {
        if (this.number_of_items == 0)
            a = 0;
        var reg = " registros encontrados";
        if (a == 1)
            reg = " registro encontrado";
        $('#' + this.div + ' div.paginacion:first ').html("<span name=\"leyenda\">" + a + reg + "</span>");

    } else {
        var num = page_num * this.show_per_page;
        $('#' + this.div + ' span[name="leyenda"]:first ').html(num - (this.show_per_page - 1) + " a " + a + " de " + this.number_of_items);
    }
};

lazygrid.prototype.error = function (data) {
    $('#' + this.div).empty();
    $('#' + this.div).append("<div style='text-align:center' ><b>" + data + "</b></div>");
};

lazygrid.prototype.posMostrar = function () {

};
lazygrid.prototype.posRefresh = function () {

};

lazygrid.prototype.gridControlSelectItem = function (jsonobject, index) {
    if (this.isLazy == "false") {
        this.otroGrid.gridControlSelectItem(jsonobject, index);
    } else {
        $('#' + this.div + '  tbody:eq(1) tr').removeClass('odd');
        $('#' + this.div + '  tbody:eq(1) tr').removeClass('over');

        if (this.selectMultiple == 'true') {
            if (ctrl == false) {
                $('#' + this.div + ' tbody:eq(1) tr').removeClass('selected');
                $('#' + this.div + ' #' + this.name + "-tr" + index).addClass('selected');
            } else {

                if ($('#' + this.div + ' #' + this.name + "-tr" + index).hasClass('selected') == true) {
                    $('#' + this.div + ' #' + this.name + "-tr" + index).removeClass('selected');
                } else {
                    $('#' + this.div + ' #' + this.name + "-tr" + index).addClass('selected');
                }
            }
            if (shift == true) {
                this.shift2 = Number(index);
                var shiftMayor = this.shift2;
                var shiftMenor = this.shift1;
                if (this.shift1 > this.shift2) {
                    shiftMayor = this.shift1;
                    shiftMenor = this.shift2;
                }
                $('#' + this.div + ' tbody:eq(1) tr').removeClass('selected');
                for (var i = shiftMenor; i <= shiftMayor; i++) {
                    $('#' + this.div + ' #' + this.name + "-tr" + i).addClass('selected');
                }

            } else if (ctrl == false) {
                $('#' + this.div + ' tr').removeClass('selected');
                $('#' + this.div + ' #' + this.name + "-tr" + index).addClass('selected');
                this.shift1 = Number(index);
            } else {
                this.shift1 = Number(index);
            }
        } else {
            $('#' + this.div + ' tbody:eq(1) tr').removeClass('selected');
            $('#' + this.div + ' #' + this.name + "-tr" + index).addClass('selected');
        }
        var i = 0;
        $('#' + this.div + '  tbody:eq(1) tr').each(function () {
            if (i % 2 != 1) {
                if ($.trim($(this).attr("class")) != 'selected') {
                    $(this).addClass('odd');
                }
            }
            i++;
        });
        this.selectedItem = jsonobject[index];
    }
};

lazygrid.prototype.mouseover = function (index) {
    //    if ($.trim($('#' + this.div + ' #' + this.name + "-tr" + index).attr("class")) != 'selected') {
    $('#' + this.div + ' #' + this.name + "-tr" + index).removeClass('odd');
    $('#' + this.div + ' #' + this.name + "-tr" + index).addClass('over');
    //    }
};

lazygrid.prototype.mouseout = function () {
    var i = 0;
    $('#' + this.div + ' tbody:eq(1) tr').removeClass('over');
    $('#' + this.div + ' tbody:eq(1)  tr').each(function () {
        if (i % 2 != 1) {
            if ($.trim($(this).attr("class")) != 'selected') {
                $(this).addClass('odd');
            }
        }
        i++;
    });
};

lazygrid.prototype.dobleClick = function (jsonobject) {

};

lazygrid.prototype.dispose = function () {
    this.isNew = null;
    this.name = null;
    this.name = null;
    this.div = null;
    this.lazyUrl = null;
    this.url = null;
    this.otroGrid = null;
    this.current_page = null;
    this.mensajeError = null;
    this.number_of_pages = null;
    this.headrow = null;
    this.isLazy = null;
    this.json = null;
    this.selectedItem = null;
    this.show_per_page = null;
    this.sortable = null;
    this.paginacion = null;
    this.selectPP = false;
};

lazygrid.prototype.selectedList = function (jsonobject) {
    var self = this;
    var items = new Array();
    $.each($('#' + this.div + ' .selected'), function () {
        var index = $(this).attr('position');
        var json = eval(self.name + "JSON[" + index + "]");
        items.push(json);
    });
    return items;
};
