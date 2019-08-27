function Users_loadFunction() {
    loadUsers();
}

function loadUsers() { // Requests to load all the ESP data from the database

    setLoadingText("Loading user data");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {

        if (this.status == 200) {

            data = JSON.parse(this.responseText);
            if (!data["error"]) {
                console.log(data);
                console.log(`Loaded ${Object.keys(data).length} Users(s) from database`);

            } else {
                data = [];
                console.log("Error loading Users");
            }
            refreshTable("Users");
            removeLoadingScreen();
        }
    };

    xhr.open('GET', `http://${serverIP}/loadUsers`, true); // Retrive ESP data
    xhr.send();
}

function addPopupU_AU() {

    //let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Add user"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["CID:", "INPUT", "", "U_AU_CID"]);
    createPopupLbl(P_grid, ["Username:", "INPUT", "", "U_AU_username"]);
    createPopupLbl(P_grid, ["First Name:", "INPUT", "", "U_AU_firstname"]);
    createPopupLbl(P_grid, ["Last Name:", "INPUT", "", "U_AU_lastname"]);
    createPopupLbl(P_grid, ["Department:", "SELECT", "", "U_AU_department",
        ["/s/ Design Engineering",
            "Electronic and Information Engineering"]]);
    createPopupLbl(P_grid, ["Program:", "SELECT", "", "U_AU_program",
        ["BEng", "BA", "BSc", "/s/ MEng", "MA", "MSc"]]);
    createPopupLbl(P_grid, ["Description:", "INPUT", "", "U_AU_description"]);
    createPopupLbl(P_grid, ["Study Date Start:", "INPUT", "", "U_AU_sds"]);
    createPopupLbl(P_grid, ["Study Date End:", "INPUT", "", "U_AU_sde"]);
    createPopupLbl(P_grid, ["Study Year:", "INPUT", "", "U_AU_studyyear"]);
    createPopupLbl(P_grid, ["Role:", "SELECT", "", "U_AU_role", ["/s/ user", "rep"]]);
    createPopupLbl(P_grid, ["Equipment Type Access:", "INPUT", "", "U_AU_eta"]);
    createPopupLbl(P_grid, ["Credit:", "INPUT", "", "U_AU_credit"]);
    createPopupLbl(P_grid, ["Date User Inducted:", "INPUT", "", "U_AU_dui"]);
    createPopupLbl(P_grid, ["Remarks:", "INPUT", "", "U_AU_remarks"]);

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Add User"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}


function addPopupU_RU() {

    //let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Remove Users"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["Filter:", "DIV", ""]);
    createPopupLbl(P_grid, ["Department:", "SELECT", "", "U_RU_department",
        ["/s/  -", "Design Engineering",
            "Electronic and Information Engineering"]]);
    createPopupLbl(P_grid, ["Program:", "SELECT", "", "U_RU_program",
        ["/s/  -", "BEng", "BA", "BSc", "MEng", "MA", "MSc"]]);
    createPopupLbl(P_grid, ["Study Date Start:", "INPUT", "", "U_RU_sds"]);
    createPopupLbl(P_grid, ["Study Date End:", "INPUT", "", "U_RU_sde"]);
    createPopupLbl(P_grid, ["Study Year:", "INPUT", "", "U_RU_studyyear"]);
    createPopupLbl(P_grid, ["Role:", "SELECT", "", "U_RU_role", ["/s/ -", "user", "rep"]]);

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Remove Users"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}

function addPopup_E(id) {

    let popupData = findRecord(id, "Card ID");
    console.log(popupData);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Edit user"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["CID:", "INPUT", popupData["CID"], "U_AU_CID"]);
    createPopupLbl(P_grid, ["Username:", "INPUT", popupData["Username"], "U_AU_username"]);
    createPopupLbl(P_grid, ["First Name:", "INPUT", popupData["First Name"], "U_AU_firstname"]);
    createPopupLbl(P_grid, ["Last Name:", "INPUT", popupData["Last Name"], "U_AU_lastname"]);
    createPopupLbl(P_grid, ["Department:", "SELECT", popupData["Department"], "U_AU_department",
        autoSelect(popupData["Department"], ["Design Engineering", "Electronic and Information Engineering"])]);
    createPopupLbl(P_grid, ["Program:", "SELECT", "", "U_AU_program",
        autoSelect(popupData["Program"], ["BEng", "BA", "BSc", "MEng", "MA", "MSc"])]);
    createPopupLbl(P_grid, ["Description:", "INPUT", popupData["Description"], "U_AU_description"]);
    createPopupLbl(P_grid, ["Study Date Start:", "INPUT", popupData["Study Date Start"], "U_AU_sds"]);
    createPopupLbl(P_grid, ["Study Date End:", "INPUT", popupData["Study Date End"], "U_AU_sde"]);
    createPopupLbl(P_grid, ["Study Year:", "INPUT", popupData["Study Year"], "U_AU_studyyear"]);
    createPopupLbl(P_grid, ["Role:", "SELECT", "", "U_AU_role",
        autoSelect(popupData["Role"], ["user", "rep"])]);
    createPopupLbl(P_grid, ["Equipment Type Access:", "INPUT", popupData["Equipment Type Access"], "U_AU_eta"]);
    createPopupLbl(P_grid, ["Credit:", "INPUT", popupData["Credit"], "U_AU_credit"]);
    createPopupLbl(P_grid, ["Date User Inducted:", "INPUT", popupData["Date User Inducted"], "U_AU_dui"]);
    createPopupLbl(P_grid, ["Remarks:", "INPUT", popupData["Remarks"], "U_AU_remarks"]);

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Edit User"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}

function addPopupU_AC() {

    //let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Add credit"], ["class", "NS"]], P_grid);

    createPopupLbl(P_grid, ["Department:", "SELECT", "", "U_AC_department",
        ["/s/  -", "Design Engineering",
            "Electronic and Information Engineering"]]);
    createPopupLbl(P_grid, ["Program:", "SELECT", "", "U_AC_program",
        ["/s/  -", "BEng", "BA", "BSc", "MEng", "MA", "MSc"]]);
    createPopupLbl(P_grid, ["Study Date Start:", "INPUT", "", "U_AC_sds"]);
    createPopupLbl(P_grid, ["Study Date End:", "INPUT", "", "U_AC_sde"]);
    createPopupLbl(P_grid, ["Study Year:", "INPUT", "", "U_AC_studyyear"]);
    createPopupLbl(P_grid, ["Role:", "SELECT", "", "U_AC_role", ["/s/ -", "user", "rep"]]);
    createPopupLbl(P_grid, ["Credit to add (£):", "INPUT", "", "U_AC_credit"]);

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Add credit"]], P_update_wrap);

    fadeInPopup(P_wrapper);
}

function addPopupU_FC() {

    //let popupData = findRecord(id);

    const P_wrapper = createElem("DIV", [["id", "P_wrapper"]], "body");
    const P_back = createElem("DIV", [["id", "P_back"], ["onclick", "fadeOutPopup()"]], P_wrapper);
    const P_panel = createElem("DIV", [["id", "P_panel"]], P_wrapper);
    const P_grid = createElem("DIV", [["id", "P_grid"]], P_panel);
    const P_title = createElem("DIV", [["id", "P_title"], ["innerHTML", "Filter Columns"], ["class", "NS"]], P_grid);

    var atr = tables.Users.attributes;

    for (var i = 0; i < atr.length; i++) {
        createPopupLbl(P_grid, [`${atr[i][0]}`, "CHECKBOX"]);
    }

    const P_add_wrap = createElem("DIV", [["id", "P_update_wrap"]], P_grid);
    const P_add = createElem("BUTTON", [["id", "P_update"], ["innerHTML", "Update"], ["onclick", `updateColumns()`]], P_update_wrap);

    fadeInPopup(P_wrapper);
}

function updateColumns() {

    usersFilter = tables.Users.attributes;
    var temp = JSON.parse(JSON.stringify(usersFilter));

    for (var i = 0; i < usersFilter.length; i++) {
        var check = document.getElementById(`check | ${usersFilter[i][0]}`).checked;
        if (!check) {
            temp = removeTableAttribute(temp, usersFilter[i][0]);
        }
    }
    
    tablesFilter["Users"]["attributes"] = JSON.parse(JSON.stringify(temp));

    generateTable(() => {
        refreshTable("Users");
    });
}

function removeTableAttribute(table, value) {

    for(var i = 0; i < table.length; i++) {
        if (table[i][0] == value) {
            table.splice(i, 1);
            break;
        }
    }

    return table;
}