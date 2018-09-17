var shortPass = 'Muy corta'
var badPass = 'Mala'
var goodPass = 'Buena'
var strongPass = 'Potente'

function passwordStrength(password, username) {
    score = 0;

    //password < 4
    if (password.length < 4) { return 0; } // shortPass; }

    //password == username
    if (password.toLowerCase() == username.toLowerCase()) return 1;

    //password length
    score += password.length * 4;
    score += (checkRepetition(1, password).length - password.length) * 1;
    score += (checkRepetition(2, password).length - password.length) * 1;
    score += (checkRepetition(3, password).length - password.length) * 1;
    score += (checkRepetition(4, password).length - password.length) * 1;

    //password has 3 numbers
    if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) score += 5;

    //password has 2 sybols
    if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) score += 5;

    //password has Upper and Lower chars
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;

    //password has number and chars
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) score += 15;
    //
    //password has number and symbol
    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) score += 15;

    //password has char and symbol
    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) score += 15;

    //password is just a nubers or chars
    if (password.match(/^\w+$/) || password.match(/^\d+$/)) score -= 10;

    //verifing 0 < score < 100
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    if (score < 34) return 1; // badPass;
    if (score < 68) return 2; // goodPass;

    return 3; // strongPass;
}

function checkRepetition(pLen, str) {
    res = ""
    for (i = 0; i < str.length; i++) {
        repeated = true
        for (j = 0; j < pLen && (j + i + pLen) < str.length; j++)
            repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen))
        if (j < pLen) repeated = false
        if (repeated) {
            i += pLen - 1
            repeated = false
        }
        else {
            res += str.charAt(i)
        }
    }
    return res
}