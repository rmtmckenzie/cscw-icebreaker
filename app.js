


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
      this.render(q.answertype,{to:'quizrender'});
    } else {
      this.render(q.type,{to:'quizrender'});
    }
  } else {
    this.render('loading',{to:'quizrender'});
  }
}
 
function questionWrapAction(){
  var renderlist = [
    "questiontruetruefalse", //1
    "questiontruetruefalse", //2
    "questiontruetruefalse", //3
    "questiontruetruefalse", //4
    "questiontruetruefalse", //5
    "question_video", //6
    "question_video", //7
    "question_video", //8
    "questiontruetruefalse", //9
    "questiontruetruefalse", //10
  ]

  this.render();
  var qnum = Session.get("QuestionCount") || 0; //make sure it's integer

  if(renderlist[qnum]){
    this.render(renderlist[qnum],{to:'questionrender'});
  } else {
    this.redirect('home');
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

  this.route("nextprequiz",{
    path: '/nextprequiz',
    template: 'nextprequiz',
    layoutTemplate:'layout',
    action: function(){
      setTimeout(function(){
        Router.go("prequiz");
      },10);
    }
  })

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
    var usr = Meteor.user();
    if (!(usr && usr.profile.firstName && usr.profile.lastName)) {
      console.log("User not logged in or hasn't set name");
      this.render('home');
      this.stop();
    }
  }

Router.before(mustBeSignedIn, {except: ['home']});
