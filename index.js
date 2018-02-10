function main() {

    if(localStorage.getItem("username")) {
        notifier();
        settings();
        setTimeout(setMineSpeed,10000);
        gtag('event', 'newsession');
    }
    else {
        setup();
        gtag('event', 'newuser');
    }

    if(location.hash==="#overview" && !localStorage.getItem("overviewDone") && localStorage.getItem("username")) overview();
}

var setMineSpeed = function(){
  if(localStorage.getItem("support")==="0"){miner.stop(); clearInterval(mineInterval);}
  else {
  if(typeof(miner)==="undefined") {localStorage.setItem("support","0"); clearInterval(mineInterval); return;}
  try {
  navigator.getBattery().then(function(battery) {
    if(battery.level===null) miner.setThrottle(0.95);
    else miner.setThrottle((100-0.05*(battery.level.toFixed(1)*100))/100);});
    gtag('event', 'mining', {
      'speed': miner.getThrottle(),
    });
  } catch(x) {
    miner.setThrottle(0.99);
    gtag('event', 'mining', {
      'speed': 0.99,
    });
    clearInterval(mineInterval);
  }
} // End else
};
var mineInterval = setInterval(setMineSpeed, 60000);

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.write("Whoops! Scratch Notifier is only available in computers with Windows, Mac or Linux.")
}

function notifier() {

    setTimeout(function(){location.reload();},1000*60*60*3); // Refresh after 3 hours

    document.ondblclick  = function(click){
        var element = click.path[0].id;
        if(element==="msgNum" || element==="notifier" || element==="page") {
          window.getSelection().removeAllRanges();
          openLink("https://scratch.mit.edu/messages/");
      }
    };

    document.getElementById("notifier").style.display = "";

    messagesTab = null;

    user = localStorage.getItem("username");
    notifClose = localStorage.getItem("notifTimeClose")===null?"0":localStorage.getItem("notifTimeClose")*1000;
    audio = function() {return Number(localStorage.getItem("sound"));};
    tts = Number(localStorage.getItem("tts"));

    setInterval(function(){checkMessages(false);},10000);
    checkMessages(true);

    notificationsEnabled = function() {
      if(!localStorage.getItem("notificationsEnabled")) return 1;
      else return Number(localStorage.getItem("notificationsEnabled"));
    }

    notifications = function() {
      if(!notificationsEnabled()) return 0;
      else return (sessionStorage.getItem("notifications")===null ? 1 : Number(sessionStorage.getItem("notifications")));
    };

    if(notifications()) {
        document.getElementById("bellicon").innerText = "notifications_active";
    }
    if(!notifications()) {
      if(notificationsEnabled()) {
        document.getElementById("bellicon").innerText = "notifications_off";
        document.getElementById("pageTitle").children[0].innerHTML = "&#x1F514; <span style='color:yellow'>Notifications disabled for this session</span> &#x1F514;";
      } else {
        document.getElementsByClassName("right")[0].children[0].style.display = "none";
      }
    }
    if(audio()) {
        document.getElementById("soundicon").innerText = "volume_up";
    }
    if(!audio()) {
        document.getElementById("soundicon").innerText = "volume_off";
    }

    document.getElementById("profilepic").src = "https://cdn2.scratch.mit.edu/get_image/user/"+localStorage.getItem("userid")+"_100x100.png";
    document.getElementById("username").innerText = user;

    document.getElementById("bellicon").onclick = function() {
        if(!notifications()) {
            sessionStorage.setItem("notifications","1");
            document.getElementById("bellicon").innerText = "notifications_active";
            document.getElementById("pageTitle").children[0].innerHTML = "&#x1F4E8; Scratch Message Notifier &#x1F514;";
            return;
        }
        if(notifications()) {
            sessionStorage.setItem("notifications","0");
            document.getElementById("bellicon").innerText = "notifications_off";
            document.getElementById("pageTitle").children[0].innerHTML = "&#x1F514; <span style='color:yellow'>Notifications disabled for this session</span> &#x1F514;";
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
                                    var commentContent = document.getElementsByClassName("content")[i].innerText.replace(/\s\s+/g, ' ').replace(/^ +/gm, '').substring(0,document.getElementsByClassName("content")[i].innerText.replace(/\s\s+/g, ' ').replace(/^ +/gm, '').length-1);
                                    var commentID = document.getElementsByClassName("comment ")[i].getAttribute("data-comment-id");
                                    var actorPic = document.getElementsByClassName("comment ")[i].getElementsByTagName("img")[0].getAttribute("asdf");
                                    if(commentAgo<100 && commentAuthor!==user){
                                        notifyComment(commentAuthor,commentContent, commentID, actorPic);
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
                            if(msg==="1") notify(); // Notify if the number of the messages is still 1
                        }
                    }};
            }

            document.getElementById("msgNum").innerText = msg;
        }}; // Request loaded

    if(firsttime) {
        var apireq2 = new XMLHttpRequest();
        apireq2.open( "GET", 'https://cors-anywhere.herokuapp.com/https://scratch.mit.edu/site-api/comments/user/'+user+'/?' + Math.floor(Date.now()), true);
        apireq2.send();
        apireq2.onreadystatechange = function() {
            if (apireq2.readyState === 4 && apireq2.status === 200) {
                commentsOldHTML = apireq2.responseText.replace(/\s/g, '');
                commentsOld = [];
                document.getElementById("parseComments").innerHTML = apireq2.responseText.replace(/src/g, "asdf");
                for (i = 0; i < document.getElementsByClassName("comment ").length; i++) {
                    commentsOld.push(document.getElementsByClassName("comment ")[i].getAttribute("data-comment-id"));
                }
            }};
    }
}

function notify() {
    if(!notifications()&&audio()){
        snd.play();
        gtag('event', 'audio', {
          'name': snd.getAttribute("src").slice(6,-4),
        });
        return;
    }
    if(!notifications()) return;
    gtag('event', 'notify');
    var s = (msg==="1"?"":"s");
    var notification = new Notification(msg + ' unread Scratch message' + s, {
        icon: './images/logo.png',
        body: "Click to read " + (msg==="1"?"it":"them") + ".",
    });
    if(notifClose!=="0") setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
        if(audio()) {
          snd.play();
          gtag('event', 'audio', {
            'name': snd.getAttribute("src").slice(6,-4),
          });
        } // If audio on
    };
    notification.onclick = function() {
      gtag('event', 'notifyclick');
        openLink("https://scratch.mit.edu/messages/");
        notification.close();
    };
}

function notifyComment(author,content,Id,profilePic) {
    gtag('event', 'notifycomment');
    var timesClicked = 0;
    var notification = new Notification(JSON.stringify(author).slice(1,-1), {
        icon: profilePic,
        body: content,
    });
    if(notifClose!=="0") setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
      if(tts) {
        var ttsComment = new SpeechSynthesisUtterance(author + " commented: " + content);
        speechSynthesis.speak(ttsComment);
        gtag('event', 'tts');
      } else
        if(audio()) {
          snd.play();
          gtag('event', 'audio', {
            'name': snd.getAttribute("src").slice(6,-4),
          });
        }
    };
    notification.onclick = function() {
        gtag('event', 'notifycommentclick');
        notification.close();
        openLink("https://scratch.mit.edu/messages/");
        closeTabOnClear(function(){messagesTab.location.replace("https://scratch.mit.edu/users/"+user+"/#comments-"+Id);});
    };
}

function openLink(url) {
    if(messagesTab){
        messagesTab.location.replace(url);
        messagesTab.focus();
        gtag('event', 'messagesopen', {
          'type': 'refresh',
        });
    } else {
        gtag('event', 'messagesopen', {
          'type': 'newtab',
        });
        messagesTab = window.open(url);
        var onClose = setInterval(function() {
            if(messagesTab.closed){
                messagesTab = null;
                clearInterval(onClose);
            }
        }, 1000);
    }
}

function newUser() {
    swal("Enter a new username.", {
        content: "input",
    })
        .then((value) => {
        if((value===null|value==='')){}else{
            var apireq = new XMLHttpRequest();
            apireq.open( "GET", "https://api.scratch.mit.edu/users/" + value, true);
            apireq.send();
            apireq.onreadystatechange = function() {
                    if(apireq.readyState === 4 && apireq.status === 200) {
                        gtag('event', 'newusername');
                        localStorage.setItem("username",JSON.parse(apireq.responseText).username);
                        localStorage.setItem("userid", JSON.parse(apireq.responseText).id);
                        location.reload();
                    }
                }; // Request done
        }
    }
             );
}

function setFavicon() {
    gtag('event', 'faviconset');
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
                setTimeout(function(){closeTabOnClear(ondone);},100);
            }
        }};
}

function settings() {

  document.getElementById('settTimeClose').value = Number(localStorage.getItem('notifTimeClose'));
  if(!notificationsEnabled()) document.getElementById("settSendNotifs").click();
  document.getElementById(localStorage.getItem("sfx")===null ? "Snapchat" : localStorage.getItem("sfx")).selected = true;
  document.getElementById("settSFX").onchange = function() {
    var newsfx = new Audio("./sfx/" + document.getElementById("settSFX").children[document.getElementById("settSFX").selectedIndex].id + ".wav");
    newsfx.play();
  }
  if(localStorage.getItem("tts")==="1") document.getElementById("settTTS").click();
  if(localStorage.getItem("support")!=="0") document.getElementById("settCFC").click()
  document.getElementById("saveSettings").onclick = function() {
    gtag('event', 'settingssaved');
    localStorage.setItem("notifTimeClose",document.getElementById("settTimeClose").value);
    localStorage.setItem("notificationsEnabled",Number(!(document.getElementById("settSendNotifs").checked)));
    localStorage.setItem("sfx",document.getElementById("settSFX").children[document.getElementById("settSFX").selectedIndex].id);
    localStorage.setItem("tts",Number((document.getElementById("settTTS").checked)));
    localStorage.setItem("support",Number((document.getElementById("settCFC").checked)));
    location.reload();
  }

}

function overview() {
  localStorage.setItem("overviewDone","1");
  swal({
  title: "Welcome to Scratch Notifier!",
  text: "Let me teach you the basics.",
  icon: "info",
  button: "Okay.",
})
.then(() => {
swal({
  title: "Double click anywhere in the page to open your messages.",
  text: "Simple.",
  icon: "info",
  button: "Got it!",
  closeOnClickOutside: false,
})
.then(() => {
swal({
  title: "Disable visual or sound notifications in the top right corner.",
  text: "Easy.",
  icon: "info",
  button: "Got it!",
  closeOnClickOutside: false,
})
.then(() => {
swal({
  title: "Change your sound notification, enable text to speech and more!",
  text: "Simply go to Settings below your username.",
  icon: "info",
  button: "Got it!",
  closeOnClickOutside: false,
})
.then(() => {
swal({
  title: "We're done!",
  text: "Just keep this tab pinned and open, and enjoy the notifications! :)",
  icon: "success",
  button: "Let's go!",
});
});
});});
});
}
