
function setup() {
    Notification.requestPermission();
    swal('Welcome! To start using the notifier, please allow us to send you notifications by clicking "Allow" in the top left and then clicking "Done" here below.', {
        buttons: {
            catch: {
                text: "Done",
                value: "done",
            },
        },
        closeOnClickOutside: false,
    })
        .then((value) => {
        //if(Notification.permission==="granted") {
        if(1===1) {
            enterUsername();
        }
        else {setup();}
    }
             );
}

function enterUsername() {
    swal("We're almost done! Now, enter your username.", {
        content: "input",
        closeOnClickOutside: false,
    })
        .then((value) => {
        if((value===null|value==='')){
            swal("Whoops!", "You have not entered your username. Press OK and try again. ", "error", {
              closeOnClickOutside: false
            })
            .then(() => {enterUsername();});
        }
        else {
            if(value.substring(0,1)==="@") value = value.substring(1,value.length);
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
                        pinTab();
                    } else {
                        swal("Whoops!", "The username you entered doesn't exist. Press OK and try again. ", "error", {
                          closeOnClickOutside: false
                        })
                        .then(() => {enterUsername();});
                    }
                }}; // Request done
        }
    }
             );
}

function pinTab(){
  swal("To finish, because you'll have to keep the notifier open all the time, you should pin this tab by right clicking and choosing \"Pin tab\". This will ensure the notifier will work properly and give you a better experience. You can unpin it in the future.",{
  content: {
    element: "img",
    attributes: {
      src: "./images/pintab.gif",
	  style: "height:35vh;",
    },
  },
  closeOnClickOutside: false,
})
.then(() => {window.location="./#overview";location.reload();});
}
