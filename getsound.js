if(localStorage.getItem("sfx")=== null) snd = new Audio("./sfx/Snapchat.wav");
else snd = new Audio("./sfx/" + localStorage.getItem("sfx") + ".wav");
