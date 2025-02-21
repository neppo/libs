// Status resposta para APIs
var statusResult = {
    error: "Error",
    success: "Success"
}

// Tipos de erros de API
var errorType = {
    not_found: "Não encontrado",
    internal_error: "Erro interno",
    forbidden: "Falha de permissão",
    timeout: 'Requisição demorou mais do que o esperado'
}

// Filtrar Retorno Api Sankhya Querys
function filterSankhyaApiQuery(apiResponse) {
    var responseFilter = [];
    if (apiResponse["status"] == "1") {
        if (apiResponse["responseBody"]["fieldsMetadata"] && apiResponse["responseBody"]["fieldsMetadata"].length) {
            if (apiResponse["responseBody"]["rows"].length > 0) {
                for (var i = 0; i < apiResponse["responseBody"]["rows"].length; i++) {
                    var aux = {};
                    for (var x = 0; x < apiResponse["responseBody"]["fieldsMetadata"].length; x++) {
                        aux[apiResponse["responseBody"]["fieldsMetadata"][x]["name"].toLowerCase()] = apiResponse["responseBody"]["rows"][i][x]
                    }
                    responseFilter.push(aux);
                }
            }
        } else {
            if (apiResponse["responseBody"]["entities"]["total"] > 0) {
                if (apiResponse["responseBody"]["entities"]["total"] == 1) {
                    var aux = {};
                    for (var i = 0; i < apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"].length; i++) {
                        aux[apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"][i]["name"].toLowerCase()] = apiResponse["responseBody"]["entities"]["entity"]["f" + i]["$"]
                    }
                    responseFilter.push(aux);
                } else {
                    for (var i = 0; i < apiResponse["responseBody"]["entities"]["entity"].length; i++) {
                        var aux = {};
                        for (var x = 0; x < apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"].length; x++) {
                            aux[apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"][x]["name"].toLowerCase()] = apiResponse["responseBody"]["entities"]["entity"][i]["f" + x]["$"]
                        }
                        responseFilter.push(aux);
                    }
                }
            }
        }
    }
    return responseFilter;
}

//Filtrar Retorno Api Sankhya Entidades
function filterSankhyaApiEntities(apiResponse) {
    var responseFilter = [];
    if (apiResponse["status"] == "1") {
        if (apiResponse["responseBody"]["fieldsMetadata"] && apiResponse["responseBody"]["fieldsMetadata"].length) {
            if (apiResponse["responseBody"]["rows"].length > 0) {
                for (var i = 0; i < apiResponse["responseBody"]["rows"].length; i++) {
                    var aux = {};
                    for (var x = 0; x < apiResponse["responseBody"]["fieldsMetadata"].length; x++) {
                        aux[apiResponse["responseBody"]["fieldsMetadata"][x]["name"].toLowerCase()] = apiResponse["responseBody"]["rows"][i][x]
                    }
                    responseFilter.push(aux);
                }
            }
        } else {
            if (apiResponse["responseBody"]["entities"]["total"] > 0) {
                if (apiResponse["responseBody"]["entities"]["total"] == 1) {
                    var aux = {};
                    for (var i = 0; i < apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"].length; i++) {
                        aux[apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"][i]["name"].toLowerCase()] = apiResponse["responseBody"]["entities"]["entity"]["f" + i]["$"]
                    }
                    responseFilter.push(aux);
                } else {
                    for (var i = 0; i < apiResponse["responseBody"]["entities"]["entity"].length; i++) {
                        var aux = {};
                        for (var x = 0; x < apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"].length; x++) {
                            aux[apiResponse["responseBody"]["entities"]["metadata"]["fields"]["field"][x]["name"].toLowerCase()] = apiResponse["responseBody"]["entities"]["entity"][i]["f" + x]["$"]
                        }
                        responseFilter.push(aux);
                    }
                }
            }
        }
    }
    return responseFilter;
}

// Realiza login no sistema Sankhya
function loginSankhya(token, appKey, username, password) {
    try {
        var url = "https://api.sankhya.com.br/login";

        var response = restClient.postWithHeader(
            url,
            "{}",
            {
                'Content-Type': 'application/json',
                'token': token,
                'appkey': appKey,
                'username': username,
                'password': password,
            });

        log.info('api.sankhya.login: ' + response);
        
        response = JSON.parse(response);
        if (response && response.error != null) {
            return {
                status: statusResult.error,
                error: errorType.forbidden,
            };
        } else {
            return {
                status: statusResult.success,
                result: response
            };
        }
    }catch (err) {
        log.error('api.sankhya.login: ' + err);

        return {
            status: statusResult.error,
            error: errorType.internal_error,
            description: err.message
        };
    }
}
// Realiza logout no sistema Sankhya
function logoutSankhya(bearerToken, appKey) {
    try {
        var token = 'Bearer ' + bearerToken;
        var url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=MobileLoginSP.logout&outputType=json";
        var response = restClient.postWithHeader(
            url,
            "{}",
            {
                'Content-Type': 'application/json',
                'appkey': appKey,
                'Authorization': token,
            });
        
        log.info('api.sankhya.logout: ' + response);

        if (response) {
            return {
                status: statusResult.success,
                result: response
            };
        }
    }catch (err){
        log.error('api.sankhya.logout: ' + err.message);
        
        return {
            status: statusResult.error,
            error: errorType.internal_error,
            description: err.message
        };
    }
}

// Realiza consultar de uma entidade no sistema Sankhya
function loadRecordsSankhya (rootEntity, criteria, entity, includePresentationFields, orderByExpression, page, bearerToken) {
    try {
        var token = 'Bearer ' + bearerToken;
        var url = "https://api.sankhya.com.br/gateway/v1/mge/service.sbr?serviceName=CRUDServiceProvider.loadRecords&outputType=json";
        var body = {
            serviceName: "CRUDServiceProvider.loadRecords",
            requestBody: {
                dataSet: {
                    rootEntity: rootEntity,
                    includePresentationFields: includePresentationFields,
                    tryJoinedFields: "true",
                    parallelLoader: "true",
                    offsetPage: page || "0",
                    criteria: criteria,
                    entity: entity
                }
            }
        };

        if (orderByExpression) {
            body.requestBody.dataSet.orderByExpression = orderByExpression;
        }

        var response = restClient.postWithHeader(
            url,
            JSON.stringify(body),
            {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        );

        log.info('api.sankhya.loadRecord.' + rootEntity.toLowerCase() + ':' + response);

        response = JSON.parse(response);
        if (response.status != "1") {
            return {
                status: statusResult.error,
                error: errorType.not_found,
                description: response.statusMessage
            };
        } else {
            return {
                status: statusResult.success,
                result: response
            };
        }
    } catch (err) {
        log.error('api.sankhya.loadRecord.' + rootEntity.toLowerCase() + ':' + err.message);

        return {
            status: statusResult.error,
            error: errorType.internal_error,
            description: err.message
        };
    }
}