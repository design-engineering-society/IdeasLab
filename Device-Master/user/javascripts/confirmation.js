function confirmation(){
  var userData = JSON.parse(sessionStorage.userData);
  var equipmentSelectionData = JSON.parse(sessionStorage.equipmentSelectionData);

  equipmentSelectionData['name'] = 'B2'
  equipmentSelectionData['ip'] = 'b2.local';
  equipmentSelectionData['api_key'] = '0920C546396B4E94BDFDDF526FE7E14E';

  document.getElementsByClassName("header_title")[0].innerHTML = `Your print has started on ${equipmentSelectionData['name']}`
  confirmation_div = document.getElementsByClassName("confirmation_wrapper")[0];
  msg = document.createElement("P");
  msg.setAttribute("class","msg")
  msg.innerHTML = `Thank you ${userData["First Name"]}! You have received a confirmation email`;
  confirmation_div.appendChild(msg);

  //things to check
  checklist = document.createElement("P");
  checklist.setAttribute("class","alert_msg");
  checklist.innerHTML = 'Please ensure that the print bed is clear <br> Please ensure the extruder is free of obstructions'
  confirmation_div.appendChild(checklist);

  // log user out

  // cancel
  var cancel = document.createElement("BUTTON");
  cancel.innerHTML = "Cancel Print";
  cancel.setAttribute("class","cancel_button")
  cancel.onclick = function () { cancelPrint(equipmentSelectionData) };
  confirmation_div.appendChild(cancel);

  // back to equipment page
  var eqp_btn = document.createElement("BUTTON");
  eqp_btn.innerHTML = "Finish";
  eqp_btn.setAttribute("class","small_button")
  eqp_btn.onclick = function () { window.location.href = 'http://localhost:5000/welcome/' };
  confirmation_div.appendChild(eqp_btn);
}


function cancelPrint(equipmentSelectionData){
  cancel = {'command':'cancel'};
  pause_toggle = {"command": "pause","action": "toggle"};
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log(this.responseText);
    console.log(this.status);
    if (this.status == 204) {
      console.log('cancel command successful');
      alert('Cancel command successful, please wait for printer to finish heating before trying again');
    }
    else {
      alert(this.responseText);
    }
  }
  xhr.open('POST', `http://${equipmentSelectionData['ip']}/api/job`, true);
  xhr.setRequestHeader('x-api-key', equipmentSelectionData['api_key']);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(cancel));
}
