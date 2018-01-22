function main() {
    if(localStorage.getItem("username")) {
        notifier();
    }
    else {
        setup();
    }
}

function setup() {
    Notification.requestPermission();
    swal('Welcome! To start using the notifier, please allow us to send you notifications by clicking "Allow" in the top left and then clicking "Done" here below.', {
        buttons: {
            catch: {
                text: "Done",
                value: "done",
            },
        },
    })
        .then((value) => {
        ///if(Notification.permission==="granted") {
        if(1===1) {
newUser("Thanks! Now, enter your username and we're done.",1);
        }
        else {setup();}
    }
             );
}

function notifier() {

    document.getElementById("notifier").style.display = "block";

    if(localStorage.getItem("notifications")==="1") {
        document.getElementById("bellicon").innerText = "notifications_active";
    }
    if(localStorage.getItem("notifications")==="0") {
        document.getElementById("bellicon").innerText = "notifications_off";
    }
    if(localStorage.getItem("sound")==="1") {
        document.getElementById("soundicon").innerText = "volume_up";
    }
    if(localStorage.getItem("sound")==="0") {
        document.getElementById("soundicon").innerText = "volume_off";
    }

    document.getElementById("profilepic").src = "https://cdn2.scratch.mit.edu/get_image/user/"+localStorage.getItem("userid")+"_100x100.png";
    document.getElementById("username").innerText = localStorage.getItem("username");

    document.getElementById("bellicon").onclick = function() {
        if(localStorage.getItem("notifications")==="0") {
            localStorage.setItem("notifications","1");
            document.getElementById("bellicon").innerText = "notifications_active";
            return;
        }
        if(localStorage.getItem("notifications")==="1") {
            localStorage.setItem("notifications","0");
            document.getElementById("bellicon").innerText = "notifications_off";
        }
    };

    document.getElementById("soundicon").onclick = function() {
        if(localStorage.getItem("sound")==="0") {
            localStorage.setItem("sound","1");
            document.getElementById("soundicon").innerText = "volume_up";
            return;
        }
        if(localStorage.getItem("sound")==="1") {
            localStorage.setItem("sound","0");
            document.getElementById("soundicon").innerText = "volume_off";
        }
    };

    document.getElementById("markRead").onclick = function() {
      if(msg==="0")return;
      markRead();
    }

    messagesTab = null;

    user = localStorage.getItem("username");
    notifications = function() {return Number(localStorage.getItem("notifications"));};
    audio = function() {return Number(localStorage.getItem("sound"));};

    setInterval(function(){checkMessages(false)},3000);
    checkMessages(true);

} // End notifier

function checkMessages(firstime) {
  var apireq = new XMLHttpRequest();
  apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + user + '/messages/count?' + Math.floor(Date.now()), true);
  apireq.send();
  apireq.onreadystatechange = function() {
      if (apireq.readyState === 4 && apireq.status === 200) {
          msg = String(JSON.parse(apireq.responseText).count);

          if(msg===document.getElementById("msgNum").innerText) return;

          setFavicon();

          if(msg>document.getElementById("msgNum").innerText && firstime===false) notify();

          if(msg==="0" && document.getElementById("msgNum").innerText!=="0") {
            document.getElementById("markRead").style.cursor = "not-allowed";
            document.getElementById("markRead").children[0].style.color = "gray";
            document.getElementById("msgNum").innerText = msg;
            return;
          }

          if(document.getElementById("msgNum").innerText==="0" && msg>0) {
            document.getElementById("markRead").style.cursor = "pointer";
            document.getElementById("markRead").children[0].style.color = "#25AFF4";
          }

          document.getElementById("msgNum").innerText = msg;
      }}; // Request loaded
    }

function notify() {
  var timesClicked = 0;
  var s = (msg===1?"":"s");
  if(notifications()) {
    var notification = new Notification(msg + ' new Scratch message' + s, {
        icon: './images/logo.png',
        body: "Click to read them.\nDouble click to mark the message" + s + " as read.",
    });
    notification.onclick = function() {
      timesClicked++;
      if(timesClicked===1) {
        setTimeout(function() {
          if(timesClicked!==1)return;
          notification.close();
          openMessages();
      }, 500);
    }
      if(timesClicked===2) {
        notification.close();
        markRead();
    }
    };
  } // If notifications enabled
  if(audio()) snd.play();
}

function openMessages() {
  if(messagesTab){
    messagesTab.location.replace("https://scratch.mit.edu/messages/");
    messagesTab.focus();
  } else {
  messagesTab = window.open("https://scratch.mit.edu/messages/");
  var onClose = setInterval(function() {
    if(messagesTab.closed){
       messagesTab = null;
       clearInterval(onClose);
     }
   }, 1000);
  }
}

function markRead() {
  if(messagesTab){
    messagesTab.location.replace("https://scratch.mit.edu/messages/");
  } else {
    readMsgTab = window.open("https://scratch.mit.edu/messages/", "", "width=100, height=100, top=1000000, left=1000000");
    closeTabOnClear();
  }
}

function newUser(msg,firsttime) {
  swal(msg, {
      content: "input",
  })
      .then((value) => {
        if((value===null|value==='') && firstime!==1){}else{
      var apireq = new XMLHttpRequest();
      apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + value, true);
      apireq.send();
      apireq.onreadystatechange = function() {
          if (apireq.readyState === 4) {
              if(apireq.status === 200) {
                  localStorage.setItem("username",JSON.parse(apireq.responseText).username);
                  localStorage.setItem("notifications", "1");
                  localStorage.setItem("sound", "1");
                  localStorage.setItem("userid", JSON.parse(apireq.responseText).id);
                  location.reload();
              }
              else {
                if(firsttime===1) {
                  newUser("Thanks! Now, enter your username and we're done.",1);
}
              }
          }}; // Request done
  }
}
);
}

function setFavicon() {
  if(msg==="0") {
      document.querySelector("link[rel*='icon']").href = "./images/favicon.ico";
  }
  else {
  var favicon=new Favico({
    type : 'rectangle',
  });
  favicon.badge(msg);
  }
}

function closeTabOnClear() {
  var apireq = new XMLHttpRequest();
  apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + user + '/messages/count?' + Math.floor(Date.now()), true);
  apireq.send();
  apireq.onreadystatechange = function() {
      if (apireq.readyState === 4 && apireq.status === 200) {
          var msgNum = JSON.parse(apireq.responseText).count;

          if(msgNum===0) {
            readMsgTab.close();
          } else {
            setTimeout(closeTabOnClear,100);
          }
}};
}
