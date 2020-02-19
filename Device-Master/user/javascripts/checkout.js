function checkout() {
    var equipmentSelectionData = JSON.parse(sessionStorage.equipmentSelectionData);
    var equipment = JSON.parse(sessionStorage.equipment);
    var fileData = JSON.parse(sessionStorage.fileData)

    for (var i = 0; i < equipment.length; i++) {
        if (equipmentSelectionData["equipment_id"] == equipment[i]["id"]) {
          equipmentSelectionData['ip'] = 'b2.local';
          equipmentSelectionData['api_key'] = '0920C546396B4E94BDFDDF526FE7E14E';
          checkoutLoad(equipmentSelectionData, fileData);
          break;
        }
    }
}

function checkoutLoad(equipmentSelectionData, fileData){
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      printData = JSON.parse(this.response);

      // Check there is enough balance in account to print
      enoughBalance = true;
      buildFileDisplay(printData, enoughBalance);
      buildHtmlTable(fileTable);
      buildButtons(enoughBalance, equipmentSelectionData);
    }
  }
  xhr.open('GET', `http://${equipmentSelectionData['ip']}/api/files/local/${fileData['path']}`, true);
  xhr.setRequestHeader('x-api-key', equipmentSelectionData['api_key']);
  xhr.send();
}


function buildFileDisplay(printData, enoughBalance){
  //console.log(printData);
  try {
    if (enoughBalance == true){
      printDisplay = {'Filename':printData['display'],
                      'Print Time Estimate':timeFormat(printData['gcodeAnalysis']['estimatedPrintTime']),
                      'Material':'',
                      'Filament':(printData['gcodeAnalysis']['filament']['tool0']['length']/1000).toFixed(2)+' m / '+printData['gcodeAnalysis']['filament']['tool0']['volume'].toFixed(2)+' cm'+'3'.sup(),
                      'Cost':'',
        };
      }
    } catch (err) {
      console.log(err.message);
      if (err.message == "undefined is not an object (evaluating 'printData['gcodeAnalysis']['estimatedPrintTime']')"){
        window.setTimeout(checkout,2000);
      } else {
        console.log(err);
      }
    }
}

function buildButtons(enoughBalance, equipmentSelectionData){
  if(enoughBalance == true){
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Print now";
    btn.setAttribute("class","button")
    btn.onclick = function () { printNow(equipmentSelectionData); };
    button_wrapper = document.getElementsByClassName('button_wrapper')[0];
    button_wrapper.appendChild(btn);
  }
}

function printNow(equipmentSelectionData){
  start = {'command':'start'};
  pause_toggle = {"command": "pause","action": "toggle"};
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log(this.responseText);
    console.log(this.status);
    if (this.status == 204) {
      console.log('print command successful')
      // send confirmation email
      window.location.href = "../views/confirmation.html";
    }
    else {
      alert(this.responseText);
    }
  }
  xhr.open('POST', `http://${equipmentSelectionData['ip']}/api/job`, true);
  xhr.setRequestHeader('x-api-key', equipmentSelectionData['api_key']);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(start));
}

function buildHtmlTable(selector) {
  for (var key in printDisplay) {
    var row$ = $('<tr/>');
    var cellValue = printDisplay[key];
    if (cellValue == null) cellValue = "";
    row$.append($('<th/>').html(key))
    row$.append($('<td/>').html(cellValue));
    $(selector).append(row$);
  }
}

function timeFormat(time){
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
