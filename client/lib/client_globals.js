QuestionCount = new Meteor.Collection('QuestionCount');
AnswerCount = new Meteor.Collection('AnswerCount');

Meteor.saveQuestion = function(type,dataobj){
  dataobj.userid = Meteor.userId();
  dataobj.type = type;
  dataobj.rand = Math.random();
  Questions.insert(dataobj);
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
}

//setup helpers for handlebars before the data
// is actualy set.
Handlebars.registerHelper('QData', function() {
  return Session.get("QuestionData");
});

Handlebars.registerHelper('DoneQuestions',function(){
  return Session.get("QuestionCount") > 10;
})

Handlebars.registerHelper('DoneAnswers',function(){
  return Session.get("AnswerCount") > 10;
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
