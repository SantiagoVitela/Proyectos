
function doSubmit(url, type, params) {

    var realType = 'POST';
    if (type != undefined && type.toString().toLowerCase() == 'get' && type.toString().toLowerCase() == 'post') {
        realType = type;
    }

    var formul = document.createElement('form');
    formul.action = url;
    formul.method = realType;

    for (var p in params) {
        var texto = document.createElement('input');
        texto.setAttribute('type', 'hidden');
        texto.setAttribute('name', p);
        texto.setAttribute('id', p);
        texto.setAttribute('value', params[p]);

        formul.appendChild(texto);
    }

    document.body.appendChild(formul);
    formul.submit();
}