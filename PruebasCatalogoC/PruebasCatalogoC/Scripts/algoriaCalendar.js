/********************************************************************
*   algoriaCalendar.js
*   Autor   :   Rene Quintero Alvarez
*   Fecha   :   18/Octubre/2012
*   Desc.   :   Calendario de algoria
                
********************************************************************/

// Variables para la presentacion de la fecha
var dias = new Array('Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles', 'Jueves', 'Viernes', 'S&aacute;bado');
var meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');

function getDateString(date, tipo) {

    var diasemana = date.getDay();
    var dia = date.getDate();
    var mes = date.getMonth();
    var anio = date.getFullYear();

    var mesmostrar = mes + 1;
    if (mesmostrar < 10)
        mesmostrar = '0'.concat(mesmostrar);

    if (dia < 10)
        dia = '0'.concat(dia);

    var str = '';
    if (tipo == 'short') {
        str = dia + '/' + mesmostrar + '/' + anio;
    }
    else if (tipo == 'medium') {
    str = dias[diasemana] + ', ' + dia + '/' + mesmostrar + '/' + anio;
    }
    else if (tipo == 'long') {
        str = dias[diasemana] + ', ' + dia + ' de ' + meses[mes] + ' de ' + anio;
    }

    return str;
}

function getDateEEUU(date) {
    var dia = date.getDate();
    var mes = date.getMonth();
    var anio = date.getFullYear();

    var mesmostrar = mes + 1;
    if (mesmostrar < 10)
        mesmostrar = '0'.concat(mesmostrar);

    if (dia < 10)
        dia = '0'.concat(dia);

    return anio + '-' + mesmostrar + '-' + dia;
    //return (''.concat(anio) + ''.concat(mesmostrar) + ''.concat(dia)).toString();
}

function getDateFromDateColumnKey(key) {

    var arr = key.split('-');
    var fecha = new Date(arr[0], arr[1]-1, arr[2]);
    return fecha;
}

function getDateEsMx(date, separador) {
    return AlgoriaFormat.fillleft(date.getDate(), '0', 2) + separador + AlgoriaFormat.fillleft((date.getMonth() + 1), '0', 2) + separador + date.getFullYear();
}

function getTimeEsMx(date, separador) {
    return AlgoriaFormat.fillleft(date.getHours(), '0', 2) + separador + AlgoriaFormat.fillleft(date.getMinutes(), '0', 2) + separador + AlgoriaFormat.fillleft(date.getSeconds(), '0', 2);
}

function getDateTimeEsMx(date, separadorFecha, separadorHora) {
    return getDateEsMx(date, separadorFecha) + " " + getTimeEsMx(date, separadorHora);
}

var AlgoriaCalendar = function (containerID) {

    // Variables para los estilos
    this.cellClass = 'cell';
    this.cellFixedClass = 'fixedcell';
    this.cellSelectedClass = 'cellselected';
    this.rowHeaderClass = 'rowheader';
    this.gridLinesClass = 'gridLines';

    // Declaración de variables
    this.containerID = containerID;
    this.cID = 'dv_alg_calendar' + new Date().getTime(); ;  // Contenedor de este calendario
    this.gridGeneral = null;
    this.viewType = 7;  // 1: 1dia, 2: Dos dias, 7: Semanal, 14:Quincenal//, 30:Mensual

    this.startDay = 6; // 0:Domingo - 6:Sabado
    this.startDate = null;
    this.endDate = null;
    this.title = '';

    // Almacena las columnas que representan las fechas del calendario(es decir, los dias).
    this.dateColumns = null;
    this.infoCols = new Array();
    this.colWidth = '';

    // almacena la informacion de las filas del calendario
    this.rows = new Array();
    this.rowHeight = '50px';

    // PAra conocer el formato como se muestra la fecha en los encabezados
    this.typeDateHeader = 'long'; // 'medium', 'long'. Default:'short'

    this.baseHTML = '';

    // Ids de los divs que contienen las secciones de navegacion y del control grid
    var navigationID = 'dvNav' + new Date().getTime();
    var controlID = 'dvSecControl' + new Date().getTime();

    var divs = '<div id="' + self.cID + '">';
    divs += '<div id="' + navigationID + '" section="navigation"></div>';
    divs += '<div id="' + controlID + '" section="control"></div>';
    divs += '</div>';

    this.baseHTML = divs;

    // Esta linea debe ejecutarse antes de la siguiente
    this.gridGeneral = new AlgoriaGrid(controlID);
    //this.gridGeneral.showRowHeader = false;

    this.calculateDateColumns = function () {

        // Determinar el día de la semana a empezar(la fecha)
        if (this.startDate == null)
            this.startDate = new Date();

        var diaActual = this.startDate.getDay();

        if (diaActual == this.startDay) {
            //this.startDate = new Date();
        }
        else if (diaActual > this.startDay) {

            var dif = diaActual - this.startDay;
            var fTent = new Date();
            fTent.setDate(this.startDate.getDate() - dif);

            this.startDate = fTent;

        } else if (diaActual < this.startDay) {

            var dif = this.startDay - diaActual;
            var fTent = this.startDate;
            fTent.setDate(this.startDate.getDate() - (this.startDay + 1));
            fTent.setDate(this.startDate.getDate() + dif);

            this.startDate = fTent;
        }

        // Aquí ya está definido el día que iniciará la pintada de columnas de nuestro calendario.
        // Ahora se debe revisar, cuántos dias se dibujarán.
        // Para ésto, se crean las columnas que representan los dias.
        var width = '';
        if (this.viewType == 1)
            width = '500px';
        else if (this.viewType == 2)
            width = '250px';
        else if (this.viewType == 7)
            width = '80px';
        else if (this.viewType == 14)
            width = '40px';

        // Si hay un valor configurado explícitamente para el grid, 
        // entonces se toma ese valor
        if (this.colWidth != '')
            width = this.colWidth;

        this.dateColumns = new Array();

        var fechaAc = this.startDate;
        for (var i = 0; i < this.viewType; i++) {

            var col = new ACalDateColumn(getDateEEUU(fechaAc));
            col.gridColumn.width = width;
            col.gridColumn.text = getDateString(fechaAc, this.typeDateHeader);

            this.dateColumns.push(col);

            fechaAc.setDate(fechaAc.getDate() + 1);
        }

        // Y se configura la fecha final
        fechaAc.setDate(fechaAc.getDate() - 1);
        this.endDate = fechaAc;

    };
}

AlgoriaCalendar.prototype.create = function () {
    var self = this;

    // Se eliminan todas las columnas del grid, porque se van a generar en éste método
    self.gridGeneral.removeAllColumns();

    self.calculateDateColumns();

    // Primero se agregan las columnas informativas
    var i = 0;
    var contInfo = 0;
    for (i = 0; i < self.infoCols.length; i++) {
        self.infoCols[i].gridColumn.tag = 'info';
        self.gridGeneral.addColumn(self.infoCols[i].gridColumn);
        self.infoCols[i].gridColumn = self.gridGeneral.columns[i];
        contInfo++;
    }

    // SE agregan las columnas de tipo fecha
    for (var j = 0; j < self.dateColumns.length; j++) {
        self.dateColumns[j].gridColumn.tag = 'date';
        self.gridGeneral.addColumn(self.dateColumns[j].gridColumn);
        self.dateColumns[j].gridColumn = self.gridGeneral.columns[contInfo + j];
    }

    // Se agregan las filas
    for (var i = 0; i < self.rows.length; i++) {
        self.gridGeneral.addRow(self.rows[i].gridRow);
    }

    $('#' + self.containerID).html(self.baseHTML);

    self.gridGeneral.cellClass = this.cellClass;
    self.gridGeneral.cellFixedClass = this.cellFixedClass;
    self.gridGeneral.cellSelectedClass = this.cellSelectedClass;
    self.gridGeneral.rowHeaderClass = this.rowHeaderClass;
    self.gridGeneral.gridLinesClass = this.gridLinesClass;

    // Se renderiza el grid.
    self.gridGeneral.render();

    self.containerID = '';
}

AlgoriaCalendar.prototype.addInfoCol = function (col) {

    var self = this;
    if (self.infoCols == null)
        self.infoCols = new Array();

    if (col != null) {
        self.infoCols.push(col);
        
//        if(self.gridGeneral != null)
//            self.gridGeneral.addColumn(col.gridColumn);
    }
}

AlgoriaCalendar.prototype.addRow = function (row) {

    var self = this;
    if (self.rows == null)
        self.rows = new Array();

    if (row != null) {
        row.gridRow.height = self.rowHeight;
        self.rows.push(row);

        //        if (self.gridGeneral != null)
        //            self.gridGeneral.addRow(row.gridRow);
    }
}

AlgoriaCalendar.prototype.refresh = function () {
    this.create();
}

AlgoriaCalendar.prototype.goToDate = function (date) {
    var self = this;

    self.startDate = date;
    self.create();
}

AlgoriaCalendar.prototype.getDateColumn = function (date) {

    var self = this;
    var dateEEUU = getDateEEUU(date);
    var col = null;

    // Se localiza la posicion de la columna en el grid
    for (var ik = 0; ik < self.dateColumns.length; ik++) {

        if (dateEEUU == self.dateColumns[ik].key) {
            col = self.dateColumns[ik];

            break;
        }
    }
    return col;
}

AlgoriaCalendar.prototype.getRow = function (key) {

    var self = this;
    var row = null;

    // Ahora se localiza la fila a la que se le seteará el valor
    for (var j = 0; j < self.rows.length; j++) {
        if (key == self.rows[j].key) {
            row = self.rows[j];
            break;
        }
    }
    return row;
}

AlgoriaCalendar.prototype.setValue = function (key, date, value) {

    var self = this;

    // Se hace la conversion a fecha
    var miDate = getDateFromDateColumnKey(date);
    //console.log(date);
    //console.log(miDate);

    var col = self.getDateColumn(miDate);
    var row = self.getRow(key);

    // Si col o row son nullos, entonces no sigue la ejecución
    if (col == null || row == null)
        return;

    // Si llega a este punto, entonces se actualiza la informacion del grid        
    self.gridGeneral.setCellValue(col.gridColumn.position, row.gridRow.position, value);
}

AlgoriaCalendar.prototype.getValue = function (key, date) {

    var self = this;

    // Se hace la conversion a fecha
    var miDate = new Date(date);

    var col = self.getDateColumn(miDate);
    var row = self.getRow(key);

    // Si col o row son nullos, o alguno es null, entonce no sigue la ejecución
    if (col == null || row == null)
        return null;

    // Si llega a este punto, entonces se actualiza la informacion del grid        
    return self.gridGeneral.getCellValue(col.gridColumn.position, row.gridRow.position);
}

AlgoriaCalendar.prototype.getSelectedCells = function () {

    var self = this;
    var selected = self.gridGeneral.getSelectedCells();

    //console.log(selected);

    if (selected == null)
        return null;

    var x = 0;
    var y = 0;

    // A cada objeto que me regresó el método getSelectedCells del gridGeneral
    // debo agregarle 2 propiedades, una es el key y la otra la fecha del calendario.
    // despues se regresa al usuario
    for (var i = 0; i < selected.length; i++) {

        // La clase AlgoriaCalendar tiene 2 tipos de columnas.
        // Las columnas informativas 'infoCols' y las columnas de datos 'dateColumns'
        // Siempre se ponen primero las columnas de tipo infoCols.
        // Pero para el grid interno, siempre son consecutivas
        x = selected[i].col - self.infoCols.length;
        y = selected[i].row;

        selected[i].key = this.rows[y].key;
        selected[i].date = this.dateColumns[x].key;
    }

    // En este punto, todos los objetos de la coleccion selected, tienen 2 propiedades mas..
    // la propiedad key y la propiedad date
    return selected;

}

var ACalDateColumn = function (date) {

    this.key = date;
    this.gridColumn = new AlgoriaGridColumn();
}

var ACalInfoColumn = function (text, width, datafield) {
    this.gridColumn = new AlgoriaGridColumn();
    this.gridColumn.text = text;
    this.gridColumn.width = width;
    this.gridColumn.datafield = datafield;
    this.gridColumn.fixed = true;
}

var ACalRow = function (key, json) {

    this.key = key;
    this.gridRow = new AlgoriaGridRow();
    this.gridRow.rowdata = json;
}