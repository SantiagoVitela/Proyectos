var AlgoriaElementsBox = function (id) {
    this.width = 250;
    this.height = 125;
    this.id = id;
    this.divItemContener = null;
    this.uniqueIdentifier = '';
    this.onEditing = false;
    this.enableAutoCreateElement = true;
    this.enableSearch = false;
    this.searchResult = null;
    this.temporizer = null;
    this.lastSearchCriteria = null;
    this.elementSelectedOnSearchList = -1;
    this.elementsFoundOnSearch = 0;
    this.mouseOverSearchResult = false;
    this.itemsCount = 0;
    this.maxItems = 1000000; // Un millón de elementos permitidos
    this.noItemsFoundText = 'No se encontraron elementos';
    this.initialText = 'Click aquí para agregar elementos';

    this.regularExpression = null;
    this.fields = [];  // objeto tipo { "Clave", "Descripcion" }
}
AlgoriaElementsBox.prototype.create = function (options) {
    var self = this;
    var ctl = document.getElementById(self.id);
    if (ctl != undefined) {
        ctl.style.width = self.width + 'px';
        ctl.style.minHeight = self.height + 'px';
        ctl.setAttribute('class', 'comp');

        self.uniqueIdentifier = '' + new Date().getTime() + '' + Math.floor((Math.random() * 100000) + 1);
        var idItemCont = 'itemContener' + self.uniqueIdentifier;
        var strItemContener = '<div id="' + idItemCont + '"></div>';

        self.divItemContener = idItemCont;
        ctl.innerHTML = strItemContener;

        // Agregar el evento click para poder editar directamente en el elemento
        ctl.onclick = function () {
            if (self.enableAutoCreateElement == true) {
                if (self.onEditing == true) {
                    var tarea = document.getElementById('txtEscAct' + self.uniqueIdentifier);
                    tarea.focus();
                } else { self.startEditing(); }
            }
        }
        self.createEmptyElement();
    }
}
AlgoriaElementsBox.prototype.startEditing = function () {
    var self = this;

    if (self.itemsCount >= self.maxItems) { return; }
    self.deleteEmptyElement();
    var initialWidth = 20;
    var str = '<input type="text" id="txtEscAct' + self.uniqueIdentifier + '" class="comptareaedit" style="width:' + initialWidth + 'px;border:none;" />' +
					'<div id="dvTOc' + self.uniqueIdentifier + '" style="width:' + initialWidth + 'px;height:1px;overflow:hidden;"></div>' +
					'<div id="dvSearch' + self.uniqueIdentifier + '" class="compsearchresult" style="clearing:both;display:none;z-index:1000;"></div>';

    var objComptarea = document.createElement('div');
    objComptarea.id = 'comptarea' + self.uniqueIdentifier;
    objComptarea.setAttribute('class', 'comptarea');
    objComptarea.innerHTML = str;

    // Agregarlo al contenedor de elementos
    var dvContenedorElementos = document.getElementById(self.divItemContener);
    dvContenedorElementos.appendChild(objComptarea);

    var txtid = 'txtEscAct' + self.uniqueIdentifier;
    self.attachEventKeyDown(txtid);
    self.attachEventBlur(txtid);
    self.attachEventFocus(txtid);

    if (self.enableSearch == true) {
        self.attachEventKeyPress(txtid);
        //Se agregan los eventos mouseover y mouseout al resultado de la búsqueda
        var sresultid = 'dvSearch' + self.uniqueIdentifier;
        var fnmouseover = function (e) { self.mouseOverSearchResult = true; }
        var fnmouseout = function () { self.mouseOverSearchResult = false; }
        self.attachEvent(sresultid, 'mouseover', fnmouseover);
        self.attachEvent(sresultid, 'mouseout', fnmouseout);
    }
    var tarea = document.getElementById(txtid);
    tarea.focus();
    self.onEditing = true;
}
AlgoriaElementsBox.prototype.endEditing = function () {
    var self = this;
    var comptarea = document.getElementById('comptarea' + self.uniqueIdentifier);
    if (comptarea != undefined && comptarea != null) {
        try {
            comptarea.parentNode.removeChild(comptarea);
        } catch (e) { }
    }
    self.onEditing = false;

    // Inicialización de variables
    self.lastSearchCriteria = null;
    self.elementSelectedOnSearchList = -1;
    self.elementsFoundOnSearch = 0;
    self.mouseOverSearchResult = false;

    if (self.getItemsCount() <= 0) {
        self.createEmptyElement();
    } else {
        self.deleteEmptyElement();
    }
    // Si está activo el temporizado de búsqueda, entonces se desactiva
    if (self.temporizer != null) { window.clearTimeout(self.temporizer); }
}
AlgoriaElementsBox.prototype.createEmptyElement = function () {
    var self = this;
    var strEmp = '<div id="dvTE' + self.uniqueIdentifier + '" class="comptempty">' + self.initialText + '</div>';
    var dvC = document.getElementById(self.divItemContener);
    dvC.innerHTML = strEmp;
}
AlgoriaElementsBox.prototype.deleteEmptyElement = function () {
    var self = this;
    var dvEmp = document.getElementById('dvTE' + self.uniqueIdentifier);
    if (dvEmp != undefined && dvEmp != null) {
        dvEmp.parentNode.removeChild(dvEmp);
    }
}
AlgoriaElementsBox.prototype.attachEvent = function (id, event, fn) {
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
AlgoriaElementsBox.prototype.attachEventFocus = function (txtid) {
    var self = this;
    var fnfocus = function (e) {
        if (self.elementsFoundOnSearch > 0) {
            var listSearchResult = document.getElementById('dvSearch' + self.uniqueIdentifier);
            listSearchResult.style.display = ''; // Muestra
        }
    }
    self.attachEvent(txtid, 'focus', fnfocus);
}
AlgoriaElementsBox.prototype.attachEventBlur = function (txtid) {
    var self = this;
    var fnblur = function (e) {
        var txtobj = document.getElementById('txtEscAct' + self.uniqueIdentifier);
        if (self.mouseOverSearchResult == false) { // Si el mouse está fuera del recuadro de resultado de búsqueda
            if (txtobj.value == undefined || txtobj.value == null || txtobj.value == '') {
                self.endEditing();
            } else if (self.enableSearch == false) { // && self.onAddingItem({ 'value': txtobj.value, 'text': txtobj.value }) == true) {
                self.addItemsVSRegExp(txtobj.value);
            } else {
                self.setError();
                var listSearchResult = document.getElementById('dvSearch' + self.uniqueIdentifier);
                listSearchResult.style.display = 'none'; // Muestra
            }
        }
    }
    self.attachEvent(txtid, 'blur', fnblur);
}
AlgoriaElementsBox.prototype.attachEventKeyPress = function (txtid) {
    var self = this;
    var fnkeypress = function (e) {
        var txtobj = document.getElementById('txtEscAct' + self.uniqueIdentifier);
        if (self.temporizer != null) { window.clearTimeout(self.temporizer); } // eliminar temp
        self.temporizer = setTimeout(function () { self.dosearch(txtobj.value); }, 500); //Crear Temp
    }
    self.attachEvent(txtid, 'keypress', fnkeypress);
}
AlgoriaElementsBox.prototype.attachEventKeyDown = function (txtid) {
    var self = this;
    var fnonkeydown = function (e) {
        var kc = e.keyCode ? e.keyCode : e.which;
        var txtobj = document.getElementById('txtEscAct' + self.uniqueIdentifier);
        if (kc == 13 || kc == 9) {
            if (e.preventDefault) { e.preventDefault(); } else { (e.keyCode) ? e.keyCode = 0 : e.which = 0; }
            if (self.enableSearch == true) {
                if (self.elementSelectedOnSearchList > -1) {
                    self.clickItemSearchResult(self.elementSelectedOnSearchList);
                }
            } else {
                var txtval = txtobj.value;  // Estas dos líneas son por un problema en Chrome.. Se necesita
                txtobj.value = '';          // limpiar el cuadro de texto antes de agregar el elemento
                self.addItemsVSRegExp(txtval);
            }
        } else if (kc == 27) {
            self.endEditing();
        } else if (kc == 38) { // flecha arriba
            if (self.enableSearch) {
                if (self.elementsFoundOnSearch > 0) {
                    if (self.elementSelectedOnSearchList <= 0) {
                        self.elementSelectedOnSearchList = 0;
                    } else { self.elementSelectedOnSearchList--; }
                } else { self.elementSelectedOnSearchList = 0; }
                self.selectItemSearchResult(self.elementSelectedOnSearchList);
            } else {
                self.elementsFoundOnSearch = 0;
                self.elementSelectedOnSearchList = -1;
            }
        } else if (kc == 40) { // flecha abajo
            if (self.enableSearch == true) {
                if (self.elementsFoundOnSearch > 0) {
                    if (self.elementSelectedOnSearchList >= self.elementsFoundOnSearch) {
                        self.elementSelectedOnSearchList = self.elementsFoundOnSearch;
                    } else { self.elementSelectedOnSearchList++; }
                } else { self.elementSelectedOnSearchList = self.elementsFoundOnSearch; }
                self.selectItemSearchResult(self.elementSelectedOnSearchList);
            } else {
                self.elementsFoundOnSearch = 0;
                self.elementSelectedOnSearchList = -1;
            }
        } else {
            self.clearError();
            var dvOculto = document.getElementById('dvTOc' + self.uniqueIdentifier);
            dvOculto.style.width = '40px'; // Se resetea a 40px
            var vTemp = (txtobj.value != undefined && txtobj.value != null ? txtobj.value : '') + String.fromCharCode(kc);
            dvOculto.innerHTML = vTemp.replace(/[\w]|[\s]/gi, 'A');
            var w = (dvOculto.scrollWidth) ? dvOculto.scrollWidth : dvOculto.style.pixelWidth;
            dvOculto.style.width = w + 'px';
            txtobj.style.width = (w + 20) + 'px';
        }
    }
    self.attachEvent(txtid, 'keydown', fnonkeydown);
}
AlgoriaElementsBox.prototype.setError = function () {
    var self = this;
    var tarea = document.getElementById('txtEscAct' + self.uniqueIdentifier);
    if (tarea != null) {
        var cls = tarea.getAttribute('class');
        cls += ' comptareaediterror';
        tarea.setAttribute('class', cls);
    }
}
AlgoriaElementsBox.prototype.clearError = function () {
    var self = this;
    var tarea = document.getElementById('txtEscAct' + self.uniqueIdentifier);
    if (tarea != null) {
        var cls = tarea.getAttribute('class');
        cls = cls.replace(/comptareaediterror/gi, '');
        tarea.setAttribute('class', cls);
    }
}
AlgoriaElementsBox.prototype.addItemsVSRegExp = function (value) {
    var self = this;
    if (self.regularExpression == null) {
        var added = self.addItemInterno({ 'value': value, 'text': value });
        if (added == true) {
            self.endEditing();
            self.startEditing();
        }
    } else {
        // Si llega aquí significa que hay una expresion regular para evaluar.
        var re = new RegExp(self.regularExpression, 'g');

        var results = value.match(re);
        if (results == null || results.length <= 0) {
            self.setError();
            return;
        }

        var len = results.length;
        if (len == 1) {
            var inten = self.addItemInterno({ 'value': results[0], 'text': results[0] });
            if (inten == true) {
                self.endEditing();
                self.startEditing();
            }
            return;
        }
        for (var i = 0; i < len; i++) {
            self.addItemInterno({ 'value': results[i], 'text': results[i] });
        }
        self.endEditing();
        self.startEditing();
    }
}
AlgoriaElementsBox.prototype.onAddingItem = function (item) {
    return true;
}
AlgoriaElementsBox.prototype.addItems = function (items) {
    var self = this;
    for (var i = 0, len = items.length; i < len; i++) {
        self.addItem(items[i]);
    }
}
AlgoriaElementsBox.prototype.addItem = function (item) {
    var self = this;
    self.endEditing();
    //console.log(item);
    return self.addItemInterno(item);
}
AlgoriaElementsBox.prototype.addItemInterno = function (item) {
    var self = this;

    if (self.itemsCount >= self.maxItems) { return; } // No se permite agregar más elementos
    var added = true;
    if (self.onAddingItem != undefined && self.onAddingItem != null) {
        added = self.onAddingItem(item);
    }
    if (added == false) {
        self.setError();
        return added;
    }
    var idItem = '' + new Date().getTime() + '' + Math.floor((Math.random() * 100000) + 1);
    var dvContentItem = document.createElement('div');
    dvContentItem.id = 'item' + idItem;
    dvContentItem.setAttribute('itemId', idItem);
    dvContentItem.setAttribute('class', 'compitem');

    var dvCaption = document.createElement('div');
    dvCaption.id = 'caption' + idItem;
    dvCaption.setAttribute('itemId', idItem);
    dvCaption.setAttribute('class', 'compcapt');
    dvCaption.setAttribute('data-value', item.value);
    dvCaption.setAttribute('data-text', item.text);
    dvCaption.innerHTML = item.text;

    var dvDeleter = document.createElement('div');
    dvDeleter.id = 'deleter' + idItem;
    dvDeleter.setAttribute('itemId', idItem);
    dvDeleter.setAttribute('class', 'compdele');
    dvDeleter.innerHTML = 'x';

    dvContentItem.appendChild(dvCaption);
    dvContentItem.appendChild(dvDeleter);

    var ctl = document.getElementById(self.divItemContener);
    ctl.appendChild(dvContentItem);

    // Se asigna el evento para eliminar el DIV
    var eClick = function () {
        var aEliminar = document.getElementById('item' + idItem);
        var ctl11 = document.getElementById(self.divItemContener);
        ctl11.removeChild(aEliminar);
        self.itemsCount--; // Se resta
        if (self.itemsCount <= 0) { self.itemsCount = 0; }
        self.posDelete();
    }
    self.attachEvent('deleter' + idItem, 'click', eClick);
    // Termina de asignarse el evento de eliminación

    // Se elimina el elemento vacío si es que hay uno
    self.deleteEmptyElement();
    self.itemsCount++;
    //console.log(self.itemsCount);
    return added;
}
AlgoriaElementsBox.prototype.posDelete = function () {
    
}
AlgoriaElementsBox.prototype.getItems = function () {
    var self = this;
    var arr = new Array();
    var ctl = document.getElementById(self.divItemContener);
    if (ctl != undefined && ctl != null) {
        var items = ctl.getElementsByClassName('compitem');
        for (var i = 0, len = items.length; i < len; i++) {
            var itemId = items[i].getAttribute('itemId');
            var caption = document.getElementById('caption' + itemId);
            arr.push({ 'value': caption.getAttribute('data-value'), 'text': caption.getAttribute('data-text') });
        }
    }
    return arr;
}
AlgoriaElementsBox.prototype.getItemsCount = function () {
    var self = this;
    return self.itemsCount;
}
AlgoriaElementsBox.prototype.onsearching = function (criteria) {
    /*var arr = new Array();
    arr.push({ 'value': 1, 'text': 'Primer elemento' });
    arr.push({ 'value': 2, 'text': 'Segundo elemento' });
    arr.push({ 'value': 3, 'text': 'Tercero elemento' });
    arr.push({ 'value': 4, 'text': 'Cuarto elemento' });
    arr.push({ 'value': 5, 'text': 'Quinto elemento' });
    return arr;*/
    return new Array();
}
AlgoriaElementsBox.prototype.dosearch = function (criteria) {
    var self = this;
    if (self.lastSearchCriteria != criteria) {
        var listContener = document.getElementById('dvSearch' + self.uniqueIdentifier);
        self.lastSearchCriteria = criteria;
        if (criteria == '') {
            listContener.style.display = 'none';
            return;
        }
        self.elementSelectedOnSearchList = -1;
        listContener.style.display = '';
        listContener.innerHTML = '';
        var arr = self.onsearching(criteria);
        if (arr == undefined || arr == null) { self.elementsFoundOnSearch = 0; return; }
        // Crear los elementos de la lista
        var len = arr.length;
        self.elementsFoundOnSearch = len - 1;
        if (len > 0) {
            var elements = '';
            for (var i = 0; i < len; i++) {
                var dv = document.createElement('div');
                dv.id = 'searchitem' + i;
                dv.setAttribute('did', i);
                dv.setAttribute('class', 'compsearchitem');
                //dv.setAttribute('value', arr[i].value);
                //dv.setAttribute('text', arr[i].text);                
                dv.setAttribute('value', arr[i][self.fields && self.fields.length > 0 ? self.fields[0] : 'value']);
                dv.setAttribute('text', arr[i][self.fields && self.fields.length > 1 ? self.fields[1] : 'text']);
                dv.innerHTML = dv.getAttribute('text');
                dv.onclick = function (e) { self.clickItemSearchResult(this.getAttribute('did')); }
                dv.onmousemove = function (e) { self.selectItemSearchResult(this.getAttribute('did')); }
                listContener.appendChild(dv);
                //console.log(dv);
            }
        } else {
            listContener.innerHTML = '<div class="compsearchnoitems">' + self.noItemsFoundText + '</div>';
        }
    }
}
AlgoriaElementsBox.prototype.clickItemSearchResult = function (id) {
    var self = this;
    var itemdid = document.getElementById('searchitem' + id);
    var obj = { 'value': itemdid.getAttribute('value'), 'text': itemdid.getAttribute('text') };
    var txt = document.getElementById('txtEscAct' + self.uniqueIdentifier);
    txt.value = obj.text;
    var added = self.addItemInterno(obj);
    if (added == true) {
        self.endEditing();
        self.startEditing();
        self.posSelected();
    }
}

AlgoriaElementsBox.prototype.posSelected = function () {
}

AlgoriaElementsBox.prototype.selectItemSearchResult = function (id) {
    var self = this;
    var litemsresult = document.getElementsByClassName('compsearchitem');
    for (var i = 0, ln = litemsresult.length; i < ln; i++) {
        if (id == litemsresult[i].getAttribute('did')) {
            litemsresult[i].setAttribute('class', 'compsearchitem compsearchitemover');
        } else {
            litemsresult[i].setAttribute('class', 'compsearchitem');
        }
    }
    self.elementSelectedOnSearchList = parseInt(id);
}