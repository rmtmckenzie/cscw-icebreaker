/**
* Templates
*/
Meteor.subscribe("messages")

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }}).fetch();
}

var submitmessage = function() {
  var user = Meteor.user()      
  if (user){
    if(user.profile)
      var name = user.profile;
    else if(user.emails && user.emails.length)
      var name = user.emails[0].address;
  } else {
      var name = 'Anonymous';
  }
  var message = document.getElementById('chatmessage');

  if (message.value != '') {
    Messages.insert({
      name: name,
      message: message.value,
      time: Date.now()
    });

    document.getElementById('message').value = '';
    message.value = '';
  }
}

Template.input.events = {
  'keydown input#chatmessage' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      submitmessage();
    }
  },
  'click button#chatsend' : function(event) {
    submitmessage();
  }
}

Template.home.events = {
  'click button#go' : function (event) {
    if(Meteor.user()){
      Router.go('ttf');
    } else {
      alert("You must be logged into access this!\n//todo make this a BS modal");
    }
  }
}
