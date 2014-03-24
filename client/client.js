/**
* Templates
*/
Meteor.subscribe("messages")

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }}).fetch();
}

var submitmessage = function() {
  var user = Meteor.user()      
  if (user && user.profile && user.profile.firstName )
      var name = user.profile.firstName + ' ' + user.profile.lastName;
  else {
    return; //TODO error??
  }
  var message = document.getElementById('chatmessage');

  if (message.value != '') {
    Messages.insert({
      name: name,
      message: message.value,
      time: Date.now()
    });

    message.value = '';
  }
}

Template.chatinput.events = {
  'keydown input#chatmessage' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      submitmessage();
    }
  },
  'click button#chatsend' : function(event) {
    submitmessage();
  }
}

//Accounts.ui.config({ passwordSignupFields: 'USERNAME_AND_EMAIL' });

var checkNamedUser = function () {
  var user = Meteor.user()
  return user && user.profile.firstName && user.profile.lastName;
}

Template.home.namedUser = checkNamedUser;
Template.chatinput.namedUser = checkNamedUser;

Template.home.events = {
  'click button#go' : function (event) {
    if(Meteor.user()){
      Router.go('ttfquestion');
    } else {
      alert("You must be logged in to access this!\n//todo make this a BS modal");
    }
  },
  'click button#submitnames': function (event, template) {
    event.preventDefault();
    var firstNameBox = template.find('#firstNameEntry'),
        lastNameBox = template.find('#lastNameEntry');
    if(!firstNameBox.value){
      $(firstNameBox).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }
    if(!lastNameBox.value){
      $(lastNameBox).parent().addClass('has-error').one('keydown',function (event) {
        $(this).removeClass('has-error');
      });
    }
    if(firstNameBox.value && lastNameBox.value){
      if(!Meteor.call('setUserNames',firstNameBox.value,lastNameBox.value)){
        //console.log("Error!"); //TODO handle this as part of function(err,data)
      }
    }
  }
}
