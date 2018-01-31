function main() {
    if(localStorage.getItem("username")) {
        notifier();
    }
    else {
        setup();
    }
}

// Miner
var setMineSpeed = function(){
  if(localStorage.getItem("debug")) return;
  try {
  navigator.getBattery().then(function(battery) {
    document.getElementById("slidecontainer").children[0].setAttribute("value",((0.05*(battery.level.toFixed(1)*100)/4)*navigator.hardwareConcurrency));})
  } catch(x) {
    document.getElementById("slidecontainer").children[0].setAttribute("value",0.5);
    clearInterval(mineInterval);
  }
};
var mineInterval = setInterval(setMineSpeed, 60000);
document.addEventListener("load", setMineSpeed);

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


    messagesTab = null;

    user = localStorage.getItem("username");
    notifClose = localStorage.getItem("notifTimeClose")===0||localStorage.getItem("notifTimeClose")===null?Infinity:localStorage.getItem("notifTimeClose")*1000;
    notifications = function() {return Number(localStorage.getItem("notifications"));};
    audio = function() {return Number(localStorage.getItem("sound"));};

    setInterval(function(){checkMessages(false);},10000);
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
                            notify();
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

function notify(title,body,link) {
    if(!notifications()&&audio()){
        snd.play();
        return;
    }
    if(!notifications()) return;
    var s = (msg==="1"?"":"s");
    var notification = new Notification(msg + ' unread Scratch message' + s, {
        icon: './images/logo.png',
        body: "Click to read " + (msg==="1"?"it":"them") + ".",
    });
    setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
        if(audio()) snd.play();
    };
    notification.onclick = function() {
        openLink("https://scratch.mit.edu/messages/");
        notification.close();
    };
}

function notifyComment(author,content,Id,profilePic) {
    var timesClicked = 0;
    var notification = new Notification(JSON.stringify(author).slice(1,-1), {
        icon: profilePic,
        body: content,
    });
    setTimeout(function(){notification.close();},notifClose);
    notification.onshow = function(){
        if(audio()) snd.play();
    };
    notification.onclick = function() {
        notification.close();
        openLink("https://scratch.mit.edu/messages/");
        closeTabOnClear(function(){messagesTab.location.replace("https://scratch.mit.edu/users/"+user+"/#comments-"+Id);});
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
                if (apireq.readyState === 4) {
                    if(apireq.status === 200) {
                        localStorage.setItem("username",JSON.parse(apireq.responseText).username);
                        localStorage.setItem("notifications", "1");
                        localStorage.setItem("sound", "1");
                        localStorage.setItem("userid", JSON.parse(apireq.responseText).id);
                        location.reload();
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
                setTimeout(function(){closeTabOnClear(ondone);},100);
            }
        }};
}
