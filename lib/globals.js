/**
* Models
*/
TTF = new Meteor.Collection('ttf');


/**
* Helper functions
*/
NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
