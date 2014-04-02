QuestionCount = new Meteor.Collection('QuestionCount');
AnswerCount = new Meteor.Collection('AnswerCount');

Meteor._getQuestionObj = function(type,dataobj){
  dataobj.userid = Meteor.userId();
  dataobj.type = type;
  dataobj.rand = Math.random();
  return dataobj;
}

Meteor.saveQuestion = function(type,dataobj){
  Questions.insert(Meteor._getQuestionObj(type,dataobj));
  Deps.nonreactive(function(){
    var q = Session.get("QuestionCount") || 0;
    Session.set("QuestionCount",q+1);
  });
}

Meteor.saveResponse = function(correct,dataobj){
  //adding this to meteor to make it accessible from anywhere on client...
  Answers.insert({
    correct:String(correct),
    dataobj:dataobj,
    userid_question:dataobj.userid,
    userid_answer:Meteor.userId(),
    type:dataobj.type
  });
  Deps.nonreactive(function(){
    var q = Session.get("AnswerCount") || 0;
    Session.set("AnswerCount",q+1);
  })
}

//setup helpers for handlebars before the data
// is actualy set.
Handlebars.registerHelper('PreQuizData', function() {
  return Session.get("Question");
});

Handlebars.registerHelper('QData', function() {
  return Session.get("QuestionData");
});

Handlebars.registerHelper('PreData', function(){
  return Session.get("Question");
});

Handlebars.registerHelper('DoneQuestions',function(){
  return Session.get("QuestionCount") >= 8;
});

Handlebars.registerHelper('DoneAnswers',function(){
  return Session.get("AnswerCount") >= 20;
})

Handlebars.registerHelper('QuestionCount',function(){
  return (Session.get("QuestionCount") || 0) + 1;
})

Handlebars.registerHelper('AnswerCount',function(){
  return (Session.get("AnswerCount") || 0) + 1;
})

Meteor.autosubscribe(function(){
  Meteor.subscribe("QuestionCount");
  Meteor.subscribe("AnswerCount");
})
