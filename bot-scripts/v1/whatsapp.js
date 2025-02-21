function getLocationInteractive(msg) {

    var location_request_message = {
        "type": "location_request_message",
        "body": {
            "text": msg//max 1.024 caracteres
        },
        "action": {
            "name": "send_location"
        }
    };
    return JSON.stringify(location_request_message);
}

function getCtaUrlInteractive(cta) {

    var cta_url = {
        "type": "cta_url",
        "body": {
            "text": cta.body//max 1.024 caracteres
        },
        "action": {
            "name": "cta_url",
            "parameters": {
                "display_text": limitCharacter(cta.button, 20),
                "url": cta.url
            }
        }
    };
    return JSON.stringify(cta_url);
}

var interactiveButton = function (body, buttons, footer, img) {

    var button = {
        "type": "button",
        "body": {
            "text": limitCharacter(body, 1024)
        },
        "action": {
            "buttons": []
        }
    };
    for (var i = 0; i < buttons.length; i++) {
        if (i >= 3) {
            break;
        }
        button.action.buttons.push({
            "type": "reply",
            "reply": {
                "id": limitCharacter(buttons[i].id, 256),
                "title": limitCharacter(buttons[i].title, 20),
            }
        })
    }
    if (img) {
        button.header = {
            type: "image",
            image: {
                link: img
            }
        }
    }
    if (footer) {
        button.footer = {
            text: limitCharacter(footer, 60)
        }
    }
    return JSON.stringify(button);
}

var createList = function (body, button, list) {

    var playload = {
        "type": "list",
        "body": {
            "text": body
        },
        "action": {
            "button": limitCharacter(button, 20),
            "sections": [{
                "title": "Escolha uma opção:",
                "rows": []
            }]
        }
    };
    for (var i = 0; i < list.length; i++) {
        if (i >= 10) {
            break;
        }
        var row = {
            "id": limitCharacter(list[i].id, 200),
            "title": limitCharacter(list[i].title, 24),
            "description": limitCharacter(list[i].description, 72)
        }
        playload.action.sections[0].rows.push(row);
    }
    return JSON.stringify(playload);
}

var createFlow = function (body, button, flowId, header, footer, data) {

    var payload = {
        "type": "flow",
        "body": {
            "text": body
        },
        "action": {
            "name": "flow",
            "parameters": {
                "flow_message_version": "3",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAD0QI3s.",
                "flow_id": flowId,
                "flow_cta": limitCharacter(button, 20),
                "flow_action": "navigate",
                "flow_action_payload": {
                    "screen": "getPersonalData"
                }
            }
        }
    };
    if (header) {
        payload.header = {
            type: "text",
            text: header
        }
    }
    if (footer) {
        payload.footer = {
            text: limitCharacter(footer, 60)
        }
    }
    if (data) {
        payload.action.parameters.flow_action_payload.data = data
    }

    return JSON.stringify(payload);
}


var limitCharacter = function (text, limit) {
    return text ? text.substring(0, limit) : "";
}