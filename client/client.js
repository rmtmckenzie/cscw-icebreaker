/**
* Templates
*/

//Accounts.ui.config({ passwordSignupFields: 'USERNAME_AND_EMAIL' });

var checkNamedUser = function () {
  var user = Meteor.user()
  return user && user.profile.firstName && user.profile.lastName;
}

Template.home.namedUser = checkNamedUser;

Template.home.events = {
  'click button#go' : function (event) {
    if(Meteor.user()){
      Router.go('quiz');
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
