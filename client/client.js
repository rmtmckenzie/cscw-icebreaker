/**
* Functions for general Templates
*/


Template.home.namedUser = function () {
  var user = Meteor.user()
  return user && user.profile.firstName && user.profile.lastName;
};

Template.layout.doneprequiz = function(){
  Questions.find()
}

Template.home.events = {
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
  },
  'click button#goprequiz' : function (event) {
    //could implement this in the template
    Router.go('prequiz');
  },
  'click button#goquiz' : function (event) {
    //could implement this in the template
    Router.go('quiz');
  }
}