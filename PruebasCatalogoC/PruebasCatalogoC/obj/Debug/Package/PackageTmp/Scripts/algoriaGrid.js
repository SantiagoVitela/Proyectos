/********************************************************************
*   AlgoriaGrid.js
*   Autor   :   Rene Quintero Alvarez
*   Fecha   :   18/Octubre/2012
*   Desc.   :   Grid de propósito general.
                Ofrece funcionalidad para seleccionar celdas, agregar filas, configurar las columnas.
********************************************************************/
var AlgoriaGrid = function (containerID) {

    // Variables para almacenar las clases css del grid
    this.cellClass = 'cell';
    this.cellFixedClass = 'fixedcell';
    this.cellSelectedClass = 'cellselected';
    this.rowHeaderClass = 'rowheader';
    this.gridLinesClass = 'gridLines';

    this.renderized = false;
    this.strHTML = '';
    this.containerID = containerID;
    this.cID = 'dv_grid_general' + new Date().getTime();

    this.allowCellSelection = true;

    this.columns = new Array();
    this.rows = new Array();

    // Para saber si muestra o no una celda de tipo encabezado al principio de las filas
    this.showRowHeader = true;

    // Para saber si se muestran las lineas del grid
    this.gridLines = true;

    // Métodos privados
    this.creaGridHeader = function () {

        var c;
        var styles = '';
        this.strHTML = '<table cellpadding="0" cellspacing="0">';
        this.strHTML += '<thead>';
        this.strHTML += '<tr class="header">';

        if (this.showRowHeader == true) {
            this.strHTML += '<td class="' + this.rowHeaderClass + '" y="-1">&nbsp;</td>';
        }

        for (var ic = 0; ic < this.columns.length; ic++) {

            c = this.columns[ic];

            styles = 'style="';
            if (c.alignment)
                styles += 'text-align:' + c.alignment + ';';

            if (c.width)
                styles += 'width:' + c.width + ';min-width:' + c.width + ';';

            if (c.visible == false)
                styles += 'display:none;';

            styles += '"';

            this.strHTML += '<td class="' + this.rowHeaderClass + '" ' + styles + ' x="' + c.position + '" fixed="' + c.fixed + '">' + c.text + '</td>';

        }
        this.strHTML += '<tr>';
        this.strHTML += '</thead>';
    }

    // Crea todas las filas.. se utiliza
    this.creaAlgoriaGridRows = function () {

        this.strHTML += '<tbody>';

        for (var ii = 0; ii < this.rows.length; ii++) {

            this.strHTML += this.creaRowHTML(ii);

        }
        this.strHTML += '</tbody>';
    }

    this.creaGridFooter = function () {

        this.strHTML += '<tfoot>';

        this.strHTML += '</tfoot>';
        this.strHTML += '</table>';

    }

    // Genera el html para una fila específica
    this.creaRowHTML = function (rowpos) {

        var gRow = this.rows[rowpos];
        var sRow = '<tr ';

        var rowstyle = 'style="';
        if (gRow.height)
            rowstyle += 'height:' + gRow.height;

        rowstyle += '"';

        sRow += rowstyle + '>';

        var fixed = '';
        var c;

        if (this.showRowHeader == true) {
            sRow += '<td class="' + this.rowHeaderClass + '" y="' + gRow.position + '">' + ++rowpos + '</td>';
        }

        var data = '';
        for (var i = 0; i < this.columns.length; i++) {

            c = this.columns[i];

            styles = 'style="';
            if (c.alignment)
                styles += 'text-align:' + c.alignment + ';';

            if (c.width)
                styles += 'width:' + c.width + ';min-width:' + c.width + ';';

            // Si la columna donde va esta celda está oculta o toda la fila está oculta.
            if (c.visible == false || gRow.visible == false)
                styles += 'display:none;';

            styles += '"';

            var claseCelda = '';
            if (c.fixed == true || gRow.fixed == true) {
                fixed = ' fixed="true" ';
                claseCelda = this.cellFixedClass;
            } else {
                fixed = ' fixed="false" ';
                claseCelda = this.cellClass;
            }

            //console.log(gRow.rowdata[c.datafield]);
            data = '';
            if (gRow.rowdata[c.datafield] != null || gRow.rowdata[c.datafield] != undefined)
                data = gRow.rowdata[c.datafield];

            sRow += '<td class="' + claseCelda + '" ' + styles + fixed + ' x="' + c.position + '" y="' + gRow.position + '">' + data + '</td>';

        }
        sRow += '</tr>';

        return sRow;

    }
}

// Escribe el grid en el contendor especificado
AlgoriaGrid.prototype.render = function () {

    var self = this;

    var div = '<div id="' + self.cID + '" style="height:100%; width:100%;">';

    self.creaGridHeader();
    self.creaAlgoriaGridRows();
    self.creaGridFooter();

    div += self.strHTML;

    // Se agrega un input hidden para saber cuando está presionado el botón del mouse
    div += '<input type="hidden" id="mousepressed" value="0"/>';

    div += '</div>';

    $('#' + self.containerID).html(div);

    // Se preparan las celdas del grid
    this.prepareCells();

    // Se agregan los eventos a las celdas de tipo headers
    // Esto es para que al hacer click sobre una celda encabezado, se seleccione toda la columan o fila
    this.addHeaderEvents();

    // Se activa o desactiva la seleccion múltiple de celdas
    this.setAllowCellSelection(this.allowCellSelection);

    // Lineas del grid
    if (self.gridLines)
        this.showGridLines();
    else
        this.hideGridLines();

    // indica que ya está renderizado
    this.renderized = true;
    //this.containerID = '';
}

AlgoriaGrid.prototype.refresh = function () {
    var self = this;
    self.render();
}

AlgoriaGrid.prototype.addHeaderEvents = function () {

    // Se agregan eventos a las celdas que funcionan como headers
    var self = this;

    // Se elimina cualquier manejador del evento click de las celdas que tengan la clase rowheader
    $('#' + self.cID + ' table td.' + self.rowHeaderClass + ':not([fixed="true"]').unbind('click');

    $('#' + self.cID + ' table td.' + self.rowHeaderClass + ':not([fixed="true"]').click(function (e) {
        $('#' + self.cID + ' table tbody td:not([fixed="true"]').removeClass(self.cellSelectedClass);

        var x = $(this).attr('x');
        var y = $(this).attr('y');

        //console.log('entro');

        if (y == null) {

            // Si entra aqui, entonces se busca el atributo x
            $('#' + self.cID + ' table tbody td[x="' + x + '"]:not(.' + self.rowHeaderClass + ')').addClass(self.cellSelectedClass);

        } else if (y == -1) {
            // A todas las celdas se les pone la clase cellselected
            $('#' + self.cID + ' table tbody td:not(.' + self.rowHeaderClass + '):not([fixed="true"])').addClass(self.cellSelectedClass);
        } else {
            $('#' + self.cID + ' table tbody td[y="' + y + '"]:not(.' + self.rowHeaderClass + '):not([fixed="true"])').addClass(self.cellSelectedClass);
        }
    });
}

AlgoriaGrid.prototype.setDataSource = function (json) {

    var self = this;

    // Crear la lista de filas a partir del datasource y de la lista de columnas
    var fila;

    if (self.rows == null || self.rows.length <= 0) {
        fila = 0;
    } else {
        fila = self.rows.length;
    }

    if (json != null) {
        for (var j = 0; j < json.length; j++) {
            fila = AlgoriaGridRow.createRow();
            fila.position = j;
            fila.rowdata = json[j];
            self.rows.push(fila);
        }
    }
}

AlgoriaGrid.prototype.getDataJSON = function () {
    var self = this;

    if (self.rows == null || self.rows.length <= 0)
        return null;

    var jsonArray = new Array();

    for (var i = 0; i < self.rows.length; i++) {

        jsonArray.push(self.rows[i].rowdata);

    }

    return jsonArray;
}

AlgoriaGrid.prototype.addColumn = function (col) {

    // Se calcula la posicion que tiene ésta columna en el vector de columnas.
    // Esta posicion se utiliza para los métodos hide y show de la clase ALgoriaGridColumn
    var position = this.columns.length;
    col.position = position;

    col.parent = this;
    this.columns.push(col);

    // Si el grid ya fué renderizado, entonces se debe agregar ésta columna en tiempo real
    // Esto se deja para el final
    if (this.renderized) {

    }
}

AlgoriaGrid.prototype.removeColumn = function (index) {

    var self = this;

    // Si no hay columnas en el grid, no hace nada
    if (self.columns == null)
        return;

    // Se elimina el elemento actual de la matriz de columnas
    self.columns.splice(index, 1);
    $('#' + self.cID + ' table td[x="' + index + '"]').remove();

}

AlgoriaGrid.prototype.removeAllColumns = function (index) {

    var self = this;
    self.columns = null;
    self.columns = new Array();
    self.render();
}

AlgoriaGrid.prototype.addRow = function (row) {

    var self = this;

    // Se calcula la posicion que tiene ésta fila en el vector de filas.
    // Esta posicion se utiliza para los métodos hide y show de la clase RowColumn
    var position = self.rows.length;
    row.position = position;
    row.parent = self;

    self.rows.push(row);

    // Si el grid ya fué renderizado, entonces se debe agregar ésta fila en tiempo real
    if (self.renderized) {

        var cellSel = self.allowCellSelection;
        self.setAllowCellSelection(false);

        var rowHTML = self.creaRowHTML(position);
        $('#' + self.cID + ' table tbody').append(rowHTML);

        // La sigueinte linea es necesaria para darle a los encabezados de las filas la funcionalidad
        // de seleccionar toda la fila al hacer click sobre él
        self.addHeaderEvents();

        if (cellSel == true)
            self.setAllowCellSelection(cellSel);

        // Se muestran las lineas del grid
        if (self.gridLines == true) {
            self.showGridLines();
        }
    }
}

AlgoriaGrid.prototype.removeRow = function (index) {

    var self = this;

    // Si no hay columnas en el grid, no hace nada
    if (self.rows == null)
        return;

    // Se elimina el elemento actual de la matriz de columnas
    self.rows.splice(index, 1);
    $('#' + self.cID + ' table td[y="' + index + '"]').remove();

}

AlgoriaGrid.prototype.removeAllRows = function () {
    var self = this;
    self.rows = null;
    self.rows = new Array();
    self.render();
}


AlgoriaGrid.prototype.prepareCells = function () {

    var self = this;

    $('#' + self.cID + ' table tbody td').attr('unselectable', 'on');
    $('#' + self.cID + ' table tbody td').addClass('unselectable');

    //$('#' + self.cID + ' table tbody td[fixed="true"]').addClass(self.cellFixedClass);
}

AlgoriaGrid.prototype.setAllowCellSelection = function (allow) {

    var self = this;

    self.allowCellSelection = allow;

    var miX = 0;
    var miY = 0;
    var xmenor = 0;
    var ymenor = 0;
    var xmayor = 0;
    var ymayor = 0;

    // Siempre se puede seleccionar de a una Celda..
    // Si el parámetro recibido en ésta función es true, entonces se permite la selección de
    // varias celdas a la vez
    $('#' + self.cID + ' table tbody td:not([fixed="true"])').unbind('mousedown');
    $('#' + self.cID + ' table tbody td:not([fixed="true"]').mousedown(function (e) {

        $('#' + self.cID + ' table tbody td:not([fixed="true"]').removeClass(self.cellSelectedClass);
        $('#' + self.cID + ' #mousepressed').val('1');

        $(this).addClass(self.cellSelectedClass);

        miX = $(this).attr('x');
        miY = $(this).attr('y');

    });  
    
    // Si se cumple la siguiente ccondicion, entonces se activa la seleccion múltiple de celdas
    if (self.allowCellSelection == true) {

        $('#' + self.cID + ' table tbody td:not([fixed="true"]').unbind('mouseover');
        $('#' + self.cID + ' table tbody td:not([fixed="true"]').unbind('mouseup');

        // Se agregan los eventos que simulan la seleccion de las filas
        $('#' + self.cID + ' table tbody td:not([fixed="true"]').mouseover(function (e) {
            var aux = $('#' + self.cID + ' #mousepressed').val();

            if (aux == "1") {

                var x = Number($(this).attr('x'));
                var y = Number($(this).attr('y'));

                if (miX < x) {
                    xmenor = miX;
                    xmayor = x;
                } else {
                    xmenor = x;
                    xmayor = miX;
                }
                if (miY < y) {
                    ymenor = miY;
                    ymayor = y;
                } else {
                    ymenor = y;
                    ymayor = miY;
                }

                $('#' + self.cID + ' table tbody td:not([fixed="true"]').removeClass(self.cellSelectedClass);
                for (var imenor = xmenor; imenor <= xmayor; imenor++) {
                    for (var jmenor = ymenor; jmenor <= ymayor; jmenor++) {

                        $('#' + self.cID + ' table tbody td[x="' + imenor + '"][y="' + jmenor + '"]:not([fixed="true"]').addClass(self.cellSelectedClass);
                    }
                }
            }
        });

        $('#' + self.cID + ' table tbody td:not([fixed="true"]').mouseup(function (e) {
            $('#' + self.cID + ' #mousepressed').val('0');
        });

    } else {

        $('#' + self.cID + ' table tbody td:not([fixed="true"]').unbind('mouseover');
        //$('#' + self.cID + ' table tbody td').unbind('mousedown');
        $('#' + self.cID + ' table tbody td:not([fixed="true"]').unbind('mouseup');
    }
}

AlgoriaGrid.prototype.getSelectedCells = function () {
    var self = this;
    var cells = new Array();
    $('#' + self.cID + ' table td.' + self.cellSelectedClass).each(function () {
        cells.push({ 'col': $(this).attr('x'), 'row': $(this).attr('y') });
    });

    return cells;
}

AlgoriaGrid.prototype.setCellValue = function (col, row, value) {
    var self = this;

    // Se actualiza el json
    this.rows[row].rowdata[this.columns[col].datafield] = value;

    // Se actualiza el texto de la celda en el grid
    $('#' + self.cID + ' table td[x="' + col + '"][y="' + row + '"]').text(value);
}

AlgoriaGrid.prototype.getCellValue = function (col, row) {
    var self = this;
    //var value = $('#' + self.cID + ' table td[x="' + col + '"][y="' + row + '"]').text();
    var value = this.rows[row].rowdata[this.columns[col].datafield];
    return value;
}

AlgoriaGrid.prototype.showGridLines = function () {
    var self = this;
    $('#' + self.cID + ' table td').addClass(self.gridLinesClass);
}

AlgoriaGrid.prototype.hideGridLines = function () {
    var self = this;
    $('#' + self.cID + ' table td').removeClass(self.gridLinesClass);
}



// Definición de la clase Columna
var AlgoriaGridColumn = function () {
    this.text = '';
    this.width = '150px';
    this.alignment = 'left';
    this.visible = true;
    this.fixed = false;
    this.datafield = '';
    this.parent = '';
    this.position = 0;
    this.tag = ''; // cualquier valor.. como una bandera
}

AlgoriaGridColumn.createColumn = function (texto, datafield, ancho, alignment, visible, fixed) {
    var col = new AlgoriaGridColumn();
    col.text = texto;
    col.datafield = datafield;

    if (ancho)
        col.width = ancho;

    if (visible)
        col.visible = visible;

    if (alignment)
        col.alignment = alignment;

    if (fixed)
        col.fixed = fixed;

    // Se regresa la instancia del objeto recién creado
    return col;
}

AlgoriaGridColumn.prototype.hide = function () {

    var self = this;
    $('#' + self.parent.cID + ' table td[x="' + self.position + '"]').css('display', 'none');

    // se marca como fila oculta
    this.visible = false;

}

AlgoriaGridColumn.prototype.show = function () {

    var self = this;
    var clases = '';
    $('#' + self.parent.cID + ' table td[x="' + self.position + '"]').each(function (e) {

        $(this).css('display', 'block');

    });

    this.visible = true;

    self.parent.setAllowCellSelection(self.parent.allowCellSelection);
}

// Definición de la clase Fila
var AlgoriaGridRow = function () {
    this.fixed = false;
    this.visible = true;
    this.height = '40px';
    this.rowdata = null;
    this.parent = '';
    this.position = 0;
    this.tag = ''; // Puede almacenar cualquier valor.. como una bandera
}

AlgoriaGridRow.createRow = function (alto, visible, fixed) {
    var fila = new AlgoriaGridRow();
    if (alto)
        fila.height = alto;

    if (visible)
        fila.visible = visible;

    if (fixed)
        fila.fixed = fixed;

    return fila;
}

AlgoriaGridRow.createRow = function (json) {

    var fila = new AlgoriaGridRow();
    fila.rowdata = json;

    return fila;
}