/*
    Clase : Contenedor
    Autor : Algoria Software.
    Descr : Clase que maneja el tratamiento de un contenedor como un div o un form, como si fuera un formulario
    Fecha : 29/Sept/2012
*/
function Contenedor(id) {

    this.id = id;
    this.json = null;

    // El miembro extraJson, permite configurarle al objeto un json de datos que será tomado en cuenta a la hora de ejecutar
    // el método doAction.
    // Por ejemplo, puedo crear un objeto json de la sig manera
    //      var extraDatos = {};
    //      extraDatos.Farmacia = 2;
    //      self.appenJsonData(extraDatos);
    //      self.doAction();
    this.extraJson = null;

    this.readonly = false;
    this.attrType = 'data-field';
    this.multiSelectSeparator = '<br/>';

    this.LabelList = new Array();
    this.readPropertyAsList = new Array();
    this.properties = {};

    // Guarda una lista de visibilidad de elementos enlazados a propiedades de objeto VO
    this.readModePropertyObject = {};

    // Lista de reglas de validacion del formulario
    this.validationRulesList = new Array();

    // Objeto que mantiene a los combos generados internamente
    this.objectOfCombos = {};

    this.initDataTypes();

    // Inicializar las ayudas
    this.helpsArray = null;
    this.initHelps();

    // Esta variable almacena una funcion dispose
    this.fnDispose = null;

    // Acción default que se envía al servidor
    // Esta acción está disponible para la seguridad del sistema
    this.defaultAction = null;

    // Por default todas las llamadas son asyncronas
    this.actionAsync = true;

    // Aplica para todos los formularios inicializados
    //$('#' + this.id).show();
};

Contenedor.prototype.appendJsonData = function (data) {
    var self = this;
    if (self.extraJson == null)
        self.extraJson = {};

    self.extraJson = data;
}

// Identifica el tipo de lectura que se le dará a las propiedades.
// Los valores permitidos son:
//      1.- valor (los valores son tomados como valor. Si hay más de un valor, entonces se regresarán separados por una coma.)
//      2.- array (los valores serán leídos como array. si sólo hay un valor, entonces se regresará un array con una posicion.)
Contenedor.prototype.leerPropiedadComo = function (prop, tipo) {
    var self = this;
    var obj = { 'Prop': prop, 'Tipo': tipo };
    self.readPropertyAsList.push(obj);
}

// Métodos que actúan directamente sobre los elementos del DOM
Contenedor.prototype.ocultaElemento = function (selector) {
    var self = this;
    $('#' + self.id).find(' ' + selector).css('visibility', 'hidden');
}
Contenedor.prototype.muestraElemento = function (selector) {
    var self = this;
    $('#' + self.id).find(' ' + selector).css('visibility', 'visible');
}

// Asociar efectos por un selector general
Contenedor.prototype.style = function (selector, style, value) {
    var self = this;
    $('#' + self.id).find(' ' + selector).css(style, value);
}
Contenedor.prototype.attr = function (selector, attr, value) {
    var self = this;
    $('#' + self.id).find(' ' + selector).attr(attr, value);
}
Contenedor.prototype.addEvento = function (selector, nombreEvento, func) {
    var self = this;
    $('#' + self.id).find(selector).bind(nombreEvento, func);
}
Contenedor.prototype.removeEvento = function (selector, nombreEvento) {
    var self = this;
    $('#' + self.id).find(selector).unbind(nombreEvento);
}
// Termina Asociar efectos por un selector general

// Asociar efectos por el nombre de la propiedad
Contenedor.prototype.addClassProperty = function (prop, classCss) {
    var self = this;
    $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]').each(function () {
        $(this).addClass(classCss);
    });
}
Contenedor.prototype.removeClassProperty = function (prop, classCss) {
    var self = this;
    $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]').each(function () {
        $(this).removeClass(classCss);
    });
}
Contenedor.prototype.styleProperty = function (property, style, value) {
    var self = this;
    $('#' + self.id).find('[' + self.attrType + '="' + property + '"]').css(style, value);
}
Contenedor.prototype.attrProperty = function (property, attr, value) {
    var self = this;
    $('#' + self.id).find('[' + self.attrType + '="' + property + '"]').attr(attr, value);
}
Contenedor.prototype.addEventProperty = function (property, nombreEvento, func) {
    var self = this;
    $('#' + self.id).find('[' + self.attrType + '="' + property + '"]').each(function () {
        $(this).bind(nombreEvento, func);
    });
}
// Termina Asociar efectos por el nombre de la propiedad

Contenedor.prototype.removeLabels = function () {

    var self = this;

    // En este punto, lo primero que debe hacerse es eliminar todos los labels
    // que pudieron haber sido creados anteriormente con éste  mismo objeto
    for (var i = 0; i < self.LabelList.length; i++) {

        $('#' + self.id).find('[id="' + self.LabelList[i] + '"]').each(function () {

            $(this).remove();
        });
    }
}

// Devuelve un json tomando los controles html para formarlo.
// Los controles html soportados son:
//  text, textarea, check, radio, select, hidden, password
Contenedor.prototype.getJSON = function () {

    // Este proceso se ejecuta en 2 pasos.. primero obtiene todos los elementos que tienen asignado un valor
    // en el atributo self.attrType. Después, busca los elementos HTML que no tienen el atributo self.attrType, y tmb
    // los agrega al json resultante. Finalmente regresa el JSON

    var self = this;
    var propsLeidas = new Array();
    var objJson = {};

    $('#' + self.id).find('[' + self.attrType + ']').each(function () {

        var valorAttr = $(this).attr(self.attrType);

        // Si el valor de la propiedad es un valor que se puede usar como una clave válida
        // de la estructura del objeto JSON
        if (valorAttr != null && valorAttr != undefined && valorAttr != '') {

            // Si la propiedad que se intenta leer actualmente, todavía no se ha leído
            // entonces se procede a leerla.
            if (propsLeidas.indexOf(valorAttr) < 0) {

                objJson[valorAttr] = self.getProperty(valorAttr);

                // Despues de leerse, se agrega la propiedad al arreglo de propiedades leídas.
                propsLeidas.push(valorAttr);
            }
        }
    });

    return objJson;
}

//Permite leer una propiedad del formulario
Contenedor.prototype.getProperty = function (prop) {

    var self = this;

    var me = null;
    var mes = $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]'); //.eq(0); // El primer elemento de la colección
    if (mes != undefined && mes != null) {
        me = mes[0];
    }

    if (me == null) {
        return;
    }

    var value;
    var type = $(me).attr('type');
    var tag = $(me).prop('tagName').toLowerCase();

    //console.log('tipo: ' + type + ' tag: ' + tag);

    var tipoLectura = 'default';
    for (var i = 0; i < self.readPropertyAsList.length; i++) {
        var v = self.readPropertyAsList[i];
        if (v.Prop == prop) {
            tipoLectura = v.Tipo;
            break;
        }
    }

    // Evaluar cada uno de los posibles tipos de elementos
    if (type == 'text') {
        value = self.getFieldText(me);
    }
    else if (tag == 'textarea') {
        value = self.getFieldTextArea(me);
    }
    else if (type == 'password') {
        value = self.getFieldPassword(me);
    }
    else if (type == 'hidden') {
        value = self.getFieldHidden(me);
    }
    else if (type == 'checkbox' || type == 'radio') {
        tipoLectura = 'valor';
        value = self.getFieldCheckOrRadio(me, tipoLectura);
    }
    else if (tag == 'select') {
        if ($(me).attr('multiple') != null && $(me).attr('multiple') != undefined)
            value = self.getFieldSelectMult(me, tipoLectura);
        else {
            value = self.getFieldSelect(me, tipoLectura);
        }
    }
    else if (tag == 'label') {
        value = self.getFieldLabel(me);
    }

    var dataType = $(me).attr('data-type');
    if (dataType != null && dataType != undefined) {
        var ss = dataType.split(',');
        if (ss[0] == 'number')
            value = AlgoriaFormat.unformat(value);
    }

    return value;
}

//Permite leer una propiedad del formulario
Contenedor.prototype.getPropertyText = function (prop) {

    var self = this;

    var me = $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]').eq(0); // El primer elemento de la colección

    var value;
    var type = $(me).attr('type');
    var tag = $(me).prop('tagName').toLowerCase();

    var tipoLectura = 'default';
    for (var i = 0; i < self.readPropertyAsList.length; i++) {
        var v = self.readPropertyAsList[i];
        if (v.Prop == prop) {
            tipoLectura = v.Tipo;
            break;
        }
    }

    // Evaluar cada uno de los posibles tipos de elementos
    if (type == 'text') {
        value = self.getFieldText(me);
    }
    else if (tag == 'textarea') {
        value = self.getFieldTextArea(me);
    }
    else if (type == 'password') {
        value = self.getFieldPassword(me);
    }
    else if (type == 'hidden') {
        value = self.getFieldHidden(me);
    }
    else if (type == 'checkbox' || type == 'radio') {
        value = self.getFieldCheckOrRadio(me, tipoLectura);
    }
    else if (tag == 'select') {
        tipoLectura = 'valor';
        if ($(me).attr('multiple') != null && $(me).attr('multiple') != undefined) {
            value = self.getFieldSelectMult(me, tipoLectura, true);
        }
        else {
            value = self.getFieldSelect(me, tipoLectura, true);
        }
    }
    else if (tag == 'label') {
        value = self.getFieldLabel(me);
    }

    return value;
}

Contenedor.prototype.getFieldText = function (objField) {
    var value = $(objField).attr('value');
    return value;
}
Contenedor.prototype.getFieldTextArea = function (objField) {
    var value = '';
    value = $(objField).val();
    return value;
}
Contenedor.prototype.getFieldPassword = function (objField) {
    var value = $(objField).attr('value');
    return value;
}
Contenedor.prototype.getFieldHidden = function (objField) {
    var value = $(objField).attr('value');
    return value;
}
Contenedor.prototype.getFieldLabel = function (objField) {
    var value = $(objField).text();
    return value;
}
Contenedor.prototype.getFieldCheckOrRadio = function (objField, tipoLectura) {

    var self = this;

    // Sacamos el valor del atributo 'self.attrType'(alg_field)
    var propAttr = $(objField).attr(self.attrType);
    var vArray = new Array();
    var value;

    // Se seleccionan todos los elementos del grupo de checkbox o grupo de radios
    $('#' + self.id).find('[' + self.attrType + '="' + propAttr + '"]:checked').each(function () {
        vArray.push($(this).attr('value'));
    });

    var propName = self.properties[propAttr];

    if (tipoLectura == 'default' || tipoLectura == 'array') {
        // Si se pide que ésta propiedad se lea como arreglo, entonces se debe revisar si hay una 
        // propiedad de objeto configurada en el arreglo properties. Si existe esa propiedad, entonces
        // el arreglo que se debe regresar debe ser una lista de objetos con la propiedad indicada igual al 
        // valor obtenido del objeto.

        if (propName == null || propName == undefined || propName == '')
            propName = 'Clave';

        value = new Array();
        for (var i = 0; i < vArray.length; i++) {
            var obj = {};
            obj[propName] = vArray[i];
            value.push(obj);
        }
        vArray = null;

    } else {

        // Se convierte el arreglo en una cadena separada de comas
        var ret = '';
        for (var i = 0; i < vArray.length; i++) {
            ret += (ret == '') ? vArray[i] : ',' + vArray[i];
        }

        // Si se pide leer esta propiedad como valor, peeeeeeero, hay configurada un valor para esta propieadd
        // en el objeto self.properties, entonces debe regresarse un objeto con la propiedad configurada
        // igual al valor de los elementos selccionados
        if (propName == null || propName == undefined || propName == '')
            value = ret;
        else {
            value = {};
            value[propName] = ret;
        }
    }

    return value;
}

Contenedor.prototype.getFieldSelect = function (objField, tipoLectura, leerComoTexto) {
    var self = this;

    // Sacamos el valor del atributo 'self.attrType'(alg_field)
    var propAttr = $(objField).attr(self.attrType);
    var value;
    var objVal;

    // Se seleccionan todos los elementos del grupo de selects
    // Si viene especificado que se lea como texto, entonces se regresa el text del elemento select
    if (leerComoTexto)
        objVal = $(objField).find('option:selected').text();
    else
        objVal = $(objField).find('option:selected').val();


    // Para saber si hay una propiedad configurada
    var propName = self.properties[propAttr];
    if (tipoLectura == 'default' || tipoLectura == 'valor') {

        // Si se pide leer esta propiedad como valor, peeeeeeero, hay configurada un valor para esta propieadd
        // en el objeto self.properties, entonces debe regresarse un objeto con la propiedad configurada
        // igual al valor de los elementos selccionados
        if (propName == null || propName == undefined || propName == '')
            value = objVal;
        else {
            value = {};
            value[propName] = objVal;
        }

    } else {

        // Si se quiere leer como array, debe haber una propiedad configurada para su lectura.
        // Si no existe esa propiedad, entonces se asigna la propiedad Clave por default.
        if (propName == null || propName == undefined || propName == '')
            propName = 'Clave';

        var obj = {};
        obj[propName] = objVal;

        // Como arreglo
        value = new Array();
        value.push(obj);
    }
    return value;
}

Contenedor.prototype.getFieldSelectMult = function (objField, tipoLectura, leerComoTexto) {
    var self = this;

    // Sacamos el valor del atributo 'self.attrType'(alg_field)
    var propAttr = $(objField).attr(self.attrType);
    var vArray = new Array();
    var value;

    // Se seleccionan todos los elementos del grupo de selects
    if (leerComoTexto) {
        $(objField).find(':selected').each(function () {
            vArray.push($(this).text());
        });
    } else {
        $(objField).find(':selected').each(function () {
            vArray.push($(this).attr('value'));
        });
    }

    var propName = self.properties[propAttr];

    if (tipoLectura == 'default' || tipoLectura == 'array') {

        // Si se pide que ésta propiedad se lea como arreglo, entonces se debe revisar si hay una 
        // propiedad de objeto configurada en el arreglo properties. Si existe esa propiedad, entonces
        // el arreglo que se debe regresar debe ser una lista de objetos con la propiedad indicada igual al 
        // valor obtenido del objeto.

        if (propName == null || propName == undefined || propName == '')
            propName = 'Clave';

        value = new Array();
        for (var i = 0; i < vArray.length; i++) {
            var obj = {};
            obj[propName] = vArray[i];
            value.push(obj);
        }
        vArray = null;

    } else {

        // Se convierte el arreglo en una cadena separada de comas
        var ret = '';
        for (var i = 0; i < vArray.length; i++) {
            ret += (ret == '') ? vArray[i] : ',' + vArray[i];
        }

        // Si se pide leer esta propiedad como valor, peeeeeeero, hay configurada un valor para esta propieadd
        // en el objeto self.properties, entonces debe regresarse un objeto con la propiedad configurada
        // igual al valor de los elementos selccionados
        if (propName == null || propName == undefined || propName == '')
            value = ret;
        else
            value[propName] = objVal;
    }

    return value;
}

// Setea un json en el formulario actual
Contenedor.prototype.setJSON = function (json) {

    var self = this;
    self.json = json;

    var readonly = self.readonly;

    // Se eliminan las etiquetas que pudieron haberse creado y que todavía están visibles
    self.removeLabels();

    if (json != null && json != undefined) {

        for (var prop in json) {

            // Si ésta propiedad tiene configurado un modo (readonly) específico, 
            // entonces se usa ese modo
            if (self.readModePropertyObject[prop] == true || self.readModePropertyObject[prop] == false)
                readonly = self.readModePropertyObject[prop];
            else
                readonly = self.readonly;

            // Se imprime el readonly
            // console.log(prop+'    '+ readonly);
            self.setValueInProp(prop, json[prop], readonly);
        }
    }
}

Contenedor.prototype.setProperty = function (prop, value, toReadOnly) {

    var self = this;

    // Independientemente del valor de la propiedad readOnly del objeto Contenedor, 
    // Esta propiedad debe mantenerse con el readonly configurado aquí
    // Si el parámetro toReadOnly tiene un valor de visibilidad válido(true o false)
    // entonces se guarda en la lista de visibilidad de propiedades
    if (toReadOnly == true || toReadOnly == false) {
        self.readModePropertyObject[prop] = toReadOnly;
    } else {
        self.readModePropertyObject[prop] = null;
    }

    // SE invoca el método que setea el valor en el objeto relacionado a la propiedad del VO
    self.setValueInProp(prop, value, toReadOnly);
}

Contenedor.prototype.setValueInProp = function (prop, value, toReadOnly) {

    var self = this;

    if (value == undefined || value == null)
        value = '';

    // Si existe una etiqueta creada para esta propiedad, etnonces se elimina
    var x = self.LabelList.indexOf('lbl_' + prop);
    if (x >= 0) {
        self.LabelList.splice(x, 1);
        $('#' + self.id).find('#lbl_' + prop).remove();
    }

    // Se guarda la propiedad readOnly actual
    var readOnlyTemp = self.readonly;
    self.readonly = (toReadOnly == true || toReadOnly == false) ? toReadOnly : readOnlyTemp;

    var tipoLectura = 'default';
    for (var i = 0; i < self.readPropertyAsList.length; i++) {
        var v = self.readPropertyAsList[i];
        if (v.Prop == prop) {
            tipoLectura = v.Tipo;
            break;
        }
    }

    // Se buscan todos los elementos que en su atributo 'arrType' tengan el valor de la propiedad de la iteracion
    // del objeto json actual
    $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]').each(function () {

        var type = $(this).attr('type');
        var tag = $(this).prop('tagName').toLowerCase();

        if (type == undefined || type == null)
            type = '';

        if (tag == undefined || tag == null)
            tag = '';

        var millis = 0;
        if (self.toType(value) == 'string' && value.indexOf('Date(') > 0) {

            // Se convierte la fecha de tipo /Date(1359183600000)/ al tipo 02/01/2012
            value = self.parseDateStringToString(value);
        }

        var objDataType = AlgoriaFormat.getDataTypeInfo(this);
        if (objDataType != null) {

            if (objDataType.dataType == 'number')
                value = AlgoriaFormat.format(value, objDataType.decimales);
        }

        // Evaluar cada uno de los posibles tipos de elementos
        if (type == 'text') {
            self.setFieldText(this, value);
        }
        else if (tag == 'textarea') {
            self.setFieldTextArea(this, value);
        }
        else if (type == 'password') {
            self.setFieldPassword(this, value);
        }
        else if (type == 'hidden') {
            self.setFieldHidden(this, value);
        }
        else if (type == 'checkbox') {
            self.setFieldCheck(this, value);
        }
        else if (type == 'radio') {
            self.setFieldRadio(this, value, tipoLectura);
        }
        else if (tag == 'select') {

            if ($(this).attr('multiple') != null && $(this).attr('multiple') != undefined)
                self.setFieldSelectMult(this, value);
            else {
                self.setFieldSelect(this, value, tipoLectura);
            }
        }
        else if (tag == 'label' || tag == 'p') {
            self.setFieldLabel(this, value);
        }
    });

    // Se restaura el valor de readOnly
    self.readonly = readOnlyTemp;
}

Contenedor.prototype.setFieldText = function (objField, value) {

    var self = this;
    var id = $(objField).attr(self.attrType);

    // Se setea el valor en el campo de texto
    $(objField).attr('value', value);

    if (self.readonly == true) {
        var label = '<label id="lbl_' + id + '">' + value + '</label>';
        $(objField).after(label);
        $(objField).val(value);
        $(objField).hide();

        self.LabelList.push('lbl_' + id);

    } else {
        $(objField).show();
    }
}

Contenedor.prototype.setFieldTextArea = function (objField, value) {

    var self = this;
    var id = $(objField).attr(self.attrType);

    // Se setea el valor en el campo de texto
    $(objField).val(value);

    if (self.readonly == true) {
        var label = '<label id="lbl_' + id + '">' + value + '</label>';
        $(objField).after(label);
        $(objField).val(value);
        $(objField).hide();

        self.LabelList.push('lbl_' + id);

    } else {
        $(objField).show();
    }
}

Contenedor.prototype.setFieldPassword = function (objField, value) {
    var self = this;
    var id = $(objField).attr(self.attrType);

    $(objField).attr('value', value);
    if (self.readonly == true) {
        var label = '<label id="lbl_' + id + '">**********</label>';
        $(objField).after(label);
        $(objField).hide();

        self.LabelList.push('lbl_' + id);
    }
}

Contenedor.prototype.setFieldHidden = function (objField, value) {
    var self = this;
    $(objField).val(value);
}

Contenedor.prototype.setFieldLabel = function (objField, value) {
    var self = this;
    //console.log(value);
    $(objField).text(value);
}

Contenedor.prototype.setFieldCheck = function (objField, value) {
    var self = this;
    var objFValue = $(objField).attr('value');

    var nombrePropiedadDeArregloDeObjetos = '';
    if (self.properties != null || self.properties != undefined)
        nombrePropiedadDeArregloDeObjetos = self.properties[$(objField).attr(self.attrType)];

    var valorArreglo = '';
    var arrayLocal = new Array();

    if (typeof value != "object") {
        arrayLocal = value.toString().split(','); // en la posición CERO, se deja el valor value
    } else {
        arrayLocal = value;
    }

    // En el caso de los checks, siempre se espera recibir un arreglo en la propiedad value
    // entonces, se debe iterar éste arreglo y buscar los radios que tengan su atributo value
    // igual a la propiedad configurada para los arreglos de este tipo de radio..enredoso vdd..
    // bueno, a intentarlo
    for (var i = 0; i < arrayLocal.length; i++) {

        if (nombrePropiedadDeArregloDeObjetos != null ||
            nombrePropiedadDeArregloDeObjetos != undefined &&
            nombrePropiedadDeArregloDeObjetos != '') {

            valorArreglo = arrayLocal[i][nombrePropiedadDeArregloDeObjetos];

        } else {

            // se intenta buscar por la palabra 'Clave'
            valorArreglo = arrayLocal[i]['Clave'];

            if (valorArreglo == null || valorArreglo == undefined) {

                // se intenta buscar por la palabra 'clave' en minúsculas
                valorArreglo = arrayLocal[i]['Clave'];

                if (valorArreglo == null || valorArreglo == undefined) {
                    // Se intenta leer como un valor directo del arreglo
                    valorArreglo = arrayLocal[i];
                }
            }
        }

        if (objFValue.toString() == valorArreglo.toString()) {
            // console.log('value=' + objFValue + '    arr=' + valorArreglo);
            // console.log('entro');
            $(objField).attr('checked', 'checked');
            break;
        }
    }

    if (self.readonly == true) {
        $(objField).attr('disabled', 'disabled');
    } else {
        $(objField).removeAttr('disabled');
    }
}

Contenedor.prototype.setFieldRadio = function (objField, value, tipoLectura) {
    var self = this;

    var nombrePropiedadDeArregloDeObjetos = '';
    if (self.properties != null || self.properties != undefined)
        nombrePropiedadDeArregloDeObjetos = self.properties[$(objField).attr(self.attrType)];

    var valorArreglo = '';
    var arrayLocal = new Array();

    // Si el valor es de tipo arreglo
    // como se trata de radio buttons, nos interesa sólo el primer elemento del arreglo
    if (value != null && value != undefined) {
        if (self.isArray(value)) {

            if (nombrePropiedadDeArregloDeObjetos != null &&
            nombrePropiedadDeArregloDeObjetos != undefined &&
            nombrePropiedadDeArregloDeObjetos != '') {

                valorArreglo = value[0][nombrePropiedadDeArregloDeObjetos];

            } else {

                // se intenta buscar por la palabra 'Clave'
                valorArreglo = value[0]['Clave'];

                if (valorArreglo == null || valorArreglo == undefined) {

                    // se intenta buscar por la palabra 'clave' en minúsculas
                    valorArreglo = value[0]['clave'];

                    if (valorArreglo == null || valorArreglo == undefined) {
                        // Se intenta leer como un valor directo del arreglo
                        valorArreglo = value[0];
                    }
                }
            }

        } else {
            if (nombrePropiedadDeArregloDeObjetos != null &&
            nombrePropiedadDeArregloDeObjetos != undefined &&
            nombrePropiedadDeArregloDeObjetos != '') {

                valorArreglo = value[nombrePropiedadDeArregloDeObjetos];
            } else {

                valorArreglo = value;
            }
        }
    }

    // En este punto ya debió haberse determinado el valor a poner.
    // Ahora se buscan los radios para poner el valor
    var id = $(objField).attr(self.attrType);
    var conta = 0;

    var radioObj = $('#' + self.id).find('input:radio[' + self.attrType + '="' + id + '"]');
    if (!radioObj)
        return;
    var radioLength = radioObj.length;
    if (radioLength == undefined) {
        radioObj.checked = (radioObj.value == valorArreglo.toString());
    } else {
        for (var i = 0; i < radioLength; i++) {
            $(radioObj[i]).attr('checked', false);
            if (radioObj[i].value == valorArreglo.toString()) {
                $(radioObj[i]).attr('checked', true);
            }
        }
    }

    if (self.readonly == true) {
        $(objField).attr('disabled', 'disabled');
    } else {
        $(objField).removeAttr('disabled');
    }
}

Contenedor.prototype.setFieldSelect = function (objField, value) {

    var self = this;

    var nombrePropiedadDeArregloDeObjetos = '';
    if (self.properties != null || self.properties != undefined)
        nombrePropiedadDeArregloDeObjetos = self.properties[$(objField).attr(self.attrType)];

    var strLabel = '';
    var valorAsignar;

    //console.log(self.toType(value));

    if (self.toType(value) == "object") {

        // Si la propiedad que se toma como valor para asignar este select es de tipo object, 
        // entonces debemos buscar una propiedad en la lista de propiedad configuradas.
        // Si no existe esa propiedad, se toma como default la palbra Clave
        if (nombrePropiedadDeArregloDeObjetos == null ||
            nombrePropiedadDeArregloDeObjetos == undefined ||
            nombrePropiedadDeArregloDeObjetos == '') {

            nombrePropiedadDeArregloDeObjetos = 'Clave';
        }

        valorAsignar = value[nombrePropiedadDeArregloDeObjetos];

    } else {
        valorAsignar = value;
    }

    //$(objField).find('option').removeAttr('selected');
    //$(objField).find('option[value="' + valorAsignar + '"]').attr('selected', 'selected');
    //$(objField).find(':selected').val(valorAsignar);
    //strLabel = $(objField).find('option:selected').text();

    var id = $(objField).attr(self.attrType);

    // Si existe un objeto de tipo combo instanciado, entonces se asigna el valor
    if (self.objectOfCombos[id] != null && self.objectOfCombos[id] != undefined) {
        self.objectOfCombos[id].combo.setValue(valorAsignar);
    } else {
        $(objField).find('option[value="' + valorAsignar + '"]').attr('selected', 'selected');
    }

    if (self.readonly == true) {

        // Se rescata el texto del combo
        strLabel = $(objField).find('option[value="' + valorAsignar + '"]').text();

        // Eliminar la etiqueta si había una ya creada
        $('#lbl_' + id).remove();

        var label = '<label id="lbl_' + id + '">' + strLabel + '</label>';
        $(objField).hide();
        $(objField).after(label);

        self.LabelList.push('lbl_' + id);
    } else {
        $(objField).show();
    }
}

Contenedor.prototype.setFieldSelectMult = function (objField, value) {

    var self = this;

    var nombrePropiedadDeArregloDeObjetos = '';
    if (self.properties != null || self.properties != undefined)
        nombrePropiedadDeArregloDeObjetos = self.properties[$(objField).attr(self.attrType)];

    var valorArreglo = '';
    var strLabel = '';
    var arrayLocal = new Array();

    // En el caso de los selects, siempre se espera recibir un arreglo en la propiedad value
    // entonces, se debe iterar éste arreglo y buscar los options que tengan su atributo value
    // igual a la propiedad configurada para los arreglos de este tipo de selects..enredoso vdd..
    // bueno, a intentarlo
    if (typeof value != "object") {
        arrayLocal = value.split(','); // Se convierte value a un vector, que se almacena en la propiedad arrayLocal
    } else {
        arrayLocal = value;
    }

    var arrMult = new Array();

    for (var i = 0; i < arrayLocal.length; i++) {

        if (nombrePropiedadDeArregloDeObjetos != null ||
            nombrePropiedadDeArregloDeObjetos != undefined ||
            nombrePropiedadDeArregloDeObjetos != '') {

            valorArreglo = arrayLocal[i][nombrePropiedadDeArregloDeObjetos];

        } else {

            // se intenta buscar por la palabra 'Clave'
            valorArreglo = arrayLocal[i]['Clave'];

            if (valorArreglo == null || valorArreglo == undefined) {

                // se intenta buscar por la palabra 'clave' en minúsculas
                valorArreglo = arrayLocal[i]['clave'];

                if (valorArreglo == null || valorArreglo == undefined) {
                    // Se intenta leer como un valor directo del arreglo
                    valorArreglo = arrayLocal[i];
                }
            }
        }

        // Si existe un objeto de tipo combo instanciado, entonces se asigna el valor
        if (self.objectOfCombos[id] != null && self.objectOfCombos[id] != undefined) {
            arrMult.push(valorArreglo);
        }
        else {
            // Se buscan todos los options que tengan la atributo value=valorArreglo y se marcan como selected
            $(objField).find('option[value="' + valorArreglo + '"]').each(function () {
                $(this).attr('selected', 'selected');
                strLabel += $(this).text() + self.multiSelectSeparator; // El texto del objeto 'option' actual                
            });
        }
    } // Termina el for

    // Actualizacion para manejar los combos multiples a través del objeto AlgoriaCombo
    if (self.objectOfCombos[id] != null && self.objectOfCombos[id] != undefined) {
        self.objectOfCombos[id].combo.setValue(arrMult);
    }

    var id = $(objField).attr(self.attrType);
    if (self.readonly == true) {
        var label = '<label id="lbl_' + id + '">' + strLabel + '</label>';
        $(objField).hide();
        $(objField).after(label);

        self.LabelList.push('lbl_' + id);
    } else {
        $(objField).show();
    }
}

/*******************************************************************
***********************************************************************/
// Se solicita un objeto Json al servidor..
// Este método siempre es sincrono, es decir, permanecerá en éste método hasta que
// el servidor haya respondido la petición
Contenedor.prototype.doJsonRequest = function (url, params, blockScreen) {
    var self = this;

    var resp = null;
    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'json';
    peticion.async = false;

    if (blockScreen == false) {
        peticion.addwait = false;
    } else {
        peticion.addwait = true;
    }

    if (params != undefined && params != null) {
        peticion.json = JSON.stringify(params);
    }

    peticion.error = function (data) { resp = data; };
    peticion.posSolicitar = function (data) { resp = data; };
    peticion.solicitar();

    return resp;
}

/*******************************************************************
***********************************************************************/
// Se solicita un objeto Json al servidor..
// Este método siempre es sincrono, es decir, permanecerá en éste método hasta que
// el servidor haya respondido la petición
Contenedor.prototype.doJsonRequestAsync = function (url, params, callBack) {
    var self = this;

    var resp = null;
    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'json';
    peticion.async = true;
    peticion.addwait = true;

    if (params != undefined && params != null) {
        peticion.json = JSON.stringify(params);
    }

    peticion.error = function (data) { if (callBack) callBack(data); };
    peticion.posSolicitar = function (data) { if (callBack) callBack(data); };
    peticion.solicitar();
}

// Se solicita un objeto HTML al servidor..
// Este método siempre es sincrono, es decir, permanecerá en éste método hasta que
// el servidor haya respondido la petición
Contenedor.prototype.doHtmlRequest = function (url, params, blockScreen) {
    var self = this;

    var resp = null;
    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'html';
    peticion.async = false;

    if (blockScreen == false) {
        peticion.addwait = false;
    } else {
        peticion.addwait = true;
    }

    if (params != undefined && params != null)
        peticion.json = JSON.stringify(params);

    peticion.error = function (data) { };
    peticion.posSolicitar = function (data) { resp = data; };
    peticion.solicitar();

    return resp;
}

// Se solicita un objeto string al servidor..
// Este método siempre es sincrono, es decir, permanecerá en éste método hasta que
// el servidor haya respondido la petición
Contenedor.prototype.doStringRequest = function (url, params) {
    var self = this;

    var resp = null;
    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'string';
    peticion.async = false;

    if (params != undefined && params != null)
        peticion.json = JSON.stringify(params);

    peticion.error = function (data) { resp = data; };
    peticion.posSolicitar = function (data) { resp = data; };
    peticion.solicitar();

    return resp;
}

Contenedor.prototype.doSubmit = function (url, type, params) {
    var self = this;

    var obj = self.getJSON();

    if (params != undefined) {
        for (var p in params) {
            obj[p] = params[p];
        }
    }

    //console.log(obj);
    //return;

    var realType = 'POST';
    if (type != undefined && type.toString().toLowerCase() == 'get' && type.toString().toLowerCase() == 'post') {
        realType = type;
    }

    var formul = document.createElement('form');
    formul.action = url;
    formul.method = realType;

    for (var p in obj) {
        var texto = document.createElement('input');
        texto.setAttribute('type', 'hidden');
        texto.setAttribute('name', p);
        texto.setAttribute('id', p);
        texto.setAttribute('value', obj[p]);

        formul.appendChild(texto);
    }

    document.body.appendChild(formul);
    formul.submit();
}


/***********************************************************************
****         METODOS PARA LOS EVENTOS DEL FORMULARIO     ***************
****            EVENTOS COMO LA ACCION A EJECUTAR        ***************
************************************************************************
***********************************************************************/

Contenedor.prototype.setDefaultAction = function (ac) {
    var self = this;
    self.defaultAction = ac;
}

Contenedor.prototype.preAction = function () { };
Contenedor.prototype.action = function (url, action) {

    var self = this;

    //    var actionSuccessLocal = self.actionSuccess;
    //    var actionErrorLocal = self.actionError;
    //    var actionPosLocal = self.posAction;

    // Lógica genérica para la función Guardar
    var json = self.getJSON();
    json.Action = action;

    // Si hay más datos configurados, también se envían al servidor
    if (self.extraJson != null)
        $.extend(json, self.extraJson);

    // Se valida el formulario
    var resp = self.validate();
    if (resp.length > 0) {

        // Se muestran los errores
        // self.showErrors(resp);
        var objResp = {};
        objResp.ErrorDesc = 'Error de validación de formulario';
        objResp.ErrorNumber = -2;
        objResp.ErrorList = resp;

        self.actionError(objResp);

        return;
    }

    var peticion = new Peticion();
    peticion.url = url;
    peticion.datatype = 'json';
    peticion.async = (self.actionAsync == true || self.actionAsync == false) ? self.actionAsync : true;
    peticion.json = JSON.stringify(json);
    peticion.error = function (data) { self.actionError(data); self.posAction(data); };
    peticion.posSolicitar = function (data) { self.actionSuccess(data); self.posAction(data); };
    peticion.solicitar();
};

// El método doAction tiene una lógica ya definida. Sólo es necesario sobreescribir
// los métodos que se considere necesario y ejecutar éste método.
// Si éste método no cumple las condiciones para ser ejecutado, entonces puede hacerse siempre un método personalizado
Contenedor.prototype.doAction = function (url) {

    var self = this;

    self.preAction();

    // Obtener el atributo 'ac' del control HTML que lanzó este método
    // console.log(self.doAction.caller.arguments);
    // El atributo 'ac' se buscará hasta 5 niveles superiores en la pila de llamadas de ejecución, 
    // si no se encuentra, entonces se manda una acción default
    var acc = '';
    if (self.doAction.caller.arguments[0] != null && self.doAction.caller.arguments[0] != undefined)
        acc = $(self.doAction.caller.arguments[0].currentTarget).attr('ac');
    else if (self.doAction.caller.caller.arguments[0] != null && self.doAction.caller.caller.arguments[0] != undefined)
        acc = $(self.doAction.caller.caller.arguments[0].currentTarget).attr('ac');
    else if (self.doAction.caller.caller.caller.arguments[0] != null && self.doAction.caller.caller.caller.arguments[0] != undefined)
        acc = $(self.doAction.caller.caller.caller.arguments[0].currentTarget).attr('ac');
    else if (self.doAction.caller.caller.caller.caller.arguments[0] != null && self.doAction.caller.caller.caller.caller.arguments[0] != undefined)
        acc = $(self.doAction.caller.caller.caller.caller.arguments[0].currentTarget).attr('ac');
    else if (self.doAction.caller.caller.caller.caller.caller.arguments[0] != null && self.doAction.caller.caller.caller.caller.caller.arguments[0] != undefined)
        acc = $(self.doAction.caller.caller.caller.caller.arguments[0].currentTarget).attr('ac');

    // Si no se encuentra una acción, entonces se envía una acción default
    if (acc == null || acc == undefined || acc == '')
        acc = self.defaultAction;

    self.action(url, acc);

    // Y el posAction, siempre se ejecuta independientemente si hubo error o no
    // self.posAction();
};
Contenedor.prototype.actionError = function (data) {
    var self = this;

    // Si es error de validación de formulario
    if (data.ErrorNumber == -2) {
        self.showErrors(data.ErrorList);
    } else {
        dialog('error', 'Error', 'Error: ' + data.ErrorNumber + '\n' + data.ErrorDesc);
    }
}
Contenedor.prototype.actionSuccess = function (data) {

    if ($('#modalContainer') == undefined) {
        dialog('informativo', 'informaci&oacute;n', data.ErrorDesc);
    }
};
Contenedor.prototype.posAction = function () { };


/*********************************************************************
*********    METODOS PARA LAS VALIDACIONES DEL FORMULARIO   *********
*********************************************************************
*********************************************************************/
Contenedor.prototype.validate = function () {
    var self = this;
    self.preValidate();

    var resp = self.onValidate();

    self.posValidate();

    return resp;
}

Contenedor.prototype.validateAndShowError = function () {
    var self = this;

    var resp = self.validate();
    if (resp.length > 0) {

        // Se muestran los errores
        self.showErrors(resp);
    }

    return (resp.length == 0);
}

Contenedor.prototype.preValidate = function () { };
Contenedor.prototype.onValidate = function () {
    var self = this;

    // Se limpian los errores
    self.clearErrors();

    var propsValidacionFallida = new Array();
    var erroresList = new Array();

    // Se elimina la marca de error de los elementos del formulario actual
    //$('#' + self.id).find('[' + self.attrType + ']').removeAttr('data-validation-error');
    //    $('#' + self.id).find('[' + self.attrType + ']').removeClass('error');

    // Si hay reglas de validacion, entonces se revisan y ejecutan
    if (self.validationRulesList.length > 0) {

        var json = self.getJSON();
        var respValidation;
        var obj;
        // Se recorre la lista de propiedades configuradas para validación
        for (var i = 0; i < self.validationRulesList.length; i++) {

            obj = self.validationRulesList[i];

            // Si la propiedad actual aún no ha fallado una validación
            if (propsValidacionFallida.indexOf(obj.prop) < 0) {

                respValidation = false;

                if (obj.type == 'custom')
                    respValidation = obj.func(json[obj.prop], obj.data);
                else
                    respValidation = self.validateValue(obj.rule, json[obj.prop], obj.data);

                // Si el resultado de la validacion fué negativa, entonces
                // se agrega a la lista de objetos de error
                if (respValidation == false) {

                    // Se agrega la propiedad cuya validación actual ha fallado, para que ya no se valide en éste recorrido
                    // Ésto es para que un propiedad sea validada sólo una vez
                    propsValidacionFallida.push(obj.prop);

                    // Se crea el objeto que regresará ésta función
                    var objError = {};
                    objError.Campo = obj.prop;
                    objError.Texto = obj.message;
                    erroresList.push(objError);
                }

            } // Termina if (propsValidacionFallida.indexOf(obj.prop) < 0)

        } // Termina for
    }
    return erroresList;
};
Contenedor.prototype.posValidate = function () { };
Contenedor.prototype.validateProperty = function (prop, rule, data, showError) {
    var self = this;
    var value = self.getProperty(prop);

    // Buscar en la lista de reglas de validación, el objeto que coincide con la propiedad y regla que sequiere validar
    var message = '';
    var found = false;
    for (var vv in self.validationRulesList) {
        if (vv.prop == prop && vv.rule == rule) {
            message = vv.message;
            found = true;
            break;
        }
    }

    // Si no se encontró, entonces no existe esa regla de validación configurada, por lo tanto, 
    // este método regresa true.. es decir, si pasa esta validación
    if (found == false)
        return true;

    var resp = self.validateValue(rule, value, data);

    if (resp == false && showError == true)
        self.setErrorInProperty(prop, message);

    return resp;
}
Contenedor.prototype.validateValue = function (rule, value, data) {
    var self = this;
    var respValidation = false;
    switch (rule) {
        case 'required':
            respValidation = self.ruleRequired(value);
            break;
        case 'comparetoprop':
            var otherPrpV = self.getProperty(data);
            respValidation = self.ruleCompareToProp(value, otherPrpV);
            break;
        case 'comparetovalue':
            respValidation = self.ruleCompareToValue(value, data);
            break;
        case 'date':
            break;
        case 'email':
            respValidation = self.ruleEmail(value);
            break;
        case 'url':
            respValidation = self.ruleUrl(value);
            break;
        case 'number':
            respValidation = self.ruleNumber(value);
            break;
        case 'numberint':
            respValidation = self.ruleNumberInt(value);
            break;
        case 'numberrange':
            respValidation = self.ruleNumberRange(value, data);
            break;
        case 'numberlt':
            respValidation = self.ruleNumberLT(value, data);
            break;
        case 'numberlet':
            respValidation = self.ruleNumberLET(value, data);
            break;
        case 'numbergt':
            respValidation = self.ruleNumberGT(value, data);
            break;
        case 'numberget':
            respValidation = self.ruleNumberGET(value, data);
            break;
        case 'numberdecimal':
            respValidation = self.ruleNumberDecimal(value);
            break;
        case 'range':
            respValidation = self.ruleRange(value, data);
            break;
        case 'minlength':
            respValidation = self.ruleMinLength(value, data);
            break;
        case 'maxlength':
            respValidation = self.ruleMaxLength(value, data);
            break;
        case 'rangelength':
            respValidation = self.ruleRangeLength(value, data);
            break;
        case 'rfc':
            respValidation = self.ruleRfc(value);
            break;
    }

    return respValidation;
}

/*****************************************************************************
******************************************************************************
******************************************************************************
******************************************************************************
******************************************************************************/
Contenedor.prototype.clearValidationRules = function () {
    var self = this;

    // Eliminar los atributos que se agregaron automáticamente a los elementos HTML
    if (self.validationRulesList != null && self.validationRulesList.length != undefined && self.validationRulesList > 0) {
        for (var i = 0; i < self.validationRulesList.length; i++) {
            if (obj.rule == 'maxlength') {
                $('#' + self.id).find('[' + self.attrType + '="' + obj.prop + '"]').each(function () {
                    // Para la regla de validacion maxlength, el valor de 'data' siempre debe ser un número entero
                    $(this).removeAttr('maxlength');
                });
            }
        }
    }

    self.validationRulesList = new Array();
}
Contenedor.prototype.addValidationRule = function (prop, rule, data, message) {
    var self = this;

    var obj = {};
    obj.type = 'static';
    obj.rule = rule;
    obj.prop = prop;
    obj.data = data;
    obj.message = message;

    // Si la regla es maxlength, se agrega el atributo maxlenght al campo 
    // para evitar teclcear de más
    if (rule == 'maxlength') {
        $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]').each(function () {
            // Para la regla de validacion maxlength, el valor de 'data' siempre debe ser un número entero
            $(this).attr('maxlength', data);
        });
    }

    self.validationRulesList.push(obj);
};
Contenedor.prototype.addCustomValidationRule = function (prop, data, message, func) {
    var self = this;

    var obj = {};
    obj.type = 'custom';
    obj.prop = prop;
    obj.message = message;
    obj.data = data;
    obj.func = func;

    self.validationRulesList.push(obj);
};

Contenedor.prototype.ruleRequired = function (propValue) {
    return (propValue != null && propValue != undefined && propValue != '');
};
Contenedor.prototype.ruleCompareToProp = function (propValue, propToCompare) {
    return (propValue == propToCompare);
}
Contenedor.prototype.ruleCompareToValue = function (propValue, valueToCompare) {
    return (propValue == valueToCompare);
}

Contenedor.prototype.ruleDate = function (propValue) {
    return true;
}

Contenedor.prototype.ruleEmail = function (propValue) {
    return (/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/.test(propValue));
}
Contenedor.prototype.ruleUrl = function (propValue) {
    var regex = /^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?$/i;
    return regex.test(propValue);
}
Contenedor.prototype.ruleNumber = function (propValue) {
    var self = this;
    return self.ruleNumberDecimal(propValue);
}
Contenedor.prototype.ruleNumberDecimal = function (propValue) {
    return (/^([0-9])*[.]?[0-9]*$/.test(propValue))
}
Contenedor.prototype.ruleNumberInt = function (propValue) {
    return (/^([0-9])*$/.test(propValue));
}
Contenedor.prototype.ruleNumberRange = function (propValue, range) {
    var valor = parseFloat(propValue);
    return (valor >= parseFloat(range[0]) && valor <= parseFloat(range[1]));
}
Contenedor.prototype.ruleNumberLT = function (propValue, valueToCompare) {
    var valor = parseFloat(propValue);
    return (valor < valueToCompare);
}
Contenedor.prototype.ruleNumberLET = function (propValue, valueToCompare) {
    var valor = parseFloat(propValue);
    return (valor <= valueToCompare);
}
Contenedor.prototype.ruleNumberGT = function (propValue, valueToCompare) {
    var valor = parseFloat(propValue);
    return (valor > valueToCompare);
}
Contenedor.prototype.ruleNumberGET = function (propValue, valueToCompare) {
    var valor = parseFloat(propValue);
    return (valor >= valueToCompare);
}
Contenedor.prototype.ruleRange = function (propValue, range) {
    var valor = parseFloat(propValue);
    return (valor >= range[0] && valor <= range[1]);
}
Contenedor.prototype.ruleMinLength = function (propValue, len) {
    return (propValue != null && propValue.length >= len);
}
Contenedor.prototype.ruleMaxLength = function (propValue, len) {
    return (propValue == null || propValue.length <= len);
}
Contenedor.prototype.ruleRangeLength = function (propValue, range) {
    return (propValue.length >= range[0] && propValue.length <= range[1]);
}

Contenedor.prototype.ruleRfc = function (propValue) {
    var regex = /^[a-zA-Z]{3,4}[0-9]{6,6}[a-zA-Z0-9]*$/;
    return (regex.test(propValue));
}

Contenedor.prototype.clearErrors = function () {
    var self = this;

    $('#' + self.id).find('[data-validation-error]').each(function (i) {
        self.clearErrorInControl(this);
    });
}

Contenedor.prototype.clearErrorInProperty = function (prop) {
    var self = this;
    $('#' + self.id).find('[' + this.attrType + '="' + prop + '"]').each(function () {
        //$(this).removeClass('errorvalidation').removeAttr('data-validation-error');
        //$(this).qtip('destroy');
        self.clearErrorInControl(this);
    });
}

Contenedor.prototype.clearErrorInControl = function (ctrl) {
    var self = this;
    $(ctrl).removeClass('errorvalidation').removeAttr('data-validation-error');
    $(ctrl).find('+ span').remove();
    //$(ctrl).qtip('destroy');
}

Contenedor.prototype.showErrors = function (errorList) {
    var self = this;

    // Se limpian los errores
    self.clearErrors();

    var errores = '';
    if (errorList != null && errorList != undefined) {
        for (var i = 0; i < errorList.length; i++) {
            self.setErrorInProperty(errorList[i].Campo, errorList[i].Texto);
        }
    }

    dialog('error', ErroresValidacion, MensajeHuboErrores + errores);
}
Contenedor.prototype.muestraErrores = function (errorList) {
    var self = this;

    // Se limpian los errores
    //self.clearErrors();
    var strMess = '<b>Por favor, revise los siguientes errores:</b><br/>';
    strMess += '<ul>';

    var errores = '';
    if (errorList != null && errorList != undefined) {
        for (var i = 0; i < errorList.length; i++) {
            self.setErrorInProperty(errorList[i].Campo, errorList[i].Texto);

            strMess += '<li>' + errorList[i].Texto + '</li>';
        }
        strMess += '</ul>';
    }

    dialog('error', 'Formulario',  strMess);
}

Contenedor.prototype.setErrorInProperty = function (prop, message) {
    var self = this;

    $('#' + self.id).find('[' + this.attrType + '="' + prop + '"]').each(function () {
        self.setErrorInControl(this, message);
    });
}

Contenedor.prototype.setErrorInControl = function (ctrl, message) {
    var self = this;
    $(ctrl).attr('data-validation-error', message).addClass('errorvalidation');
    $('<span class="requerido" errv="1">' + message + '</span>').insertAfter(ctrl);
    //    $(ctrl).qtip({ content: $(ctrl).attr('data-validation-error') });
}

// Método para limpiar el formulario
Contenedor.prototype.clearForm = function (readonly) {

    var self = this;

    // Si el parámetro readonly tiene un valor válido
    if (readonly == true || readonly == false)
        self.readonly = readonly;

    self.clearErrors();

    // Se eliminan las etiquetas que pudieron haberse creado y que todavía están visibles
    self.removeLabels();

    $('#' + self.id).find('input[type="text"]').each(function () {
        $(this).attr('value', '');
        if (!readonly)
            $(this).show();
    });

    $('#' + self.id).find('textarea').each(function () {

        $(this).val('');
        if (!readonly)
            $(this).show();
    });

    $('#' + self.id).find('input[type="hidden"]').each(function () {
        $(this).attr('value', '');
    });

    $('#' + self.id).find('input[type="checkbox"]').each(function () {
        $(this).removeAttr('checked');
        if (!readonly)
            $(this).removeAttr('disabled');
    });

    $('#' + self.id).find('input[type="radio"]').each(function () {
        $(this).removeAttr('checked');
        if (!readonly)
            $(this).removeAttr('disabled');
    });

    $('#' + self.id).find('input[type="password"]').each(function () {
        $(this).attr('value', '');
        if (!readonly)
            $(this).show();
    });

    $('#' + self.id).find('select').each(function () {
        $(this).find('option').each(function () {
            $(this).removeAttr('selected');
        });
        if (!readonly)
            $(this).show();
    });

    $('#' + self.id).find('label[' + self.attrType + ']').each(function () {
        $(this).text('');
    });
};

Contenedor.prototype.toType = function (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

Contenedor.prototype.isArray = function (obj) {

    if (obj == null || obj == undefined)
        return false;

    if (obj.constructor.toString().indexOf("Array") == -1)
        return false;
    else
        return true;
}

Contenedor.prototype.dispose = function (fn) {

    var self = this;

    // Si viene una functión en el parámetro fn
    // se guarda en la variable fnDispose
    // Esta función se ejecutará cuando se llame a la función dispose
    // de este objeto sin parámetros
    if ($.isFunction(fn)) {
        self.fnDispose = fn;
        return;
    }

    self.clearValidationRules();
    self.validationRulesList = null;

    // Se eliminan los combos generados
    for (var c in self.objectOfCombos) {
        self.objectOfCombos[c].combo.dispose();
        self.objectOfCombos[c] = null;
    }

    self.json = null;

    // Eliminar todos los objetos labels creados por éste objeto Contenedor
    self.removeLabels();

    self.readPropertyAsList = null;
    self.properties = null;

    // Guarda una lista de visibilidad de elementos enlazados a propiedades de objeto VO
    self.readModePropertyObject = null;

    // Si hay una función dispose configurada, entonces se ejecuta
    if ($.isFunction(self.fnDispose))
        self.fnDispose();
}

Contenedor.prototype.fillPropertyCombo = function (prop, filterData) {
    var self = this;

    if (self.objectOfCombos[prop] != null && self.objectOfCombos[prop] != undefined) {
        self.objectOfCombos[prop].combo.fill(filterData);
    }
}
Contenedor.prototype.refreshPropertyCombo = function (prop, filterData) {
    var self = this;
    if (self.objectOfCombos[prop] != null && self.objectOfCombos[prop] != undefined) {
        self.objectOfCombos[prop].combo.refresh(filterData);
    }
}

Contenedor.prototype.preparePropertyAsCombo = function (prop, url, fields, parentProperty) {
    var self = this;

    // El elemento que representa la propiead 'prop', debe tener un id, para este método funcione
    var objMain = $('#' + self.id).find('[' + self.attrType + '="' + prop + '"]')[0];

    var tag = $(objMain).prop('tagName').toLowerCase();
    if (tag == undefined || tag == null)
        tag = '';

    // Si es un select, entonces si se puede crear un combo
    if (tag == 'select') {
        var id = $(objMain).attr('id');

        // Si tiene un id, entonces si se puede crear el objeto combo..
        if (id != null && id != undefined && id != '') {

            var parentID = null;
            if (parentProperty != null && parentProperty != undefined) {
                if (self.objectOfCombos[parentProperty] != null)
                    parentID = self.objectOfCombos[parentProperty].id;
            }

            var cmbinfo = [prop, id];
            var parentinfo = [parentProperty, parentID];
            var cmb = new AlgoriaCombo(cmbinfo, url, fields, parentinfo);

            cmb.posSetValue = function () {
                // Se rescata el texto del elemento seleccinado en el combo
                // var txt = $('#' + id).find('option[value="' + $(this).val() + '"]').text();
                var txt = $('#' + id).find('option:selected').text();
                $('label[id="lbl_' + prop + '"]').text(txt);
                //console.log(txt);
            };

            // Se agrega el objeto a la lista de objetos combo para este contenedor
            var esteCombo = {};
            esteCombo.id = id;
            esteCombo.combo = cmb;

            self.objectOfCombos[prop] = esteCombo;
        }
    }
}

Contenedor.prototype.initDataTypes = function () {
    var self = this;

    // Este proceso se ejecuta cada vez que se inicializa un contenedor
    // Busca los objetos que tienen un data-type y los incializa
    $('#' + self.id).find('[data-type]').each(function () {
        AlgoriaFormat.initObject(this);
    });
}

Contenedor.prototype.parseDateStringToString = function (value, incluirHora) {

    var millis = value.replace('/Date(', '').replace(')/', '');
    var v1 = new Date(parseInt(millis)); //(eval(value.slice(1, -1)));
    //value = ('0' + v1.getDate()).right(2) + '/' +
    //                        ('0' + (v1.getMonth() + 1)).right(2) + '/' +
    //                        v1.getFullYear();

    var dia = '0' + v1.getDate();
    var mes = '0' + (v1.getMonth() + 1);
    var anio = v1.getFullYear();

    value = dia.substring(dia.length - 2) + '/' +
            mes.substring(mes.length - 2) + '/' +
            anio;

    if (incluirHora) {

        var hora = '0' + v1.getHours();
        var min = '0' + v1.getMinutes();
        var sec = '0' + v1.getSeconds();

        value += ' ' + hora.substring(hora.length - 2) + ':' +
                min.substring(min.length - 2) + ':' +
                sec.substring(sec.length - 2);

    }

    return value;
}

Contenedor.prototype.parseDateStringToStringG = function (value, incluirHora) {

    var millis = value.replace('/Date(', '').replace(')/', '');
    var v1 = new Date(parseInt(millis)); //(eval(value.slice(1, -1)));
    //value = ('0' + v1.getDate()).right(2) + '/' +
    //                        ('0' + (v1.getMonth() + 1)).right(2) + '/' +
    //                        v1.getFullYear();

    var dia = '0' + v1.getDate();
    var mes = '0' + (v1.getMonth() + 1);
    var anio = v1.getFullYear();

    value = anio + '-' +
            mes.substring(mes.length - 2) + '-' +
            dia.substring(dia.length - 2) ;

    if (incluirHora) {

        var hora = '0' + v1.getHours();
        var min = '0' + v1.getMinutes();
        var sec = '0' + v1.getSeconds();

        value += ' ' + hora.substring(hora.length - 2) + ':' +
                min.substring(min.length - 2) + ':' +
                sec.substring(sec.length - 2);

    }

    return value;
}
/**Método para convertir un string /Date(1315375200000)/ a date
* @param fecha String
* @return yyyy-MM-dd HH:mm:ss Date
* */
Contenedor.prototype.parseDateStringToDate = function (value) {

    var millis = value.replace('/Date(', '').replace(')/', '');
    var dFecha = new Date(parseInt(millis));

    return dFecha;
}

Contenedor.prototype.emptyIfNull = function (value) {
    if (value == null)
        return "";
    else
        return value;
}

// Todos los controles que tengan el atributo data-help
// permitirán mostrar ayudas para el usuario al dar click sobre ellos.
// El atributo data-help será una clave definida por el programador
// Para que estas funciones sirvan, debe haber en la página un control textbox oculto
// que tenga la url a la cuál pedir la ayuda por su id
// Si no existe esta url, entonces no funcionará..
// El control oculto debe tener ID=txtUrlHelper
Contenedor.prototype.initHelps = function () {
    var self = this;

    $('#' + self.id).find('[data-help]').each(function (e) {
        self.initHelpHtmlControl($(this));
    });
}

Contenedor.prototype.initHelpHtmlControl = function (ctrlHTML) {
    var self = this;

    $(ctrlHTML).click(function (e) {
        var message = $(this).attr('data-helpmessage');

        // Si el elemento no tiene un id, entonces debemos crear uno
        var id = $(this).attr('id');
        if (id == undefined || id == null || id == '') {
            id = 'hlp' + new Date.getDate();
        }

        if (message == undefined || message == null || message == '') {

            var k = $(this).attr('data-help');

            if (k != null && k != undefined && k != '') {
                var url = $('#txtUrlHelper').val();

                message = self.doHtmlRequest(url, { 'k': k }, false);

                $(this).attr('data-helpmessage', message);
            }
        }

        var p = $(this).attr('data-helpposition');
        if (p == '' || p == undefined || p == null) {
            p = 'right';
        }

        var t = $(this).attr('data-helptype');
        if (t == '' || t == undefined || t == null) {
            t = 'help';
        }

        if (message != null && message != undefined && message != '') {
            //aNotify.showInElement(t, id, message, false, p);

            // Cerrar todas las ayudas que estén abiertas
            if (self.helpsArray != null) {
                for (var i = 0; i < self.helpsArray.length; i++) {
                    self.helpsArray[i].close();
                }
                self.helpsArray = null;
            }

            self.helpsArray = new Array();

            var aNot = new AlgoriaNotify();
            aNot.defaultWidth = 300;
            aNot.defaultHeight = 20;

            aNot.timeAutoClose = 0; // Se elimina autoClose

            var zIndex = $(this).css('zIndex');
            if (zIndex == null || isNaN(zIndex) || zIndex < 30) {
                zIndex = 30;
            }
            aNot.showed = function (id) {
                $('#' + aNot.id).css('zIndex', zIndex);
            }

            aNot.setMessageType(t);
            aNot.showInElement(id, message, p);

            self.helpsArray[0] = aNot;
        }
    });
}

Contenedor.prototype.getCombo = function (prop) {
    var self = this;

    if (self.objectOfCombos[prop] != null && self.objectOfCombos[prop] != undefined) {
        return self.objectOfCombos[prop].combo;
    }

    return null;
};