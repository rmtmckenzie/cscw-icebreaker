Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'layout'
  });

  this.route('ttf', {
    path: '/truetruefalse',
    template:'truetruefalse',
    layoutTemplate: 'layout'
  });
});

function mustBeSignedIn(){
  return !!Meteor.user();
}

Router.before(mustBeSignedIn, {except: ['home']});
