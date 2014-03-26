//various helpers and such.

Deps.autorun(function(){
  var i = QuestionCount.findOne();
  i && Session.set("QuestionCount",i.count);
});

Deps.autorun(function(){
  var i = AnswerCount.findOne();
  i && Session.set("AnswerCount",i.count);
});
