/**
 * Clase AJAX
 * Esta clase tiene como objetivo ser usada por otros componentes 
 * o ser usada en peticiones Ajax sencillas, posee en sus 
 * comportamientos el manejo de errores, control de llamadas Ajax.
 */
function AJAX(){
var objSelf = this;
 
this.CurrentRequests = {};
}
 

/**
 * Realiza una peticion ajax, la respuesta viene por JSON
 * @param $1 nombre de la llamada
 * @param $2 url de la peticion
 * @param $3 datos
 * @param $4 metodo callback
 * @param $5 objeto que regresara en el metodo callback como segundo parametro si existe.
 */
AJAX.prototype.GetJSON = function( $1, $2, $3, $4,$5 ){
var objSelf = this;
var strName = $1;
var strURL = $2;
var objOptions = $3;
var fnCallback = $4;
var object = $5;

if (arguments.length == 3){

//Name is not being used.
strName = null;
strURL = $1;
objOptions = $2;
fnCallback = $3;

}

if (!this.CurrentRequests[ strName ]){

//Store current request.
this.CurrentRequests[ strName ] = true;
waitingDialog({});
//Make actual AJAX request.
	$.ajax({
		//Basic JSON properties.
		url: strURL,
		data: objOptions,
		dataType: "json",
		type:"POST",
		
		//The success call back.
		success: function( objResponse ){
		//Remove request flag.
		objSelf.CurrentRequests[ strName ] = false;
		//closeWaitingDialog();
		//Pass off to success handler.
		fnCallback( objResponse,object );
		},
		
		//The error handler.
		error: function(request,type,errorThrown){
			//Remove request flag.
			objSelf.CurrentRequests[ strName ] = false;
			//closeWaitingDialog();			
			objSelf.ajaxError(request, type, errorThrown);
		}
	});

} else {

//This request is currently being processed.
alert( "La petición esta siendo procesada. Se paciente." );

}
};


/**
 * Realiza una peticion ajax, la respuesta viene por JSON y es sincrona
 * @param $1 nombre de la llamada
 * @param $2 url de la peticion
 * @param $3 datos
 * @param $4 metodo callback
 * @param $5 objeto que regresara en el metodo callback como segundo parametro si existe.
 */
AJAX.prototype.GetJSONSyn = function( $1, $2, $3, $4,$5 ){
	var objSelf = this;
	var strName = $1;
	var strURL = $2;
	var objOptions = $3;
	var fnCallback = $4;
	var object = $5;

	if (arguments.length == 3){

	//Name is not being used.
	strName = null;
	strURL = $1;
	objOptions = $2;
	fnCallback = $3;

	}

	if (!this.CurrentRequests[ strName ]){

	//Store current request.
	this.CurrentRequests[ strName ] = true;
	//waitingDialog({});
	//Make actual AJAX request.
		$.ajax({
			//Basic JSON properties.
			url: strURL,
			data: objOptions,
			dataType: "json",
			type:"POST",
			async: false,
			
			//The success call back.
			success: function( objResponse ){
			//Remove request flag.
			objSelf.CurrentRequests[ strName ] = false;
		//	closeWaitingDialog();
			//Pass off to success handler.
			fnCallback( objResponse,object );
			},
			
			//The error handler.
			error: function(request,type,errorThrown){
				//Remove request flag.
				objSelf.CurrentRequests[ strName ] = false;
				//closeWaitingDialog();				
				objSelf.ajaxError(request, type, errorThrown);
			}
		});

	} else {

	//This request is currently being processed.
	alert( "La petición esta siendo procesada. Se paciente." );

	}
	};


/**
 * Realiza una peticion ajax, la respuesta viene en HTML
 * @param $1 nombre de la llamada
 * @param $2 url de la peticion
 * @param $3 datos
 * @param $4 metodo callback
 * @param $5 objeto que regresara en el metodo callback como segundo parametro si existe.
 */	
AJAX.prototype.GetHTML = function( $1, $2, $3, $4 ){
	var objSelf = this;
	var strName = $1;
	var strURL = $2;
	var objOptions = $3;
	var fnCallback = $4;

	if (arguments.length == 3){

	//Name is not being used.
	strName = null;
	strURL = $1;
	objOptions = $2;
	fnCallback = $3;

	}

	if (!this.CurrentRequests[ strName ]){

	//Store current request.
	this.CurrentRequests[ strName ] = true;

	//Make actual AJAX request.
		$.ajax({
			//Basic JSON properties.
			type:	"POST",
			url: strURL,
			data: objOptions,
			dataType: "text",
			type:"POST",
			
			//The success call back.
			success: function( objResponse ){
			//Remove request flag.
			objSelf.CurrentRequests[ strName ] = false;
			
			//Pass off to success handler.
			fnCallback( objResponse );
			},
			
			//The error handler.
			error: function(request,type,errorThrown){
				//Remove request flag.
				objSelf.CurrentRequests[ strName ] = false;
				objSelf.ajaxError(request, type, errorThrown);
			}
		});

	} else {

	//This request is currently being processed.
	alert( "La petición esta siendo procesada. Se paciente." );

	}
	};

	

/**
 * Tratamiento de errores..
 * @param request
 * @param type tipo de error
 * @param errorThrown 
 * @return
 */
AJAX.prototype.ajaxError = function (request, type, errorThrown)
{
	objSelf = this;	
	var login = false;
	
	var message = "Hay un error en la peticion.\n";
    switch (type) {
        case 'timeout':
            message += "La petición sobrepaso el tiempo de respuesta.";
            break;
        case 'notmodified':
            message += "La petiticion no fue modificada pero no hubo cambios en la cache.";
            break;
        case 'parseerror':
            message += "XML/Json formato incorrecto.";
            break;
        default:
        	message += " HTTP Error (" + request.status + " " + request.statusText + ").";
        	message += "\n";
        	 switch (request.status) { 
             case 401:             	 
            	 message +=errorThrown;            	 
            	 login = true;
             break; 
             case 402: 
            	 message +="Estoy en la segunda condición del segundo case"; 
             break; 
        	 }                     
    }
    
    alert(message);
    if(login)
    	window.location = "/Arquitectura";
};

