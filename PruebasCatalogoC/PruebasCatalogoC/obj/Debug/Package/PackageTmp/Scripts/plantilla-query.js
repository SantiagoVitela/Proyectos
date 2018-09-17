//variable global para controles dropdown
var menu = $("ul.dropdown");

//control de eventos
$(this.document).ready(function () {
    menu.mouseover(function () {
        displayOptions($(this).find("li"));
        $("div#content div.pantalla").addClass("atras");
    });
    menu.mouseout(function () {
        hideOptions($(this));
        $("div#content div.pantalla").removeClass("atras");	
    });
})

//funcion que MUESTRA todos los elementos del menu
function displayOptions(e){
    e.show();    
}
//funcion que OCULTA los elementos del menu
function hideOptions(e){
	e.find("li").hide();
	e.find("li.active").show();	
}


$("ul.dropdown li.active").hover(function() {
		$(this).removeClass("active");
		$(this).addClass("hover");		
	}, function() {
		$(this).removeClass("hover");
		$(this).addClass("active");
});

//Variable global para almacenar mensaje de campos requeridos
var mensajeValidacion = "Los campos marcados con * son requeridos";