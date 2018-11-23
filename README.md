# Node and NGX Boilerplate Application


## WARNING

This sample app contains a lot of untested code and is NOT MEANT FOR USE IN A REAL APPLICATION.   It's provided as is with no warranty and is not guarenteed to be free of:

- Bugs
- Security flaws
- Performance issues
- Insecure dependencies
- Features may not be complete.

### Real Talk

In addition to the warning - I don't recommend using a boilerplate for a real production app - Its a maintenance nightmare and you end up with a lot of extra code you dont want, need, or use.    Use this repository to see some patterns you like and reproduce it in your app that you created from scratch

*MIT LICENSE*

## Introduction

This repository contains a sample application meant to demonstrate some advanced coding patterns that can be experimented with and learned from in order to gain a better understanding for methods that can simplify your app and and reduce excess configuration.

### Features

- Node API w/ Mongoose
  - HATEOS compatabile with Links included on most responses
  - RESTful Single Sign On (I'll conquer SAML someday)
  - Oauth 2.0 with Basic and Client Credentials supported
  - Allowed Origins to secure unauthenticated end points.
  - Scripts to set default data such as email templates and admins.
  - SSL friendly.   Use openssl to generate a certificate.
- Angular 7 Front-End
  - Services and directives to consume HATEOS links.
  - Facebook, Google, LinkedIn and GitHub social sign in
  - Bootstrap 4


## Getting Started

- Clone to your machine
- Generate a new certificate using openssl (https://www.openssl.org/)   It's free and easy.   The certificate should go into the `ssl` folder.   You can look in `api/api-server.js` to see how its used in case you have any trouble.
- Open up the directory in a cmd line with administrator mode
- `cd` into the `api` directory and run `npm install`
- `cd` into the client directory and run `npm install`
- open up the `.env` file in the `api` directory and replace all the keys with your values.   You will need a Mailgun key (free) and contentful key (free) as well as AWS and Facebook/Google/Github/LinkedIn credentials.
- Do the same for the Angular environment files in the `client/environments` folder.
- You may want to do a global find replace for 'MySampleApp' and 'mysample' app and replace it with something else.   You will also want to note where its used in urls and email addresses as placeholder.   For example, the `api/db/scripts/emails.script.js` folder and the `environment.stage` where it references a potential heroku deployment are places to check and update.
- If all of the environment stuff is filled out correctly and you created the certificate - The app should be runnable.
  - Open up a cmd terminal and run `mongod` to get MongoDb going.
  - Open up a 2nd command terminal (VS Code is great for this) and cd into the `api` folder run `npm start`.   That should kickstart the api.
  - Open up a 3rd command terminal and cd into the `client` folder.   Run `ng serve --ssl`.   Follow the instructions and the app should run.


Poke and prod away!