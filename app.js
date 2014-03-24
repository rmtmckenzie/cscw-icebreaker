Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'layout'
  });

  this.route('ttf', {
    path: '/truetruefalse',
    template:'infotruetruefalse',
    layoutTemplate: 'layout'
  });

  this.route('ttfquestion',{
    path: '/truetruefalsequestion',
    template:'quiztruetruefalse',
    layoutTemplate: 'layout'
  });

  this.route('ttfanswer',{
    path: '/truetruefalseanswered',
    template: 'resultttf',
    layoutTemplate: 'layout'
  });
 
  this.route('webcam',{
    path: '/webcam',
    template: 'webcam'
  });
});

var mustBeSignedIn = function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      this.render('home');
      this.stop(); 
    }
  }

Router.before(mustBeSignedIn, {except: ['home']});

function mustBeSignedIn(){
  return !!Meteor.user();
}

Router.before(mustBeSignedIn, {except: ['home']});
