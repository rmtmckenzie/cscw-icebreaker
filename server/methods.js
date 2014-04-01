

function handleTTF(q) {
  var ret = {};
  rand = Math.random();
  ret.true1= q.true1;
  ret.true2= q.true2;
  ret.false1 = q.false1;
  ret.question = q.question;

  if(rand <= 0.16666){
    ret.s1 = q.true1;
    ret.s2 = q.true2;
    ret.s3 = q.false1;
    ret.a = 3;
  } else if(rand <= 0.33333){
    ret.s1 = q.true2;
    ret.s2 = q.true1;
    ret.s3 = q.false1;
    ret.a = 3;
  } else if(rand <= 0.5){
    ret.s1 = q.true1;
    ret.s2 = q.false1;
    ret.s3 = q.true2;
    ret.a = 2;
  } else if(rand <= 0.66666){
    ret.s1 = q.true2;
    ret.s2 = q.false1;
    ret.s3 = q.true1;
    ret.a = 2;
  } else if(rand <= 0.83333){
    ret.s1 = q.false1;
    ret.s2 = q.true1;
    ret.s3 = q.true2;
    ret.a = 1;
  } else {
    ret.s1 = q.false1;
    ret.s2 = q.true1;
    ret.s3 = q.true2;
    ret.a = 1;
  }
  return ret;
}

function setUserNames(firstName, lastName){
  check(firstName, NonEmptyString);
  check(lastName, NonEmptyString);

  Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.firstName":firstName}});
  Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.lastName":lastName}});
  return true;
}

function getRandomQuestion(){
  console.log("GetRandomQuestion called");
  var rand = Math.random(),
    argobj = {userid:{$ne:Meteor.userId()},rand:{$gt:rand}},
    q = Questions.findOne(argobj),
    ret,
    user;

  if(!q){
    argobj.rand = {$lte:rand};
    q = Questions.findOne(argobj);
  }
  if(!q){
    console.log("No TTF questions to return for user "+Meteor.userId());
    throw new Meteor.Error(500,"No questions to return","No one else has answered yet!");
  }
  user = Meteor.users.findOne({_id:q.userid});
  if(!user){
    console.log("No user found for question "+q._id+", user: ", q.userid);
    throw new Meteor.Error(500,"No user found","Question "+q._id+" has no user??");
  }

  switch(q.type){
    case 'ttf':
      ret = handleTTF(q);
      break;
    case 'multiple_choice':
      ret = q;
      break;
    case 'video':
      ret = q;
      break;
    default:
      ret = q;
  }

  console.log("Returning question: " + JSON.stringify(q));
  ret.type = q.type;
  ret.user = user.profile.firstName +' '+ user.profile.lastName;
  ret.userid = q.userid;

  return ret;
}

function cleanPath (str) {
  if (str) {
    return str.replace(/\.\./g,'').replace(/\/+/g,'').
      replace(/^\/+/,'').replace(/\/+$/,'');
  }
}
function cleanName (str) {
  return str.replace(/\.\./g,'').replace(/\//g,'');
}

function saveFile(blob, name, path, encoding) {
  var path = cleanPath(path),
    fs = Meteor.fs,
    name = cleanName(name || 'file'),
    options = {encoding: encoding || 'binary'},
    fileBuffer,
    filePath,
    fileName = Math.random().toString(36).substring(6) + name;

  // Clean up the path. Remove any initial and final '/' -we prefix them-,
  // any sort of attempt to go to the parent directory '..' and any empty directories in
  // between '/////' - which may happen after removing '..'
  path = Meteor.getUploadsPath(path);

  if(!fs.existsSync(path) ) {
      fs.mkdirSync(path, '755');
  }

  blob = blob.split(',').pop();
  fileBuffer = new Buffer(blob, "base64");
  filePath = path + fileName;

  fs.writeFileSync(filePath, fileBuffer, options);
  console.log('The file ' + fileName + ' (' + encoding + ') was saved to ' + filePath);

  return fileName;
}

function saveVideoQuestion(data,questionobj){
  questionobj.video = saveFile(data.video,data.videoformat,'video','binary');
  questionobj.audio = saveFile(data.audio,data.audioformat,'video','binary');
  Questions.insert(questionobj);
}

Meteor.methods({
  setUserNames: setUserNames,
  getRandomQuestion: getRandomQuestion,
  saveVideoQuestion: saveVideoQuestion
});
