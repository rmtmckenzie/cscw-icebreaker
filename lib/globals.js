/**
* Models
*/
Questions = new Meteor.Collection('questions');
Answers = new Meteor.Collection('answers');

/**
* Helper functions
*/
NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
