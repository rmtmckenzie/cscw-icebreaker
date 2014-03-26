


function quizWrapBefore(){
  if(Session.get("QuestionData"))return;

  Meteor.call('getRandomQuestion',function(err,data){
    //TODO actually handle all the errors...
    if(err){
      console.log(err);
    } else if(data){
      Session.set("QuestionData",data);
    } else {
      console.log("What the heck?");
    }
  });
}


function quizWrapAction(){
  this.render();
  var q = Session.get('QuestionData');
  if(q){
    if(q.answertype){
      this.render(q.answertype,'quizrender');
    } else {
      this.render(q.type,'quizrender');
    }
  } else {
    this.render('loading','quizrender');
  }
}


function questionWrapAction(){
  this.render();
  var qnum = Session.get("questionCount") || 0; //make sure it's integer

  if(qnum < 5){
    //0-4 TTF
    this.render('questiontruetruefalse');
  } else if(qnum < 6){
    //5 - video?
    this.render('question_video');
  } else if (qnum < 7){
    //6 - ??
    //todo change this and rest!
    this.render('questiontruetruefalse');
  } else if (qnum < 10){
    // to 9 - ??
    this.render('questiontruetruefalse');
  } else {
    //send user back to home!
    Router.go('home');
  }
}

Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'home',
    layoutTemplate: 'layout'
  });

  this.route('quiz', {
    path: '/quiz',
    template: 'quizwrapper',
    layoutTemplate:'layout',
    before: quizWrapBefore,
    action: quizWrapAction
  });

  this.route('prequiz',{
    path: '/prequiz',
    template: 'questionwrapper',
    layoutTemplate:'layout',
    action: questionWrapAction
  });

  this.route('ttf', {
    path: '/asktruetruefalse',
    template:'infotruetruefalse',
    layoutTemplate: 'layout'
  });

  this.route('ttfquestion',{
    path: '/truetruefalse',
    template:'truetruefalse',
    layoutTemplate: 'layout'
  });

  this.route('ttfanswer',{
    path: '/truetruefalseanswered',
    template: 'resulttruetrueffalse',
    layoutTemplate: 'layout'
  });

  this.route('question_video',{
    path: '/question/video',
    template: 'question_video',
    layoutTemplate: 'layout'
  });

  this.route('answer_video',{
    path: '/question/video/answer',
    template: 'answer_video',
    layoutTemplate: 'layout'
  });
});

var mustBeSignedIn = function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      console.log("User not logged in");
      this.render('home');
      this.stop();
    }
  }

Router.before(mustBeSignedIn, {except: ['home']});
