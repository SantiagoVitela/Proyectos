/*****************************************************************/
//  AlgoriaAutocomplete
//  Autor   : René Quintero Alvarez
//  Fecha   : 19/Marzo/2014
//  Objetivo: Control que crea una lista autocomplete con funciones especiales
//
/*
            var ultimoIdGenerado = 1;
            var ob = new AlgoriaAutocomplete('dvAutoComplete');
            ob.width = '450px;'
            ob.resultContenerHeight = '100px';
            ob.onSearching = function (value) {
                var arr = new Array();
                if (ultimoIdGenerado >= 100) {
                    return arr;
                }
                for (var i = 1; i <= 10; i++) {
                    arr.push({ 'value': ultimoIdGenerado, 'text': 'elemento automático # ' + ultimoIdGenerado });
                    ultimoIdGenerado++;
                }
                return arr;
            }
            ob.onSearchCriteriaChange = function () {
                ultimoIdGenerado = 1;
            }
            ob.createItemTemplate = function (o) {
                var s = '<table width="100%">';
                s += '<tr>';
                s += '<td style="width:70%;">' + o.text + '</td>';
                s += '<td style="width:30%;text-align:center;"><a href="#">Editar</a></td>';
                s += '</tr>';
                s += '</table>';
                return s;
            }
            ob.onSelectItem = function (o) {
                console.log(o);
            }
            ob.create();
*/
/*****************************************************************/
var AlgoriaAutocomplete = function (id) {
    this.id = id;
    this.uniqueIdentifier = null;

    this.autcid = null;
    this.searchTextBoxId = null;
    this.searchResultId = null;
    this.temporizer = null;
    this.temporizerScroll = null;

    // Para saber si se eliminan todos los elementos mostrados antes de 
    // mostrar el siguiente resultado de elementos
    this.clearAllElements = true;

    this.isSearching = false;
    this.lastSearchCriteria = null;
    this.elementSelectedOnSearchList = -1;
    this.elementsFoundOnSearch = 0;
    this.mouseOverSearchResult = false;

    this.enableSearching = true;
    this.enableSearchOnScroll = true;
    this.isSearchResultFixed = false;

    this.width = null; // '300px';
    this.height = '300px';
    this.resultContenerHeight = '50px';

    this.resultList = null;

    this.lastScrollTop = 0;
    this.noItemsFoundText = 'Fin de los resultados.';
    this.isEndOfResults = false;

    this.valueSelected = null;
    this.placeHolder = 'Teclee el nombre o descripción';
}
AlgoriaAutocomplete.prototype.setText = function (t) {
    var self = this;
    var tx = self.gebId(self.searchTextBoxId);
    tx.value = t;
}
AlgoriaAutocomplete.prototype.getValue = function () {
    var self = this;
    return this.valueSelected;
}
AlgoriaAutocomplete.prototype.create = function () {
    var self = this;

    var dv = self.gebId(self.id);
    if (dv == undefined) {
        throw "Error al crear el objeto autoComplete. No se ha especificado un contenedor válido.";
        return;
    }
    self.uniqueIdentifier = '' + new Date().getTime() + '' + Math.floor((Math.random() * 100000) + 1);
    self.autcid = "dvAutC" + self.uniqueIdentifier;
    self.searchTextBoxId = "txtAutoCm" + self.uniqueIdentifier;
    self.searchResultId = "dvSearchResult" + self.uniqueIdentifier;

    var type = dv.getAttribute('type');
    var tag = dv.tagName;
    if (tag.toLowerCase() == 'div') {
        var dvA = self.cEl('div');
        dvA.id = self.autcid;
        dvA.setAttribute('class', 'autc');

        if (self.width != null) {
            dvA.setAttribute('style', 'width:' + self.width + ';');
        }

        var str = '<input type="text" id="' + self.searchTextBoxId + '" class="autctx" placeholder="' + self.placeHolder + '" />';
        str += '<div id="' + self.searchResultId + '" class="autcresult" style="width:' + self.width + ';display:none;max-height:' + self.resultContenerHeight + ' !important;overflow-y:scroll;position:absolute !important;"></div>';

        dvA.innerHTML = str;
        dv.appendChild(dvA);
    }

    // Hacer que el div tenga el mismo width que el cuadro de texto
    var ct = self.gebId(self.searchTextBoxId);
    var dvs = self.gebId(self.searchResultId);
    dvs.offsetWidth = ct.offsetWidth;

    self.attachEventKeyDown(self.searchTextBoxId);

    if (self.enableSearchOnScroll == true) {
        self.attachEventScroll(); // Para el scroll de los resultados
    }

    // Se agregan los eventos mouseover y mouseout al resultado de la búsqueda
    var fnmouseover = function (e) { self.mouseOverSearchResult = true; }
    var fnmouseout = function (e) { self.mouseOverSearchResult = false; }
    self.attachEvent(self.id, 'mouseover', fnmouseover);
    self.attachEvent(self.id, 'mouseout', fnmouseout);
    document.onclick = function (e) {
        if (self.mouseOverSearchResult == false) {
            self.endSearch();
        }
    }
}

AlgoriaAutocomplete.prototype.destroy = function () {
    var self = this;
    var dv = self.gebId(self.id);
    dv.innerHTML = '';
}

AlgoriaAutocomplete.prototype.attachEventKeyDown = function (txtid) {
    var self = this;
    var fnonkeydown = function (e) {
        var kc = e.keyCode ? e.keyCode : e.which;
        var txtobj = document.getElementById(self.searchTextBoxId);
        if (kc == 13 || kc == 9) {
            if (e.preventDefault) { e.preventDefault(); } else { (e.keyCode) ? e.keyCode = 0 : e.which = 0; }
            if (self.elementSelectedOnSearchList > -1) {
                self.clickItemSearchResult(self.elementSelectedOnSearchList);
            }
            self.endSearch();
        } else if (kc == 27) {
            if (self.isSearching == true) {
                self.endSearch();
            }
        } else if (kc == 38) { // flecha arriba
            if (self.elementsFoundOnSearch > 0) {
                if (self.elementSelectedOnSearchList <= 0) {
                    self.elementSelectedOnSearchList = 0;
                } else { self.elementSelectedOnSearchList--; }
            } else { self.elementSelectedOnSearchList = 0; }
            self.selectItemSearchResult(self.elementSelectedOnSearchList);
            self.doManualScroll(self.elementSelectedOnSearchList);
        } else if (kc == 40) { // flecha abajo
            if (self.elementsFoundOnSearch > 0) {
                if (self.elementSelectedOnSearchList >= self.elementsFoundOnSearch) {
                    self.elementSelectedOnSearchList = self.elementsFoundOnSearch;
                } else { self.elementSelectedOnSearchList++; }
            } else { self.elementSelectedOnSearchList = self.elementsFoundOnSearch; }
            self.selectItemSearchResult(self.elementSelectedOnSearchList);
            self.doManualScroll(self.elementSelectedOnSearchList);
        } else {
            self.enableSearching = true; // SE activa la búsqueda
            self.lastScrollTop = 0; // Para que habilite el scroll en el div de resultados
            self.isEndOfResults = false;
            self.clearAllElements = true;
            if (self.temporizer != null) { window.clearTimeout(self.temporizer); } // eliminar temp
            self.onSearchCriteriaChange();
            var txtobj = document.getElementById(self.searchTextBoxId);
            self.temporizer = setTimeout(function () { self.doSearch(txtobj.value); }, 500); //Crear Temp
        }
    }
    self.attachEvent(self.searchTextBoxId, 'keydown', fnonkeydown);
}
AlgoriaAutocomplete.prototype.doManualScroll = function (itemId) {
    var self = this;
    var item = self.gebId('autcsi' + itemId);
    var cont = self.gebId(self.searchResultId);
    if (item.offsetTop < cont.scrollTop) { cont.scrollTop = item.offsetTop; }
    var c = (item.offsetTop + cont.offsetHeight) - item.offsetHeight - 120;
    if (c > cont.scrollTop) { cont.scrollTop = c; }
}
AlgoriaAutocomplete.prototype.attachEventScroll = function () {
    var self = this;
    var fnscroll = function (e) {
        if (self.temporizer != null) { window.clearTimeout(self.temporizer); } // eliminar temp
        if (self.enableSearchOnScroll == true) {
            var scT = this.scrollTop;
            var scH = this.scrollHeight;
            var ofH = this.offsetHeight;
            if (self.lastScrollTop > scT) { return; }
            var calcu = scH - scT - ofH;
            if (calcu <= 20) {
                self.lastScrollTop = scT; // Se guarda el último top
                self.clearAllElements = false;
                var txtobj = document.getElementById(self.searchTextBoxId);
                self.temporizer = setTimeout(function () { self.doSearch(txtobj.value); }, 500); //Crear Temp
            }
        }
    }
    self.attachEvent(self.searchResultId, 'scroll', fnscroll);
}

AlgoriaAutocomplete.prototype.selectItemSearchResult = function (id) {
    var self = this;
    var litemsresult = document.getElementsByClassName('autcsearchitem');
    for (var i = 0, ln = litemsresult.length; i < ln; i++) {
        if (id == litemsresult[i].getAttribute('did')) {
            litemsresult[i].setAttribute('class', 'autcsearchitem autcsearchitemover');
        } else {
            litemsresult[i].setAttribute('class', 'autcsearchitem');
        }
    }
    self.elementSelectedOnSearchList = parseInt(id);
}
AlgoriaAutocomplete.prototype.clickItemSearchResult = function (id) {
    var self = this;
    var obj = self.resultList[id];

    var txt = self.gebId(self.searchTextBoxId);
    txt.value = obj.text;
    self.endSearch();
    txt.focus();

    // El objeto seleccionado
    self.valueSelected = obj;
    self.onSelectItem(obj);
}
AlgoriaAutocomplete.prototype.onSelectItem = function (obj) { var self = this; }
AlgoriaAutocomplete.prototype.onSearching = function (criteria) {
    var arr = new Array();
    arr.push({ 'value': 1, 'text': 'Primer elemento' });
    arr.push({ 'value': 2, 'text': 'Segundo elemento' });
    arr.push({ 'value': 3, 'text': 'Tercero elemento' });
    arr.push({ 'value': 4, 'text': 'Cuarto elemento' });
    arr.push({ 'value': 5, 'text': 'Quinto elemento' });
    return arr;
}
AlgoriaAutocomplete.prototype.onSearchCriteriaChange = function (criteria) { }
AlgoriaAutocomplete.prototype.doSearch = function (criteria) {
    var self = this;
    if (self.isEndOfResults == true) { return; } // Cancela la ejecución
    if (self.lastSearchCriteria != criteria || self.clearAllElements == false) {
        self.isSearching = true;
        var listContener = self.gebId(self.searchResultId);
        self.lastSearchCriteria = criteria;
        //if (criteria == '') {
        //    listContener.style.display = 'none';
        //    return;
        //}
        listContener.style.display = '';
        self.createWaitingItem(); // Se crea el elemento de espera
        var arr = self.onSearching(criteria);
        self.removeWaitingItem(); // Se elimina el elemento de espera
        if (arr == undefined || arr == null) { self.elementsFoundOnSearch = 0; return; }

        if (self.clearAllElements == true) {
            self.resultList = new Array();
            listContener.innerHTML = '';
            listContener.scrollTop = 0;
            self.isEndOfResults = false;
            self.elementSelectedOnSearchList = -1;
        }

        // Crear los elementos de la lista
        var elementosActuales = self.resultList.length;
        var len = arr.length;
        self.elementsFoundOnSearch = (len - 1) + elementosActuales;
        if (len > 0) {
            var elements = '';
            for (var i = 0; i < len; i++) {
                var oAc = arr[i];
                var dv = document.createElement('div');
                dv.id = 'autcsi' + (i + elementosActuales);
                dv.setAttribute('did', (i + elementosActuales));
                dv.setAttribute('class', 'autcsearchitem');
                dv.innerHTML = self.itemTemplate(oAc);
                dv.onclick = function (e) { self.clickItemSearchResult(this.getAttribute('did')); }
                dv.onmousemove = function (e) { self.selectItemSearchResult(this.getAttribute('did')); }

                listContener.appendChild(dv);
                self.resultList.push(oAc);
            }
        } else {
            if (self.isEndOfResults == false) {
                var odv = self.cEl('div');
                odv.setAttribute('class', 'autcsearchnoitems');
                odv.innerHTML = self.noItemsFoundText;
                listContener.appendChild(odv);
                self.isEndOfResults = true;
            }
        }
    }
}
AlgoriaAutocomplete.prototype.endSearch = function () {
    var self = this;

    // Si está activo el temporizado de búsqueda, entonces se desactiva
    if (self.temporizer != null) { window.clearTimeout(self.temporizer); }

    var dv = self.gebId(self.searchResultId);
    if (dv) {
        dv.style.display = 'none';
    }

    // Inicialización de variables
    self.lastSearchCriteria = null;
    self.elementSelectedOnSearchList = -1;
    self.elementsFoundOnSearch = 0;
    self.mouseOverSearchResult = false;
    self.enableSearching = false; // Para que se ejecute la búsqueda
    self.isSearching = false;
}
AlgoriaAutocomplete.prototype.itemTemplate = function (o) {
    var self = this;
    var str = '<div>' + o.text + '</div>';
    return str;
}
AlgoriaAutocomplete.prototype.waitingTemplate = function () { return '<div>Buscando, por favor no se desespere...</div>'; }
AlgoriaAutocomplete.prototype.createWaitingItem = function () {
    var self = this;
    var dvW = self.cEl('div');
    dvW.id = 'dvWI' + self.uniqueIdentifier;
    dvW.innerHTML = self.waitingTemplate();

    var dvR = self.gebId(self.searchResultId);
    dvR.appendChild(dvW);
}
AlgoriaAutocomplete.prototype.removeWaitingItem = function () {
    var self = this;
    var dv = self.gebId('dvWI' + self.uniqueIdentifier);
    dv.parentNode.removeChild(dv);
}
AlgoriaAutocomplete.prototype.disable = function () {
    var self = this;
    var o = self.gebId(self.searchTextBoxId);
    o.setAttribute('disabled', 'disabled');
}
AlgoriaAutocomplete.prototype.enable = function () {
    var self = this;
    var o = self.gebId(self.searchTextBoxId);
    o.removeAttribute('disabled');
}
AlgoriaAutocomplete.prototype.attachEvent = function (id, event, fn) {
    var self = this;
    var tarea = document.getElementById(id);
    if (tarea != undefined && tarea != null) {
        if (document.all) {
            tarea.attachEvent("on" + event, fn);
        } else {
            tarea.addEventListener(event, fn, false);
        }
    }
}
AlgoriaAutocomplete.prototype.cEl = function (type) {
    return document.createElement(type);
}
AlgoriaAutocomplete.prototype.gebId = function (id) {
    return document.getElementById(id);
}

