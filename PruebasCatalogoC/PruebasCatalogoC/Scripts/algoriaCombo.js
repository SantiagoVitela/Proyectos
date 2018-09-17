/********************************************
AlgoriaCombo

/********************************************/
var AlgoriaCombo = function (comboinfo, url, fields, parentinfo) {

    this.comboID = ''; // Id del objeto HTML padre
    this.propertyCombo = ''; // Propiedad que se enviará en la llamada ajax
    this.url = url;
    this.fields = fields;  // objeto tipo { "Clave", "Descripcion" }
    this.parentID = '';
    this.propertyParent = '';
    this.value = '';
    this.fillEventEjecuting = false;
    this.data = null;
    // Si se cumple la siguiente condición, entonces en la posición #1 está el nombre de la propiedad
    // que se enviará junto con la url al servidor, y en la posición #2, está el id HTML del combo 
    // que se enlazará
    if (comboinfo.length != undefined && comboinfo.length > 1) {
        this.comboID = '#' + comboinfo[1]; // Id del objeto HTML padre
        this.propertyCombo = comboinfo[0]; // Propiedad que se enviará en la llamada ajax
    } else if (comboinfo != null && comboinfo != undefined && comboinfo != '') {
        this.comboID = '#' + comboinfo; // Id del objeto HTML padre
        this.propertyCombo = comboinfo; // Propiedad que se enviará en la llamada ajax
    }

    if (parentinfo != null && parentinfo != undefined) {
        if (parentinfo.length != undefined && parentinfo.length > 1) {
            this.parentID = '#' + parentinfo[1]; // Id del objeto HTML padre
            this.propertyParent = parentinfo[0]; // Propiedad que se enviará en la llamada ajax
        } else if (parentinfo != null && parentinfo != undefined && parentinfo != '') {
            this.parentID = '#' + parentinfo; // Id del objeto HTML padre
            this.propertyParent = parentinfo; // Propiedad que se enviará en la llamada ajax
        }
    }

    this.changeAttached = 0;

    this.selectOptions = $(this.comboID).find('option');

    // Si este combo esta relacionado a un combo padre, entonces enlaza el
    // evento 'hijotmb'
    // Este evento será lanzado por el padre cada vez qeu se ejecute correctamente su evento change
    this.bindFather();
}

AlgoriaCombo.prototype.refresh = function (filterData) {
    var self = this;
    self.fill(filterData);
}

AlgoriaCombo.prototype.fill = function (filterData) {
    var self = this;

    // Marca el inicio de la ejecución del métdoo fill
    self.fillEventEjecuting = true;

    if (self.changeAttached == 0) {
        $(self.comboID).unbind('change.algoriacombo');
        $(self.comboID).bind('change.algoriacombo',
                function (e) {

                    // El valor seleccionado, se pone en la propieadd value
                    self.value = $(self.comboID).val();

                    // Y se lanza el evento hijotmb
                    // Si es que hay uno configurado
                    if (self.fillEventEjecuting == false) {
                        $(self.comboID).trigger('hijotmb');
                    }
                });
        // Termina de sobreescribirse el evento change

        // Sólo una vez se agrega éste evento change
        self.changeAttached = 1;
    }

    // Enviar el dato de la propiedad padre en la petición
    var objAja = {};
    if (self.propertyParent != '') {
        objAja[self.propertyParent] = $(self.parentID).val();
        if (objAja[self.propertyParent] == null || objAja[self.propertyParent] == undefined || objAja[self.propertyParent] == '')
            objAja[self.propertyParent] = '-1';
    }

    // Se agregan filtros al objeto que se enviará al servidor
    if (filterData != null && filterData != undefined)
        $.extend(objAja, filterData);

    // Se ejecuta la llamada Ajax
    var peticion = new Peticion();
    peticion.dataType = 'json';
    peticion.url = self.url;
    peticion.json = objAja;
    peticion.async = false;
    peticion.addwait = false;

    // Se sobreescribe la función error
    peticion.error = function (data) {
        self.populateData(data);
    }
    peticion.posSolicitar = function (data) {
        self.populateData(data);
    }
    peticion.solicitar();

    // Marca el final de la ejecución del métdoo fill
    self.fillEventEjecuting = false;
}

AlgoriaCombo.prototype.populateData = function (data) {

    var self = this;

    // Se eliminan todos los options del combo
    $(self.comboID).children().remove();

    // Se agregan los elementos default
    self.selectOptions.each(function () {
        $(self.comboID).append(this); // Se agrega el elemento option
    });

    // Ahora, se itera la lista de objetos que vienen del servidor
    var strOPT = '';
    for (var i = 0; i < data.length; i++) {

        if (data[i][self.fields[0]] != undefined) {
            strOPT = '<option value="' + data[i][self.fields[0]] + '">' + data[i][self.fields[1]] + '</option>';
            $(self.comboID).append(strOPT); // Se agrega el elemento option
        }
    }

    self.data = data;
    // Finalmente, seteo un valor si es que hay configurado UNO
    self.setValue(self.value);
}

AlgoriaCombo.prototype.bindFather = function () {
    var self = this;
    if (self.parentID != null && self.parentID != undefined && self.parentID != '') {
        // Si hay configurado un combo padre, entonces modifico su evento change
        $(self.parentID).bind('hijotmb',
        function () {
            self.fillEventEjecuting = true;
            self.fill();
            self.fillEventEjecuting = false;
        });
    }
}

AlgoriaCombo.prototype.setValue = function (sVal) {
    var self = this;

    self.preSetValue();

    self.value = sVal;

    $(self.comboID).val(self.value);

    // Si hay un evento, entonces se lanza
    self.posSetValue();

    // Y se lanza el evento hijotmb
    // Si es que hay uno configurado
    if (self.fillEventEjecuting == false) {
        $(self.comboID).trigger('hijotmb');
    }
}
AlgoriaCombo.prototype.preSetValue = function (e) { };
AlgoriaCombo.prototype.posSetValue = function (e) { };

AlgoriaCombo.prototype.getValue = function () {
    var self = this;
    return self.value;
}

AlgoriaCombo.prototype.dispose = function () {

}

AlgoriaCombo.prototype.getItem = function (value) {
    var self = this;

    for (var i = 0; i < self.data.length; i++) {
        if (self.data[i][self.fields[0]] == value) {
            return self.data[i];
        }
    }

    return null;
};