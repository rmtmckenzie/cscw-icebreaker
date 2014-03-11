/**
* Templates
*/
Meteor.subscribe("messages")

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }}).fetch();
}


Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var user = Meteor.user()      
      if (user)
        if(user.profile)
          var name = user.profile;
        else if(user.emails && user.emails.length)
          var name = user.emails[0].address;
      else
        var name = 'Anonymous';
      var message = document.getElementById('message');

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
  }
}
