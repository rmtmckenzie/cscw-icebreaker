Meteor.publish("messages", function(channel_name) {
    return Messages.find({channel: channel_name});
});

Accounts.config({ restrictCreationByEmailDomain: 'uvic.ca' });

//stop client from posting unless logged in!
Messages.allow({
  insert: function(userId, message){
    //console.log(Meteor.user());
    if(userId)
      return true;
    return false;
  }
});


