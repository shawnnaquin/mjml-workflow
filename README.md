# mjml-workflow

<p align="left">
  <a href="http://mjml.io" target="_blank">
    <img width="150"src="https://mjml.io/assets/img/litmus/mjmlbymailjet.png">
  </a>
    <a href="https://gulpjs.com">
    <img height="90" style="padding-right:16px;" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
  <a href="https://www.browsersync.io" rel="nofollow"><img width="130px" src="https://raw.githubusercontent.com/BrowserSync/browsersync.github.io/master/public/img/logo-gh.png" style="transform:translateY(5px)"></a>
  <br/>
    <img style="padding-left:22px;padding-bottom:4%"width="80"src="https://travis-ci.org/joemccann/dillinger.svg?branch=master"/>

mjml-workflow is a modern tooling approach to building several email marketing templates with mjml in one repo with Gulp. (Not officially affiliated with mjml or MailJet, just a personal project ). Feel free to use this!

  - Version Your Email Templates
  - Send Test Emails
  - Zip up your deliverables
  - Error Reporting
  - Browser-sync, watch task
  - mjml beautify (.jsbeautifyrc)
  - uses node mjml (^4.4.0-beta.1)
  - customizable app settings in package.json

## Customize!

  - Feel Free to fork and customize away.
  - I kept this light, but you could build a landing page and a continuous deployment system on top.
  - extend the mjml engine to minify if you want.
  - You could simply only use prettify on existing mjml based on the .jsbeautifyrc config and nothing else!

### Tech

mjml-workflow uses a number of open source projects to work properly:

* [node.js](https://nodejs.org) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Gulp](https://gulpjs.com) - the streaming build system
* [mjml](https://mjml.io/) -  the only framework that makes responsive-email easy
* [nodemailer](https://nodemailer.com/) - Send e-mails with Node.JS – easy as cake!
* [bestzip](https://www.npmjs.com/package/bestzip) - Provides a `bestzip` command that uses the system `zip`
* [browser-sync](https://www.browsersync.io/) - eep multiple browsers & devices in sync

### Why not just use the mjml app?
- I'm stubborn
- I actually enjoy front-end tooling
- I like my own editor
- I like my own browser / browser tools
- I like terminal and cli
- I knew it could be done!
- create versioned assets ready to hand off ( zip file, html files ) right from the cli!

links:
- [mjml repo](https://github.com/mjmlio/mjml)
- [mjml website](https://mjml.io/)
- [mjml app](https://mjml.io/download)

### Installation

mjml-workflow requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd mjml-workflow
$ npm i
$ node run server
```

For production...

```sh
$ npm run package
```
### Test Emails

#### .pwd
In order to send test emails:

You'll need to create a `.pwd` file in the project root with a single string containing your email app password for nodemailer. All other nodemailer settings are handled in `package.json.app`

... See the `./mail.js` file for `.pwd` usage.

#### nodemailer

In order to send test emails:

You'll need to customize the `transporter` variable in `./mail.js`

I currently have the transporter set to `gmail`. see the [nodemailer docs](https://nodemailer.com/smtp/well-known/) for details on how to setup 'well-known' email services. In the case of gmail you need to setup an app password for the device you'll be sending from.

#### package.json variables

Almost all the variables in package.json app are used to send an email.

Change them!
***(espeacially the admin email and .pwd password!)***

### mjml
[gulp-mjml](https://github.com/mjmlio/gulp-mjml) had several deprecation warnings, hadn't been updated for gulp4, and contained security risks.

So I chose to use the main [mjml repo](https://github.com/mjmlio/mjml)

Errors are saved to json files in the `./errors` folder by default.

If you want to customize the mjml options you'll have to find the
- `markup` variable in the. `./gulpfile.js :55` and add options

### package.json.app
```
index:  "Fall Sale.mjml"
// Your current working file
// index file browser-sync serves from
// must match the filename of any file in the `src` directory.
// spaces in the value are converted to _ characters
```
```
client: "Company Name" // Client Name
```
```
collection: "Project Name" // Project Name
```
```
admin: "me@iamagooddev.com" // email address for nodemailer
```
```
to: "SendTestEmailsHere@myclient.com" // test email recipient address
```
```
from": "yourdevteam@cooldevshop.com", // test email from field
```
**DANGER** following lines are run through ***`eval()`*** in JS
```
subject": "`TEST v${ version } | ${ client } - ${ collection } - ${ index.split( '.' )[ 0 ] }`"
// subject field for nodemailer
```
**example:** TEST v1.0.8 | Email Company - Clothing Sales - Fall Savings
```
zipName: "`${ client }.${ collection }.${ version }`",
// output zip filename
```
**example:** Email_Company.Clothing_Sales.1.0.8.zip
```
htmlPrefix: "`${ client }.${ collection }.`",
// output html file prefix name
```
```
htmlSuffix: "`.${ version }`",
// html suffix name
```
**example:** Email_Company.Clothing_Sales.Fall_Savings.1.0.8.html
___
```
"errors": "./errors/"
// error dir
```
```
"src": "./src/"
// src dir
```
```
"dist": "./dist/"
// dist dir
```
```
"packed": "./dist/packed/"
// deliverable directory
```
```
"utf": "utf8"
// encoding
```

### NPM Scrips
```
npm run serve
```
Runs the Gulp Default task.
- serves the index file at localhost
- watches src mjml for changes
- The index file can be customized in package.json.app
- outputs to dist

```
npm run pretty
```
Beautifies the src mjml files.
- uses .jsbeautifyrc in project root
- must be manually run, no other task or script runs this command

```
npm run build
```
Converts the mjml and outputs to dist directory.
- serve runs this command and watches mjml, serves from dist directory
- most tasks run this command to ensure a fresh build
- dist folder changed in package.json.app
- outputs to dist

```
npm run version
```
Callback to build for version command

```
npm run semver
```
Up the version in package.json by with patch ( +0.0.1 )
- runs the build command

```
npm run mail
```
Sends a test email via nodemailer
- `package.json.app.admin`, `package.json.app.to`, `package.json.app.from` and the `.pwd` keys should be changed before running.
- runs the build command

~~See the above section to change vars !!

```
npm run package
```
Create client deliverables. Packages the project's HTML files and creates a .zip file. Content.
- creates versioned html files
- creates versioned zip file
- customize this is package.json.app
- runs the build command
- outputs to `./dist/packed` by default

## CONTACT

- [shawn.naquin@gmail.com](mailto:shawn.naquin@gmail.com)
- [devnola.com](https://devnola.com/)

Please feel free to fork.
Let me know any issues you find.
