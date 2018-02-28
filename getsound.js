if(localStorage.getItem("sfx")=== null) snd = new Audio("./sfx/Snapchat.wav");
else snd = new Audio("./sfx/" + localStorage.getItem("sfx") + ".wav");

testSnd = new Audio("./sfx/silence.wav");
sndCouldLoad = false;

testSnd.oncanplaythrough = function() {
  sndCouldLoad = true;
}
