


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
            "choices" : ['Asia', 'Australia', 'North America', 'South America', 'Antartica', 'Europe','Africa']
        },
        {
            "type" : "question_mc", // 2
            "question" : "What is a common activity most people have completed that you've never done?",
            "choices" : ['Snowshoeing', 'Tennis', 'Flew in a plane', 'Canoeing', 'Maple Syrup', 'Drank coffee', 'Never had beer', 'Ice Skating', 'Smoked a Cigarette', 'Owned a Dog', 'I\'ve done everything!']
        },
        {
            "type" : "question_mc", // 3
            "question" : "What is your favourite movie?",
            "choices" : ['Silence of the Lambs', 'Top Gun', 'Frozen', 'Zoolander', 'Shrek', 'A christmas carole', 'Lord of the Rings'],
            "self_defn": true
        },
        {
            "type" : "question_mc", // 4
            "question" : "What is your biggest guilty pleasure",
            "choices" : ['Chocolate Chips', 'Ke$ha', 'Brushing my teeth', 'Cold winter days', 'Fresh Prince'],
            "self_defn": true
        },
        {
            "type" : "question_ttf", // 5
            "question" : "Name 2 special skills or hobbies that no one knows you have."
        },
        {
            "type" : "question_video", // 6
            "question" : "What is your dream job?",
            "choices" : ["Firefighting pilot", "Prime Minister of Canada", "Priest", "Optometrist", "Surgeon", "Pro Skiier", "Hockey Player"],
            "self_defn": true
        },
        {
            "type" : "question_ttf", // 6
            "question" : "One day, I would like to..."
        },
        {
            "type" : "question_mc", // 7
            "question" : "If you were a superhero, what would your power be?",
            "choices" : ["Invisibility", "Teleportation", "Regeneration", "Elements", "Telepathy", "Additional limbs", "cyclone spinning"],
            "self_defn": true
        }
  ];

  this.render();
  var qnum = Session.get("QuestionCount") || 0; //make sure it's integer

  Session.set("Question", renderlist[qnum]);

  if(renderlist[qnum]){
    this.render(renderlist[qnum].type,{to:'questionrender'});
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



  /*this.route('ttfanswer',{
    path: '/truetruefalseanswered',
    template: 'resulttruetrueffalse',
    layoutTemplate: 'layout'
  });
*/

  this.route('postquestion_video',{
    path: '/question/video/postquestion',
    template: 'postquestion_video',
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

Router.before(mustBeSignedIn, {except: ['home','testing']});
