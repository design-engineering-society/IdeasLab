function fileUpload(){
  var select = document.getElementById('selectMenu');
  gcodeFiles = JSON.parse(sessionStorage.gcodeFiles);

  file_content =  window.atob(gcodeFiles[select.selectedIndex]['contentBytes']);
  filename = gcodeFiles[select.selectedIndex]['name'];

  if (file_content != 'undefined'){
    var equipmentSelectionData = JSON.parse(sessionStorage.equipmentSelectionData);
    var equipment = JSON.parse(sessionStorage.equipment);

    var form = new FormData();

    for (var i = 0; i < equipment.length; i++) {
        if (equipmentSelectionData["equipment_id"] == equipment[i]["id"]) {
            var host = 'http://'+equipment[i]["ip"];
            var api_key = equipment[i]["api_key"];
            break;
        }
    }

    host = 'http://b2.local';
    api_key = '0920C546396B4E94BDFDDF526FE7E14E';

    var myblob = new Blob([file_content], {
        type: 'application/octet-stream'
    });

    form.append("file", myblob, filename);
    form.append("select", "true");
    form.append("print", "false");

    console.log(form);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": host + "/api/files/local",
      "method": "POST",
      "headers": {
        "x-api-key": api_key,
        "cache-control": "no-cache",
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      var res = JSON.parse(response);
      console.log(res['done']);
      // check if file uploaded is successful
      if (res['done']==true){
        console.log('loading checkout')
        // store file information
        fileData = {'path':res['files']['local']['path']}
        sessionStorage.fileData = JSON.stringify(fileData, undefined, 3)
        console.log(fileData)
        window.location.href = "../user/views/checkout.html";
      }
    }).error(function() { alert("Select a file to upload"); });
  }
}
