/****************************************************************************

    Nombre      : algoriaUploader
    Autor       : René Quintero Alvarez
    Fecha       : 30/Ago/2013
    Descripción : Permite configurar un control tipo File personalizado (No el que traen por default los exploradores)

    Modo empleo :

                var up = new AlgoriaUploader('dvContenedor');
                up.showFileControl = false;  // Por default es true
                up.submitOnSelect = true;       // Por default es false
                up.create();

    Dependencias: Depende de ajaxfileupload

*****************************************************************************/

var AlgoriaUploader = function (id) {

    var rnd = new Date().getTime() + '' + Math.floor((Math.random() * 100000) + 1);

    this.id = id;
    this.created = false;
    this.showFileControl = true;
    this.showNativeControl = true;
    this.validExtensions = '';
    this.dvContentId = 'dvCont' + rnd;
    this.archivoTxt = '';
    this.formId = 'form' + rnd;
    this.inputFileId = 'file' + rnd;
    this.inputTextId = 'txt' + rnd;
    this.inputButtonId = 'btn' + rnd;
    this.captionSubmit = null;

    this.url = '';

    this.cancelSubmit = false;
    this.cancelSelect = false;

    this.submitOnSelect = false;

    this.contenedorClass = '';
    this.textboxClass = 'dvinput col col-10';
    this.token = null;
}

AlgoriaUploader.prototype.create = function (re) {
    var self = this;

    if (self.showNativeControl == true) {
        self.createClasic();
    } else {
        self.createCustom(re);
    }

    //Inicia la definición de la función Submit
    $('#' + self.formId).submit(function () {

        // Si se configuraron algunos tipos de extensiones de archivos
        if (self.validExtensions != '') {
            var file = self.getSelectedFileName();
            var ext = (file.substring(file.lastIndexOf(".") + 1)).trim().toLowerCase();

            var extArr = self.validExtensions.split(',');
            for (var i = 0; i < extArr.length; i++) {
                extArr[i] = extArr[i].trim();
            }

            if (extArr.indexOf(ext) < 0) {
                dialog('error', 'Archivo', 'Error: Solo se permiten archivos con extension(es) ' + self.validExtensions);
                return false;
            }
        }

        $.ajaxFileUpload({
            url: self.url,
            secureuri: false,
            fileElementId: self.inputFileId,
            dataType: 'json',
            token: self.token,
            success: function (data, status) {

                if (data != undefined) {

                    if (data.Clave != undefined) {
                        if (data.Clave == 0) {
                            self.successSubmit(data);
                        } else {
                            self.errorSubmit(data);
                        }
                    } else {
                        if (data[0].Clave == 0) {
                            self.successSubmit(data);
                        } else {
                            self.errorSubmit(data);
                        }
                    }
                }

                // Se recrea el control
                self.recreate();
            },
            error: function (data) {
                self.errorSubmit(data);

                // Se recrea el control
                self.recreate();
            }
        });

        return false;
    });
    //Termina la definición de la función Submit

    self.created = true;
}
AlgoriaUploader.prototype.createClasic = function () {
    var self = this;

    var objId = document.getElementById(self.id);

    var objForm = document.createElement('form');
    objForm.id = self.formId;
    objForm.name = self.formId;
    objForm.setAttribute('method', 'post');
    objForm.setAttribute('enctype', 'multipart/form-data');

    var objFile = document.createElement('input');
    objFile.type = 'file';
    objFile.name = self.inputFileId;
    objFile.id = self.inputFileId;
    //objFile.setAttribute('style', 'left:0px;top:0px; position:absolute;');

    objId.appendChild(objForm);
    //objdvContent.appendChild(objForm);
    objForm.appendChild(objFile);

    objFile.onchange = function () {
        var objT = document.getElementById(self.inputFileId);
        //objT.value = this.value;

        if (self.submitOnSelect == true) {
            self.submit();
        }
    }
}
AlgoriaUploader.prototype.createCustom = function (re) {
    var self = this;

    var visible = 'visibility:visible;';
    if (self.showFileControl == false) {
        visible = 'visibility:hidden;';
    }

    var objId = document.getElementById(self.id);
    objId.setAttribute('class', self.contenedorClass);

    var objText = document.createElement('input');
    objText.type = 'text';
    objText.name = self.inputTextId;
    objText.id = self.inputTextId;
    objText.size = 50;
    if (re == true) {
        objText.value = self.archivoTxt;
    }
    if (self.captionSubmit != null) {
        objText.value = self.captionSubmit;
    }
    else {
        objText.value = "Seleccione un archivo";
    }
    objText.setAttribute('style', visible);
    objText.setAttribute('class', self.textboxClass);
    objId.appendChild(objText);

    var objBut = document.createElement('input');
    objBut.type = 'button';
    objBut.name = self.inputButtonId;
    objBut.id = self.inputButtonId;
    objBut.value = '...';
    objBut.setAttribute('class', 'btuploader');
    objBut.setAttribute('style', visible);

    objId.appendChild(objBut);

    var objdvContent = document.createElement('div');
    objdvContent.id = self.dvContentId;
    objdvContent.name = self.dvContentId;
    objdvContent.setAttribute('style', 'width:100%;height:5px;left:-10px;top:-2px;position:fixed;overflow:hidden;cursor:pointer;');

    var objForm = document.createElement('form');
    objForm.id = self.formId;
    objForm.name = self.formId;
    objForm.setAttribute('method', 'post');
    objForm.setAttribute('enctype', 'multipart/form-data');
    //objForm.setAttribute('style', 'padding:0px;margin:0px;');

    var objFile = document.createElement('input');
    objFile.type = 'file';
    objFile.name = self.inputFileId;
    objFile.id = self.inputFileId;
    objFile.setAttribute('style', 'left:0px;top:0px; position:absolute;');

    objFile.onchange = function () {
        var objT = document.getElementById(self.inputTextId);
        objT.value = this.value;

        if (self.submitOnSelect == true) {
            self.submit();
        }
    }

    objId.appendChild(objdvContent);
    objdvContent.appendChild(objForm);
    objForm.appendChild(objFile);

    objId.onmouseover = function (e) {
        var dvOt = document.getElementById(self.dvContentId);
        dvOt.style.visibility = 'visible';
    }

    objId.onmouseout = function (e) {
        var dvOt = document.getElementById(self.dvContentId);
        dvOt.style.visibility = 'hidden';
    }

    objId.onmousemove = function (e) {
        var dvOt = document.getElementById(self.dvContentId);

        dvOt.style.left = (-10 * self.mouseX(e)) + 'px';
        dvOt.style.top = (-2 * self.mouseY(e)) + 'px';

    }
}

//AlgoriaUploader

AlgoriaUploader.prototype.recreate = function () {
    var self = this;
    console.log('recreate');
    //var objT = document.getElementById(self.inputTextId);
    //var valueO = objT.val();
    //self.archivotxt = valueO;

    var cont = document.getElementById(self.id);
    var tx = document.getElementById(self.inputTextId);
    var bt = document.getElementById(self.inputButtonId);
    var dv = document.getElementById(self.dvContentId);
    var frm = document.getElementById(self.formId);

    if (!cont) {
        return;
    }

    if (tx) {
        cont.removeChild(tx);
    }

    if (bt) {
        cont.removeChild(bt);
    }

    if (frm) {
        cont.removeChild(frm);
    }

    if (dv) {
        cont.removeChild(dv);
    }
    
    self.create(true);
}

AlgoriaUploader.prototype.clear = function () {
    var self = this;

    $('#' + self.id).each(function () {
        this.reset();
    });
}

AlgoriaUploader.prototype.selectingFile = function () {
    var self = this;
    self.cancelSelect = false;
}

AlgoriaUploader.prototype.selectFile = function () {
    var self = this;

    // Evento pre-selección del archivo
    self.selectingFile();

    if (self.cancelSelect == true) {
        return;
    }

    var objT = document.getElementById(self.inputTextId);
    objT.value = this.value;

    if (self.submitOnSelect == true) {
        self.submit();
    }
}

AlgoriaUploader.prototype.submit = function () {
    var self = this;

    self.submitting();

    if (self.cancelSubmit == true) {
        return;
    }

    self.cancelSubmit = false;
    $("#" + self.formId).submit();
}

AlgoriaUploader.prototype.submitting = function () {
    var self = this;
    self.cancelSubmit = false;
}

AlgoriaUploader.prototype.submitted = function () {
}

AlgoriaUploader.prototype.validFileTypes = function (extensiones) {
    var self = this;
    self.validExtensions = extensiones;
}

AlgoriaUploader.prototype.successSubmit = function (data) {
    dialog('informativo', 'Información', data[0].MensajeUsuario);
}

AlgoriaUploader.prototype.errorSubmit = function (data) {
    dialog('error', 'Error', data[0].MensajeUsuario);
}

AlgoriaUploader.prototype.getSelectedFileName = function () {
    var self = this;
    var fileName = $("#" + self.inputFileId).val();

    return fileName;
}

AlgoriaUploader.prototype.mouseX = function (evt) {

    evt = evt || window.event;

    if (evt.pageX)
        return evt.pageX - (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    else if (evt.clientX)
        return evt.clientX; // - (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    else
        return null;
}

AlgoriaUploader.prototype.mouseY = function (evt) {

    evt = evt || window.event;

    if (evt.pageY)
        return evt.pageY - (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    else if (evt.clientY)
        return evt.clientY; // - (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    else
        return null;
}