


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
        {
            "type" : "question_video", // 1
            "question" : "What continents have you traveled to?",
            "choices" : ['Asia', 'Australia', 'North America', 'South America']
        },
        {
            "type" : "question_mc", // 2
            "question" : "What is a common activity most people have completed that you've never done?",
            "choices" : ['Snowshoeing', 'Tennis', 'Flew in a plane', 'Canoeing', 'Maple Syrup', 'Drank coffee', 'Never had beer']
        },
        {
            "type" : "question_mc", // 3
            "question" : "What is your favourite movie?",
            "choices" : ['Silence of the Lambs', 'Top Gun', 'Frozen', 'Zoolander', 'Shrek', 'A christmas carole', 'Lord of the Rings']
        },
        {
            "type" : "question_mc", // 4
            "question" : "What is your biggest guilty pleasure",
            "choices" : ['Chocolate Chips', 'Ke$ha', 'Brushing my teeth', 'Cold winter days', 'Fresh Prince']
        },
        {
            "type" : "questiontruetruefalse", // 5
            "question" : "Name 2 special skills or hobbies that no one knows you have."
        },
        {
            "type" : "question_video", // 6
            "question" : "What is your dream job?",
            "choices" : ["Firefighting pilot", "Prime Minister of Canada", "Priest", "Optometrist", "Surgeon", "Pro Skiier", "Hockey Player"]
        },
        {
            "type" : "questiontruetruefalse", // 6
            "question" : "One day, I would like to..."
        },
        {
            "type" : "question_mc", // 7
            "question" : "If you were a superhero, what would your power be?",
            "choices" : ["Invisibility", "Teleportation", "Regeneration", "Elements", "Telepathy", "Additional limbs", "cyclone spinning"]
        }
  ];

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
