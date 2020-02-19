function testStorage() {
    var title = document.getElementsByClassName("header_title")[0];

    var equipmentSelectionData = JSON.parse(sessionStorage.equipmentSelectionData);
    var equipment = JSON.parse(sessionStorage.equipment);

    for (var i = 0; i < equipment.length; i++) {
        if (equipmentSelectionData["equipment_id"] == equipment[i]["id"]) {
            title.innerHTML = `The selected item was: ${equipment[i]["name"]}`;
            // retrieve equipment ip and api_key
            // if ip and api_key and can be uploaded, create file upload
            // store printer info in session

            // retrieve messages
            user = 'william.pepera15@imperial.ac.uk';

            getUserMessages(user, function(messages, error){
              if (error) {
                console.log(error);
              } else {
                attachments = [];
                completedRequests = 0;
                for (var i = 0; i < messages.length; i++){
                  getAttachment(messages[i], function(attachment, error){
                    if (error) {
                      console.log(error);
                    } else {
                      completedRequests ++;
                      //console.log(attachment)
                      attachments = attachments.concat(attachment);
                      if (completedRequests == messages.length){
                        //console.log(attachments);
                        buildHtmlSelect(attachments, mailSelect);
                      }
                    }
                  });
                }

              }
            });

            break;
        }
    }
}

// HTML Select
function buildHtmlSelect(attachments, selector) {
  var selectMenu = document.createElement("select");
  selectMenu.setAttribute("class","selectMenu");
  selectMenu.setAttribute("id","selectMenu");
  select_wrapper = document.getElementsByClassName('mailSelect')[0];
  select_wrapper.appendChild(selectMenu);

  gcodeFiles = [];
  g = 0;
  for (var i = 0; i < attachments.length; i++){
    if (attachments[i]['@odata.mediaContentType'] == "application/octet-stream"){
      var option = document.createElement("option");
      option.value = g;
      option.text = attachments[i]['name'];
      selectMenu.appendChild(option);
      gcodeFiles.push(attachments[i]);
      g++
    }
  }

  //console.log(gcodeFiles);
  sessionStorage.gcodeFiles = JSON.stringify(gcodeFiles, undefined, 3);
  submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "Submit");
  select_wrapper.appendChild(submit);

  //customMenu();
}

function customMenu(){
  var x, i, j, selElmnt, a, b, c;
  /*look for any elements with the class "mailSelect":*/
  x = document.getElementsByClassName("mailSelect");
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
      /*for each option in the original select element,
      create a new DIV that will act as an option item:*/
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function(e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          var y, i, k, s, h;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          h = this.parentNode.previousSibling;
          for (i = 0; i < s.length; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              for (k = 0; k < y.length; k++) {
                y[k].removeAttribute("class");
              }
              this.setAttribute("class", "same-as-selected");
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
  }
  function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  /*if the user clicks anywhere outside the select box,
  then close all select boxes:*/
  document.addEventListener("click", closeAllSelect);
}

// Outlook API
// Get Attachment
function getAttachment(message, callback) {
  getAccessToken(function(accessToken) {
    if (accessToken) {
      // Create a Graph client
      var client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
          // Just return the token
          done(null, accessToken);
        }
      });

      // Get the attachment
      client
        .api(`/me/messages/${message['id']}/attachments`)
        .get((err, res) => {
          if (err) {
            callback(null, err);
          } else {
            callback(res.value);
          }
        });
    } else {
      var error = { responseText: 'Could not retrieve access token' };
      callback(null, error);
    }
  });
}

function getUserMessages(user, callback) {
  getAccessToken(function(accessToken) {
    if (accessToken) {
      // Create a Graph client
      var client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
          // Just return the token
          done(null, accessToken);
        }
      });

      // Get the 5 newest messages
      client
        .api('/me/messages')
        .top(5)
        .filter(`receivedDateTime gt 2020-01-01 and (from/emailAddress/address) eq '${user}' and hasAttachments eq true`)
        .orderby('receivedDateTime DESC')
        .select('subject,from,receivedDateTime')
        .get((err, res) => {
          if (err) {
            callback(null, err);
          } else {
            callback(res.value);
          }
        });
    } else {
      var error = { responseText: 'Could not retrieve access token' };
      callback(null, error);
    }
  });
}

function getAccessToken(callback) {
  var now = new Date().getTime();
  var isExpired = now > parseInt(sessionStorage.tokenExpires);
  // Do we have a token already?
  if (sessionStorage.accessToken && !isExpired) {
    // Just return what we have
    if (callback) {
      callback(sessionStorage.accessToken);
    }
  } else {
    // Attempt to do a hidden iframe request
    console.log('token expired')
  }
}
