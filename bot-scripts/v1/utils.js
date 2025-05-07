function validateCPF(cpf) {
    log.info('[validateCPF] Validando o Cpf: ' + cpf);
    
    if (!cpf || typeof cpf !== 'string') return false;

    if (cpf.length != 11 || cpf == '00000000000' || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333' || cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666' || cpf == '77777777777' || cpf == '88888888888' || cpf == '99999999999')
        return false;

    /* Valida 1o digito */
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;

    /* Valida 2o digito */
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

var validateEmail = function (email) {
    log.info("[validateEmail] Email: " + email);

    if (!email || typeof email !== 'string') return false;

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

function validateCNPJ(cnpj) {
    log.info("[validateCNPJ] Cnpj: " + cnpj);

    if (!cnpj || typeof cnpj !== 'string') return false;

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    /* Elimina CNPJs invalidos conhecidos */
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    /* Valida DVs */
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
};

var validatePhone = function (phone) {
    log.info("[validatePhone] Phone: " + phone);

    if (!phone || typeof phone !== 'string') return false;

    if (phone.indexOf('0000000') >= 0 || phone.indexOf('1111111') >= 0 || phone.indexOf('2222222') >= 0 || phone.indexOf('3333333') >= 0 ||
        phone.indexOf('4444444') >= 0 || phone.indexOf('5555555') >= 0 || phone.indexOf('6666666') >= 0 || phone.indexOf('7777777') >= 0 ||
        phone.indexOf('8888888') >= 0 || phone.indexOf('9999999') >= 0) {
        return false;
    }

    if (phone.length <= 9 || phone.length > 11) {
        return false;
    }

    if (phone[2] != '9' && phone[2] != '8' && phone[2] != '7' && phone[2] != '6') {
        return false;
    }
    

    return true;
}