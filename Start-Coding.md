# Purpose

This is a quick introduction to this project, and is hopefully enough to get you starting coding for it!

# Introduction to Meteor

Honestly, the best resource for learning Meteor is probably the documentation: http://docs.meteor.com/. But here's a few more:
- https://github.com/oortcloud/unofficial-meteor-faq
- http://sebastiandahlgren.se/2013/07/17/tutorial-writing-your-first-metor-application/
- http://www.danneu.com/posts/6-meteor-tutorial-for-fellow-noobs-adding-features-to-the-leaderboard-demo/
- http://www.smashingmagazine.com/2013/06/13/build-app-45-minutes-meteor/

In meteor, everything works with either Templates or Javascript. These are the basic building blocks of the webpage; the Templates define how it looks and the js how it works. 

The javascript also gives access to MongoDB collections, and provides easy ways to hook up these to the templates, thus providing the content.

## Templates
Uses the Handlebars syntax.

- https://github.com/meteor/meteor/wiki/Handlebars
- http://handlebarsjs.com/

In this particular project we are using Iron-Router to handle page changes. 
This works because of the code in 'app.js' which defines the different routes
that the browser can go to. Note that for this project 'layoutTemplate' should 
be 'layout' for any pages so that the login, chat, and people panes are shown.

# Intro - add new page

To add a new page there are two steps. First, create a template in the client
folder (in any html file), and give it a name.
```
<template name="helloworld">
Hello World!
</template>
```
Seconds, in app.js in the Router.map function, add 
```
  this.route('helloworld', {
    path: 'hello',
    template: 'hello-world',
    layoutTemplate: 'layout'
  });
```
Now, when you browse to <serverlocation>:<port>/hello you will see the text
'Hello World!' in top left pane, with chat below it and people on the right.

Let's bring in some javascript. We're goign to get the user's name if they're
logged in! First, the template:

```
<template name="helloworld">
{{#if currentUser}}
  Hi {{username}}!
{{else}}
  Hello stranger!
{{/if}}
```
Note that 'currentUser' is provided by Meteor and doesn't need to be changed.
It simply checks for a user, and if found returns the user object.

However, username is not defined so we need to do so, in a .js file in the
client directory:
```
Template.helloworld.username = function(){
  var user = Meteor.user(),
      name;
  if(user){
    if(user.username)
      name = user.username;
    else if(user.profile.firstName)
      name = user.profile.firstName
    else if user.emails
      name = user.emails[0].address
  } else {
    return;
  }
  
  return name;
}
```
This checks for a user. If a user is logged in, it first looks for a username,
and if found returns that. If not found, checks for a first name and returns that, 
and if first name is not found, uses the email. See http://docs.meteor.com/#meteor_users.

The important thing to remember with users is that they only have the information that
is provided (it is possible to ensure that certain information is provided though!).

# Collections
Lets quickly look at the code for adding information for a user, as this shows basically 
how a collection works in Meteor. (note that the users collection is already made. See lib/globals.js
for an example of more collections being made.)

Let's assume that you already have a form with the information in it - i.e. a first and
last name for a user.



# Project Layout

```
Root
  ↳ client - anything in this folder only run on client
    ↳ compatibility - anything in this folder runs in root js context rather than a closure
      ↳ recordRTC.js - helper for recording webcam video
    ↳ client.css - all css for the project
    ↳ client.js - general code that doesn't correspond to a particular part such as quizzes
    ↳ client.html - templates for layout, messages, etc that doesn't have own part
    ↳ home.html - some templates for the information pane - telling them to sign in, saying done, etc.
    ↳ quizzes.html - templates for quizzes in general
    ↳ quizzes.js - javascript for quizzes in general
    ↳ ttfquiz.html - templates for TrueTrueFalse quizzes
    ↳ ttfquiz.js - logic for TrueTrueFalse quizzes
  ↳ lib - anything in this folder is loaded first!
    ↳ globals.js - define collections, functions, etc used everywhere    
  ↳ packages - don't touch, for meteorite
  ↳ server - anything in this folder only run on server (put security stuff here!)
    ↳ server.js - sets up path for uploads, publishes messages to chat, restricts access to db & filters data
                - defines some functions to be called by client and run on server
  ↳ public - this is where assets (images, etc) are stored.
           - accessible from web by just name in this folder, i.e. image.jpg would be "image.jpg"
    ↳ uploads - a folder for uploaded images/videos
  app.js - basic setup code which runs on server and client
         - routing for the project!
  smart.json - meteor's smart package install information
  smart.lock - more meteor smart package stuff
```

# 
