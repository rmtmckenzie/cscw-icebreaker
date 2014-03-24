cscw-icebreaker
===============

UVic CSCW spring 2014 final project - an icebreaker for non-colocated teammates
Get Nodejs:

# Installation

## Ubuntu

sudo apt-get update
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs


## Mac
** I have no idea if this will work, you can try it though:
http://nodejs.org/download/
then follow instructions.


## Meteor:

curl https://install.meteor.com/ | sh

## Meteorite:

sudo -H npm install -g meteorite

## Project Sources

git clone https://github.com/rmtmckenzie/cscw2014

# Setup

Meteor actually does this for you. All you have to do is
run 'mrt' on command line in main folder.

# Run

'mrt' - this sets up and runs the application.
'mrt -p 3500' - runs on different port (3500)

# Server setup

Don't worry about this if you're running on your machine,
or using the server I set up (it's already done).

NginX config - must contain these lines or websockets fail:

location / {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
