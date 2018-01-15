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

    document.getElementById("profilepic").src = "https://cdn2.scratch.mit.edu/get_image/user/"+localStorage.getItem("userid")+"_30x30.png";
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
      if(msg===0)return;
      messagestab = window.open("https://scratch.mit.edu/messages/", "", "width=1, height=1")
      closeTabOnClear();
    }

    user = localStorage.getItem("username");

    setInterval(function(){
        var apireq = new XMLHttpRequest();
        apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + user + '/messages/count?' + Math.floor(Date.now() / 1000), true);
        apireq.send();
        apireq.onreadystatechange = function() {
            if (apireq.readyState === 4 && apireq.status === 200) {
                msg = (parsedData = JSON.parse(apireq.responseText).count);

                if(document.getElementById("msgNum").innerText==="...") {
                  setFavicon();
                  if(msg>0) {
                    document.getElementById("markRead").style.cursor = "pointer";
                    document.getElementById("markRead").children[0].style.color = "#25AFF4";
                  }
                }

                if(document.getElementById("msgNum").innerText!=="..." && msg>document.getElementById("msgNum").innerText) {
                    notify();
                    setFavicon();
                    document.getElementById("markRead").style.cursor = "pointer";
                    document.getElementById("markRead").children[0].style.color = "#25AFF4";
                }

                if(msg<document.getElementById("msgNum").innerText && document.getElementById("msgNum").innerText!=="...") { // If message number went down or is zero
                  setFavicon();
                  document.getElementById("markRead").style.cursor = "not-allowed";
                  document.getElementById("markRead").children[0].style.color = "gray";
                }

                document.getElementById("msgNum").innerText = msg;
            }}; // Request loaded
    },3000);

} // End notifier

function notify() {
  var timesClicked = 0;
  if(localStorage.getItem("notifications")==="1") {
    var notification = new Notification(msg + ' new Scratch message' + (msg===1?"":"s"), {
        icon: './images/logo.png',
        body: "Click to read them.\nDouble click to mark the message" + (msg===1?"":"s") + " as read.",
    });
    notification.onclick = function() {
      timesClicked++;
      if(timesClicked===1) {
        setTimeout(function() {
          if(timesClicked===2)return;
        window.open("https://scratch.mit.edu/messages/");
        notification.close();
      }, 500);
    }
      if(timesClicked===2) {
      messagestab = window.open("https://scratch.mit.edu/messages/", "", "width=1, height=1")
      notification.close();
      closeTabOnClear();
    }
    }
  } // If notifications enabled
  if(localStorage.getItem("sound")==="1")snd.play()
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
  if(msg===0) {
      document.querySelector("link[rel='shortcut icon']").href = "./images/favicon.ico";
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
          msg = (parsedData = JSON.parse(apireq.responseText).count);

          if(msg===0) {
            messagestab.close();
          } else {
            setTimeout(closeTabOnClear,100);
          }
}};
}
