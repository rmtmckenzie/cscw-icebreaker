Meteor.publish("messages", function(channel_name) {
    return Messages.find({channel: channel_name});
});

Accounts.config({ restrictCreationByEmailDomain: 'uvic.ca' });

//stop client from posting unless logged in!
Messages.allow({
  insert: function(userId, message){
    console.log(message);
    if(userId)
      return true;
    return false;
  }
});


Meteor.methods({
  setUserNames: function(firstName, lastName){
    check(firstName, NonEmptyString);
    check(lastName, NonEmptyString);

    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.firstName":firstName}})
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.lastName":lastName}})
    return true;
  }
});

TTF.allow({
  insert: function(userId, data){
    check(data.true1, NonEmptyString);
    check(data.true2, NonEmptyString);
    check(data.false1, NonEmptyString);
    check(data.num, Number);
    check(data.userid, Match.Where(function(x){ return userId === x}));
    return true;
  }
});

