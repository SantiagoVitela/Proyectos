
    //enfocamos el campo para digitar nombres (cuestion de usabilidad)
    $('#txtNombre').focus();
    PosEliminarElemento = function () { }
    function EliminarLista(lista) {
        
        //$('#divLista ul').remove();
        var $ulLista;
        $ulLista = $('#' + lista).find('ul');
        $ulLista.remove();

    }
    //evento al hacer clic en el boton agregar
    function AgregarElemento(texto,lista,id){
        //obtenemos el nombre digitado por el usuario, y el limite establecido
        //con la funcion parseInt() convertimos de texto a numero
        var $txtNombre=$('#txtNombre'), iLimite=parseInt($('#selLimite').val());
         
        //verificamos que el campo nombre no este vacio
        if($.trim(texto)!=''){
            //variable para contener la lista html
            var $ulLista;
            //si la lista html no existe entonces la agregamos al dom
            if(!$('#'+lista).find('ul').length) $('#'+lista).append('<ul/>');
             
            //obtenemos una instancia de la lista
            $ulLista=$('#'+lista).find('ul');
            iLimite = 0;
            //verificamos el limite de elementos
            if($ulLista.find('div').length<iLimite || iLimite==0){
                //creamos el item que va a contener el nombre y el boton eliminar
                var $liNuevoNombre = $('<div valor=' + id + '></div>').html('<a class="clsEliminarElemento Eliminar">&nbsp;</a>' + $.trim(texto));
                 
                //verificamos la posicion en la que debemos agregar el nuevo elemento (inicio o final de la lista)
                if($('#chkAgregarAlInicio').is(':checked')){
                    //agregamos el elemento al inicio (con prepend)
                    $ulLista.prepend($liNuevoNombre);
                }else{
                    //agregamos el elemento al final de la lista (con append)
                    $ulLista.append($liNuevoNombre);
                }
            //no se pueden agregar mas elementos, debido al limite establecido
            }else{
                alert('No es posible agregar el elemento. Se permiten solamente '+iLimite+'.');
            }
        //el campo nombre esta vacio
        }else{
            alert('Por favor, digite el nombre que desea agregar a la lista.')
        }
        //limpiamos el campo nombre y lo enfocamos
        $txtNombre.val('').focus();
    }
    //evento al hacer clic en el boton agregar
    function AgregarElementoL(texto, lista, id) {
        //obtenemos el nombre digitado por el usuario, y el limite establecido
        //con la funcion parseInt() convertimos de texto a numero
        var $txtNombre = $('#txtNombre'), iLimite = parseInt($('#selLimite').val());

        //verificamos que el campo nombre no este vacio
        if ($.trim(texto) != '') {
            //variable para contener la lista html
            var $ulLista;
            //si la lista html no existe entonces la agregamos al dom
            if (!$('#' + lista).find('ul').length) $('#' + lista).append('<ul/>');

            //obtenemos una instancia de la lista
            $ulLista = $('#' + lista).find('ul');
            iLimite = 0;
            //verificamos el limite de elementos
            if ($ulLista.find('div').length < iLimite || iLimite == 0) {
                //creamos el item que va a contener el nombre y el boton eliminar
                var $liNuevoNombre = $('<div valor=' + id + '></div>').html('<a class="clsEliminarElemento">&nbsp;</a>' + $.trim(texto));

                //verificamos la posicion en la que debemos agregar el nuevo elemento (inicio o final de la lista)
                if ($('#chkAgregarAlInicio').is(':checked')) {
                    //agregamos el elemento al inicio (con prepend)
                    $ulLista.prepend($liNuevoNombre);
                } else {
                    //agregamos el elemento al final de la lista (con append)
                    $ulLista.append($liNuevoNombre);
                }
                //no se pueden agregar mas elementos, debido al limite establecido
            } else {
                alert('No es posible agregar el elemento. Se permiten solamente ' + iLimite + '.');
            }
            //el campo nombre esta vacio
        } else {
            alert('Por favor, digite el nombre que desea agregar a la lista.')
        }
        //limpiamos el campo nombre y lo enfocamos
        $txtNombre.val('').focus();
    }
    function obtenerElementosLista(lista) {
        $ulLista = $('#' + lista).find('ul');
        var list = new Array();

        var listatemp = $ulLista.find('div');

        if (listatemp.length != 0) {
            for (i = 0; i < listatemp.length; i++) {
                var campo = {};
                campo.Clave = listatemp.eq(i).attr("valor")
                list.push(campo);
            }
        }
        return list;
    }
    function isElementoAgregado(lista,id) {
        $ulLista = $('#' + lista).find('ul');
        

        var listatemp = $ulLista.find('div');

        if (listatemp.length != 0) {
            for (i = 0; i < listatemp.length; i++) {
                var campo = {};
                campo.Clave = listatemp.eq(i).attr("valor")
                if (campo.Clave == id) {
                    return true;
                }
            }
        }
        return false;
    }
    //evento al hacer clic en el boton eliminar de cada item de la lista
    //se debe usar "live", ya que son elementos generados donamicamente
    $('.Eliminar').live('click', function () {
        //buscamos la lista
        var $ulLista = $('#divLista').find('ul');
        //buscamos el padre del boton (el tag li en el que se encuentra)
        var $liPadre = $($(this).parents().get(0));

        //eliminamos el elemento
        $liPadre.remove();
        //si la listaesta vacia entonces la eliminamos del dom
        if ($ulLista.find('div').length == 0) $ulLista.remove();
        PosEliminarElemento();
    });
     
    //eliminamos los elementos impares en la lista (odd)
    $('#btnEliminarPares').on('click',function(){
        $('#divLista ul li:odd').remove();
    });
     
    //eliminamos los elementos pares en la lista (even)
    $('#btnEliminarImpares').on('click',function(){
        $('#divLista ul li:even').remove();
    });
     
    //eliminamos la lista del dom
    $('#btnEliminarTodo').on('click',function(){
        $('#divLista ul').remove();
    });
     
    
