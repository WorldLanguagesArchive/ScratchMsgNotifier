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
    notifClose = localStorage.getItem("notifTimeClose")==="0"?Infinity:localStorage.getItem("notifTimeClose")*1000;
    notifications = function() {return Number(localStorage.getItem("notifications"));};
    audio = function() {return Number(localStorage.getItem("sound"));};

    setInterval(function(){checkMessages(false)},3000);
    checkMessages(true);

} // End notifier

function checkMessages(firsttime) {
  var apireq = new XMLHttpRequest();
  apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + user + '/messages/count?' + Math.floor(Date.now()), true);
  apireq.send();
  apireq.onreadystatechange = function() {
      if (apireq.readyState === 4 && apireq.status === 200) {
          msg = String(JSON.parse(apireq.responseText).count);

          if(msg===document.getElementById("msgNum").innerText) return;

          setFavicon();

          if(msg>document.getElementById("msgNum").innerText && firsttime===false && msg!=="1") notify();

          if(msg==="1" && document.getElementById("msgNum").innerText==="0" && firsttime===false) {
            if(!notifications() && audio()){snd.play();return;}
            if(!notifications()) return;
            var apireq2 = new XMLHttpRequest();
            apireq2.open( "GET", 'https://cors-anywhere.herokuapp.com/https://scratch.mit.edu/site-api/comments/user/'+user+'/?' + Math.floor(Date.now()), true);
            apireq2.send();
            apireq2.onreadystatechange = function() {
              if (apireq2.readyState === 4 && apireq2.status === 200) {
                var commentsNewHTML = apireq2.responseText.replace(/\s/g, '');
                if(commentsOldHTML !== commentsNewHTML) {
                  document.getElementById("parseComments").innerHTML = apireq2.responseText.replace(/src/g, "asdf");
                  var commentsNew = [];
                var checkDiff = true;
                for (i = 0; i < commentsOld.length; i++) {
                  commentsNew.push(document.getElementsByClassName("comment ")[i].getAttribute("data-comment-id"));
                    if(commentsOld[i]!==commentsNew[i] && checkDiff) {
                    var commentAgo = ((new Date().getTime()) - new Date(document.getElementsByClassName("comment ")[i].getElementsByClassName("time")[0].getAttribute("title")).getTime())/1000;
                    var commentAuthor = document.getElementsByClassName("comment ")[i].getElementsByTagName("a")[0].getAttribute("data-comment-user");
                    var commentContent = document.getElementsByClassName("content")[i].innerText.replace(/\s\s+/g, ' ').replace(/^ +/gm, '').substring(0,document.getElementsByClassName("content")[i].innerText.replace(/\s\s+/g, ' ').replace(/^ +/gm, '').length-1)
                    var commentID = document.getElementsByClassName("comment ")[i].getAttribute("data-comment-id");
                    if(commentAgo<100 && commentAuthor!==user){
                      notifyComment(commentAuthor,commentContent, commentID);
                      checkDiff = false;
                    }
                  } // If there's a new comment
                  if(i===document.getElementsByClassName("comment ").length-1) {
                    commentsOldHTML = commentsNewHTML;
                    commentsOld = commentsNew;
                  }
                }
              } // If there is a change in the HTML
              else { // If there isn't
                notify();
              }
              }}
            }

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

      if(firsttime){
        var apireq = new XMLHttpRequest();
        apireq.open( "GET", 'https://cors-anywhere.herokuapp.com/https://scratch.mit.edu/site-api/comments/user/'+user+'/?' + Math.floor(Date.now()), true);
        apireq.send();
        apireq.onreadystatechange = function() {
          if (apireq.readyState === 4 && apireq.status === 200) {
            commentsOldHTML = apireq.responseText.replace(/\s/g, '')
            commentsOld = [];
            document.getElementById("parseComments").innerHTML = apireq.responseText.replace(/src/g, "asdf");
            for (i = 0; i < document.getElementsByClassName("comment ").length; i++) {
              commentsOld.push(document.getElementsByClassName("comment ")[i].getAttribute("data-comment-id"));
            }
          }}
        }
}

function notify(title,body,link) {
  var s = (msg==="0"?"":"s");
  var timesClicked = 0;
  var notification = new Notification(msg + ' new Scratch message' + s, {
        icon: './images/logo.png',
        body: "Click to read " + (msg===1?"it":"them") + ".\nDouble click to mark the message" + s + " as read.",
    });
    setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
      if(audio()) snd.play();
    }
    notification.onclick = function() {
      timesClicked++;
      if(timesClicked===1) {
        setTimeout(function() {
          if(timesClicked!==1)return;
          notification.close();
          openLink("https://scratch.mit.edu/messages/");
      }, 500);
    }
      if(timesClicked===2) {
        notification.close();
        markRead();
    }
    };
}

function notifyComment(author,content,Id) {
  var timesClicked = 0;
  var notifTitle = String(author) + " commented"
  var notification = new Notification(notifTitle, {
        icon: './images/logo.png',
        body: content,
          });
    setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
      if(audio()) snd.play();
    }
    notification.onclick = function() {
      timesClicked++;
      if(timesClicked===1) {
        setTimeout(function() {
          if(timesClicked!==1)return;
          notification.close();
          openLink("https://scratch.mit.edu/messages");
          closeTabOnClear(function(){messagesTab.location.replace("https://scratch.mit.edu/users/"+user+"/#comments-"+Id)});
      }, 500);
    }
      if(timesClicked===2) {
        notification.close();
        markRead();
    }
    };
}

function openLink(url) {
  if(messagesTab){
    messagesTab.location.replace(url);
    messagesTab.focus();
  } else {
  messagesTab = window.open(url);
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
    closeTabOnClear(function(){readMsgTab.close();});
  }
}

function newUser(msg,firsttime) {
  swal(msg, {
      content: "input",
  })
      .then((value) => {
        if((value===null|value==='') && firsttime!==1){}else{
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

function closeTabOnClear(ondone) {
  var apireq = new XMLHttpRequest();
  apireq.open( "GET", 'https://api.scratch.mit.edu/users/' + user + '/messages/count?' + Math.floor(Date.now()), true);
  apireq.send();
  apireq.onreadystatechange = function() {
      if (apireq.readyState === 4 && apireq.status === 200) {
          var msgNum = JSON.parse(apireq.responseText).count;

          if(msgNum===0) {
            ondone();
          } else {
            setTimeout(function(){closeTabOnClear(ondone)},100);
          }
}};
}
