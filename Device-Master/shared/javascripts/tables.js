var tables = {
    Plugs: {
        attributes: [
            ["Equipment", "200px"],
            ["ID", "370px"],
            ["IP", "200px"],
            ["WiFi Status", "200px"],
            ["Relay", "200px"],
            ["Blink", "100px"]
        ]
    },
    Users: {
        attributes: [
            ["Card ID", "150px"],
            ["CID", "150px"],
            ["First Name", "240px"],
            ["Last Name", "240px"],
            ["Email", "240px"],
            ["Role", "120px"],
            ["Permissions", "450px"],
            ["Credit", "120px"],
        ]
    },
    Equipment: {
        attributes: [
            ["Name", "200px"],
            ["Model", "200px"],
            ["ID", "300px"],
            ["Plug", "300px"]
        ]
    }
};

var tablesFilter = JSON.parse(JSON.stringify(tables));

const serverIP = "localhost:5000"; // 192.168.0.110

var data;
var DG; // Dashboard Grid
var DG_container; // Dashboard Grid Container
var DG_title;
var AB_wrapper;
var type; // Type of Table e.g. Plugs - used for debugging
var info; // All relavent information on the table
var headers; // Array of header text
var gridTemplateColumns; // Layout of table

function createElem(type, attributes, parent) {
    var elem = document.createElement(type);
    for (var atr = 0; atr < attributes.length; atr++) {
        if (attributes[atr][0] == "innerHTML") {
            elem.innerHTML = attributes[atr][1];
        } else if (attributes[atr][0] == "value") {
            elem.value = attributes[atr][1];
        } else {
            elem.setAttribute(attributes[atr][0], attributes[atr][1]);
        }
    }
    if (parent == "body") {
        document.body.appendChild(elem);
    } else if (parent != "") {
        parent.appendChild(elem);
    }
    return elem
}

function generateTable(loadFunction) {

    // Initialise
    DG = document.getElementById("DG");
    resetDG();
    type = DG.getAttribute("type");
    info = tablesFilter[type];
    headers = [];
    gridTemplateColumns = "grid-template-columns: 50px ";

    for (var i = 0; i < info["attributes"].length; i++) {
        headers.push(info["attributes"][i][0]);
        gridTemplateColumns += (info["attributes"][i][1] + " ");
    }

    DG_container = createElem("DIV", [["class", "DG_container"]], "");
    DG_title = document.getElementById("DG_title");
    DG_title.innerHTML = DG.getAttribute("type");

    // Header
    var DG_header = createElem("DIV", [["class", "DG_header"], ["style", gridTemplateColumns]], "");
    var DG_header_cell = createElem("DIV", [["class", "DG_header_cell"]], DG_header);

    for (const header of headers) {
        DG_header_cell = createElem("DIV", [["class", "DG_header_cell"], ["innerHTML", header]], DG_header);
    }

    DG_container.appendChild(DG_header);

    var DG_body = createElem("DIV", [["class", "DG_body"]], DG_container);

    DG.appendChild(DG_container);
    document.getElementsByClassName("wrapper")[0].appendChild(DG);
    generateActionBar(type);
    loadFunction();
}

function generateActionBar(type) {

    if (type == "Users") {
        AB_wrapper = createElem("DIV", [["class", "AB_wrapper"]], "");
        insertAfter(AB_wrapper, DG_title);
        var AB_container = createElem("DIV", [["class", "AB_container"]], AB_wrapper);
        createElem("DIV", [["class", "AB_button NS P"], ["innerHTML", "Add User"], ["onclick", "addPopupU_AU()"]], AB_container);
        createElem("DIV", [["class", "AB_button NS P"], ["innerHTML", "Remove Users"], ["onclick", "addPopupU_RU()"]], AB_container);
        createElem("DIV", [["class", "AB_button NS P"], ["innerHTML", "Add Credit"], ["onclick", "addPopupU_AC()"]], AB_container);
        createElem("DIV", [["class", "AB_button NS P"], ["innerHTML", "Filter"], ["onclick", "addPopupU_F()"]], AB_container);
    } else if (type == "Equipment") {
        AB_wrapper = createElem("DIV", [["class", "AB_wrapper"]], "");
        insertAfter(AB_wrapper, DG_title);
        var AB_container = createElem("DIV", [["class", "AB_container"]], AB_wrapper);
        createElem("DIV", [["class", "AB_button NS P"], ["innerHTML", "Add Equipment"], ["onclick", "addPopupE_AE()"]], AB_container);
    } 
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function refreshTable(type) {

    var DG_body = resetBody();
    if (data == []) {
        return;
    }

    for (var i = 0; i < data.length; i++) { // Create Rows

        if (type == "Plugs") {
            var DG_body_row = initRow(data[i]["ID"]);
            for (var j = 0; j < headers.length; j++) { // Create Cells for each rows
                if (headers[j] == "Blink") {
                    createCell("button", data[i]["ID"], headers[j], DG_body_row);
                } else if (headers[j] == "Relay") {
                    createCell("toggle", data[i]["ID"], headers[j], DG_body_row);
                } else {
                    createCell("DIV", data[i]["ID"], headers[j], DG_body_row);
                }
            }
        } else if (type == "Users") {
            var DG_body_row = initRow(data[i]["Card ID"]);
            for (var j = 0; j < headers.length; j++) { // Create Cells for each rows
                createCell("DIV", data[i]["Card ID"], headers[j], DG_body_row);
            }
        } else if (type == "Equipment") {
            var DG_body_row = initRow(data[i]["id"]);
            for (var j = 0; j < headers.length; j++) { // Create Cells for each rows
                createCell("DIV", data[i]["id"], headers[j], DG_body_row);
            }
        }
        DG_body.appendChild(DG_body_row);
    }
    DG.appendChild(DG_container);
    updateTable(type);
}

function resetDG() {
    while (DG.firstChild) {
        DG.removeChild(DG.firstChild);
    }
    if (AB_wrapper) {
        AB_wrapper.parentNode.removeChild(AB_wrapper);
    }
}

function resetBody() {
    var DG_body = document.getElementsByClassName("DG_body")[0];
    while (DG_body.firstChild) {
        DG_body.removeChild(DG_body.firstChild);
    }
    return DG_body;
}

function initRow(id) {
    var DG_body_row = createElem("DIV", [["class", "DG_body_row"], ["style", gridTemplateColumns]], "");
    var DG_body_cell = createElem("button", [["class", "DG_body_edit P"], ["onclick", `addPopup_E("${id}")`]], DG_body_row);
    var DG_edit_img = createElem("IMG", [["class", "DG_edit_img NS"], ["src", "../_Shared/options.svg"]], DG_body_cell);

    return DG_body_row;
}

function createCell(type, ID, header, row) {

    var DG_body_cell;
    var data = findRecord(ID, "ID");

    if (type == "DIV") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell"], ["id", `${ID} | ${header}`]], "");
    } else if (type == "toggle") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell_btn NS P"], ["id", `${ID} | ${header}`], ["onclick", `toggle("${ID}", "${data["IP"]}")`]], "");
    } else if (type == "button") {
        DG_body_cell = createElem("DIV", [["class", "DG_body_cell_btn NS P"], ["id", `${ID} | ${header}`], ["onclick", `blink("${ID}", "${data["IP"]}")`]], "");
    }
    row.appendChild(DG_body_cell);
}

function updateTable(type) {

    if (type == "Plugs") {
        for (var i = 0; i < data.length; i++) {
            updateCell(data[i]["ID"], "Equipment", elem => { elem.innerHTML = (data[i]["equipment_name"] != null) ? data[i]["equipment_name"] : "-" });
            updateCell(data[i]["ID"], "ID", elem => { elem.innerHTML = data[i]["ID"] });
            updateCell(data[i]["ID"], "IP", elem => { elem.innerHTML = data[i]["IP"] });
            updateCell(data[i]["ID"], "WiFi Status", elem => {

                if (data[i]["WiFiStatus"] == "online") {
                    elem.setAttribute("style", "background-color: #82ff64");
                } else if (data[i]["WiFiStatus"] == "offline") {
                    elem.setAttribute("style", "background-color: #ff6464");
                }
                elem.innerHTML = data[i]["WiFiStatus"]
            }
            );
            updateCell(data[i]["ID"], "Relay", elem => { updateRelayCell(data[i], elem); });
        }
    } else if (type == "Users") {
        for (var i = 0; i < data.length; i++) {

            updateCell(data[i]["Card ID"], "First Name", elem => { elem.innerHTML = data[i]["First Name"] });
            updateCell(data[i]["Card ID"], "Last Name", elem => { elem.innerHTML = data[i]["Last Name"] });
            updateCell(data[i]["Card ID"], "Email", elem => { elem.innerHTML = data[i]["Email"] });
            updateCell(data[i]["Card ID"], "Card ID", elem => { elem.innerHTML = data[i]["Card ID"] });
            updateCell(data[i]["Card ID"], "CID", elem => { elem.innerHTML = data[i]["CID"] });
            updateCell(data[i]["Card ID"], "Role", elem => { elem.innerHTML = data[i]["Role"] });
            updateCell(data[i]["Card ID"], "Permissions", elem => { 
                elem.innerHTML = JSON.stringify(data[i]["Permissions"], undefined, 3);
                elem.setAttribute("style", "font-size: 0.5em;");
            });
            updateCell(data[i]["Card ID"], "Credit", elem => { elem.innerHTML = data[i]["Credit"] });
        }
    } else if (type == "Equipment") {
        for (var i = 0; i < data.length; i++) {

            updateCell(data[i]["id"], "ID", elem => { elem.innerHTML = data[i]["id"]; elem.setAttribute("style", "font-size: 0.8em;"); });
            updateCell(data[i]["id"], "Name", elem => { elem.innerHTML = data[i]["name"] });
            updateCell(data[i]["id"], "Model", elem => { elem.innerHTML = data[i]["model"] });
            updateCell(data[i]["id"], "Plug", elem => {
                
                elem.innerHTML = "-";
                for (var j = 0; j < plugs.length; j++) {
                    if (data[i]["id"] == plugs[j]["equipment_id"]) {
                        elem.innerHTML = plugs[j]["ID"];
                        elem.setAttribute("style", "font-size: 0.8em;");
                        break;
                    }
                }
            });
        }
    }
}

function updateCell(ID, header, func) {
    elem = document.getElementById(`${ID} | ${header}`);
    if (!elem) {return;}
    func(elem);
}

function fadeOutPopup() {
    var element = document.getElementById("P_wrapper");

    var op = 1;
    var inc = 0.08;
    var timer = setInterval(function () {
        if (op <= 0) {
            element.parentNode.removeChild(element);
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= inc;
    }, 8);
}

function fadeInPopup(element) {
    var op = 0;
    var inc = 0.08;
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += inc;
    }, 8);
}

function findRecord(id, label) {

    for (let i = 0; i < data.length; i++) {
        if (data[i][label] == id) {
            return data[i];
        }
    }
    return [];
}

function updateRecord(recordData) {

    for (let i = 0; i < data.length; i++) {
        if (data[i]["ID"] == recordData["ID"]) {
            data[i]["equipment_name"] = recordData["equipment_name"];
            data[i]["equipment_id"] = recordData["equipment_id"];
            data[i]["ssid"] = recordData["ssid"];
            data[i]["password"] = recordData["password"];
            data[i]["masterIP"] = recordData["masterIP"];
            return;
        }
    }
}

function updateRow(recordData) {

    console.log(recordData);
    document.getElementById(`${recordData["ID"]} | Equipment`).innerHTML = recordData["equipment_name"];
}

function removeLoadingScreen() {
    popup = document.getElementById("loadingPopup");
    popup.parentNode.removeChild(popup);
}

function setLoadingText(text) {
    loadingText = document.getElementById("loadingText");
    loadingText.innerHTML = text;
}

function createPopupLbl(P_grid, data) { // 0: label text, 1: input type, 2: input placeholder, 3: input id, 4: select elements

    var P_label = createElem("DIV", [["class", "P_label NS"], ["innerHTML", data[0]]], P_grid);
    if (data[1] == "DIV") {
        var P_data = createElem("DIV", [["class", "P_label"], ["id", data[3]], ["innerHTML", data[2]], ["style", "text-align:left; font-size: 0.9rem;"]], P_grid);
    } else if (data[1] == "INPUT") {
        var P_data_wrap = createElem("DIV", [["class", "P_input_wrap"]], P_grid);
        var P_data = createElem("INPUT", [["class", "P_input"], ["id", data[3]], ["value", data[2]]], P_data_wrap);
    } else if (data[1] == "SELECT") {
        var P_data_wrap = createElem("DIV", [["class", "P_input_wrap"]], P_grid);
        var P_data = createElem("SELECT", [["class", "P_select"], ["id", data[3]], ["value", data[2]]], P_data_wrap);
        for (let i = 0; i < data[4].length; i++) {
            if (data[4][i].includes("/s/ ")) {
                let str = data[4][i].replace('/s/ ', '');
                createElem("OPTION", [["value", data[4][i]], ["innerHTML", str], ["selected", ""]], P_data);
            } else {
                createElem("OPTION", [["value", data[4][i]], ["innerHTML", data[4][i]]], P_data);
            }
        }
    } else if (data[1] == "CHECKBOX") {
        var P_data_wrap = createElem("DIV", [["class", "P_input_wrap"]], P_grid);
        var P_data = createElem("INPUT", [["type", "checkbox"], ["id", `check | ${data[0]}`]], P_data_wrap);
        P_data.checked = true;
    }
    return P_data;
}

function autoSelect(dataString, list) {

    for (var i = 0; i < list.length; i++) {
        if (dataString == list[i]) {
            list[i] = `/s/ ${list[i]}`;
            break;
        }
    }
    return list;
}