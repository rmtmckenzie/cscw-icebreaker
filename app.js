


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
  var count = Session.get("AnswerCount");
  if(count >= 20){
    this.redirect('home');
    return;
  }

  this.render();
  var q = Session.get('QuestionData');
  if(q){
    if(q.answered){
        this.render(q.type + '_answer',{to:'quizrender'});
    } else {
        this.render(q.type + '_response',{to:'quizrender'});
    }
  } else {
    this.render('loading',{to:'quizrender'});
  }
}

function questionWrapAction(){
  var renderlist = [
        {
            "type" : "video", // 1
            "question" : "Which continent have you last travelled to (pick North America if you haven't been anywhere else).",
            "choices" : ['Asia', 'Australia', 'North America', 'South America', 'Antartica', 'Europe','Africa']
        },
        {
            "type" : "multiple_choice", // 2
            "question" : "What is a common activity most people have completed that you've never done?",
            "choices" : ['Snowshoeing', 'Tennis', 'Flew in a plane', 'Canoeing', 'Maple Syrup', 'Drank coffee', 'Never had beer', 'Ice Skating', 'Smoked a Cigarette', 'Owned a Dog', 'I\'ve done everything!']
        },
        {
            "type" : "multiple_choice", // 3
            "question" : "What is your favourite movie?",
            "choices" : ['Silence of the Lambs', 'Top Gun', 'Frozen', 'Zoolander', 'Shrek', 'A Christmas Carol', 'Lord of the Rings'],
            "self_defn": true
        },
        {
            "type" : "multiple_choice", // 4
            "question" : "What is your biggest guilty pleasure",
            "choices" : ['Chocolate Chips', 'Ke$ha', 'Brushing my teeth', 'Cold winter days', 'Fresh Prince'],
            "self_defn": true
        },
        {
            "type" : "ttf", // 5
            "question" : "Name 2 special skills or hobbies that people wouldn't guess that you have."
        },
        {
            "type" : "video", // 6
            "question" : "What is your dream job?",
            "choices" : ["Firefighting pilot", "Prime Minister of Canada", "Priest", "Optometrist", "Surgeon", "Pro Skiier", "Hockey Player"],
            "self_defn": true
        },
        {
            "type" : "ttf", // 6
            "question" : "One day, I would like to..."
        },
        {
            "type" : "multiple_choice", // 7
            "question" : "If you were a superhero, what would your power be?",
            "choices" : ["Invisibility", "Teleportation", "Regeneration", "Elements", "Telepathy", "Additional limbs", "cyclone spinning"],
            "self_defn": true
        }
  ];

  this.render();
  var qnum = Session.get("QuestionCount") || 0; //make sure it's integer

  Session.set("Question", renderlist[qnum]);

  if(renderlist[qnum]){
    this.render(renderlist[qnum].type + "_question",{to:'questionrender'});
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

  this.route('video_result',{
    path: '/video/result',
    template: 'video_result',
    layoutTemplate: 'layout'
  });

  this.route('video_postquestion',{
    path: '/question/video/postquestion',
    template: 'video_postquestion',
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

Router.before(mustBeSignedIn, {except: ['home','video']});
