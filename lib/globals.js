/**
* Models
*/
Questions = new Meteor.Collection('questions');

/**
* Helper functions
*/
NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
