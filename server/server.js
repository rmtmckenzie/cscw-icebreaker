Meteor.startup(function () {
  var fs = Meteor.fs = Npm.require('fs');
  var path = Meteor.path = Npm.require('path');
  Meteor.mkdirp = Npm.require('mkdirp');
  var meteor_root = fs.realpathSync( process.cwd() + '/../' );
  var application_root = fs.realpathSync( meteor_root + '/../' );

  // if running on dev mode
  if( path.basename( fs.realpathSync( meteor_root + '/../../../' ) ) == '.meteor' ){
      application_root =  fs.realpathSync( meteor_root + '/../../../../' );
  }
  Meteor.assets_folder = application_root + '/public/uploads/';
});

var handleTTF = function(q){
  var ret = {};
  rand = Math.random();
  ret.true1= q.true1;
  ret.true2= q.true2;
  ret.false1 = q.false1;

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
    ret.s3 = q.true2
    ret.a = 1;
  }
  return ret;
}

Meteor.methods({
  setUserNames: function(firstName, lastName){
    check(firstName, NonEmptyString);
    check(lastName, NonEmptyString);

    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.firstName":firstName}})
    Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.lastName":lastName}})
    return true;
  },
  getRandomQuestion: function(){
    var rand = Math.random(),
        argobj = {userid:{$ne:Meteor.user()._id},rand:{$gt:rand}},
        q = Questions.findOne(argobj),
        ret,
        user,
        rand;
    if(!q){
      argobj.rand = {$lte:rand}
      q = Questions.findOne(argobj);
    }
    if(!q){
      console.log("No TTF questions to return for user "+Meteor.user()._id);
      throw new Meteor.Error(500,"No questions to return","No one else has answered yet!");
    }
    user = Meteor.users.findOne({_id:q.userid});
    if(!user){
      console.log("No user found for question "+q._id+", user: ", q.userid);
      throw new Meteor.Error(500,"No user found","Question "+q._id+" has no user??");
    }
    
    var ret;
    switch(q.type){
      case 'truetruefalse':
        ret = handleTTF(q);
        break;
      default:
        ret = {};
    }
    ret.type = q.type;
    ret.user = user.profile.firstName +' '+ user.profile.lastName;
    
    return ret;
  },
  saveFile: function(blob, name, path, encoding) {
    var path = cleanPath(path), fs = Meteor.fs,
      name = cleanName(name || 'file'), options = {encoding: encoding || 'binary'},
      chroot = Meteor.assets_folder,
      fileBuffer;

    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');
    
    // TODO Add file existance checks, etc...
    Meteor.mkdirp.sync(path, '755');    
    blob = blob.split(',').pop();
    fileBuffer = new Buffer(blob, "base64");
    
    fs.writeFile(path + name, fileBuffer, options); 
    /*, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    }); */

 
    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
  }
});

Questions.allow({
  insert: function(userId, data){
    switch(data.type){
    case "truetruefalse":
      check(data.true1, NonEmptyString);
      check(data.true2, NonEmptyString);
      check(data.false1, NonEmptyString);
      break;
    default:
      throw new Error("No question type defined");
    }
    check(data.num, Number);
    check(data.userid, Match.Where(function(x){ return userId === x}));
    check(data.rand, Number);
    console.log("allowed insert...");
    return true;
  }
});



