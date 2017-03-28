# SlackSafe

_Disclaimer: Use this local only, nothing is secured or hashed. Email addresses could be stolen with wrong purposes._

## Setup MonboDB

Create an MongoDB database in your vm or local machine the default port is `127.0.0.1:27017`. Change this port in `/slacksafe/index.js`.

Run the following command in Mongo Shell
```sql
>use slacksafe
switched to db slacksafe
```

## Setup NodeJS
**NodeJS and NPM**
Download [NodeJS with NPM](https://nodejs.org/en/download/).
**Installing modules**
Run the following command in `/the_root_of_your_slacksafe_dir`
```bash
$ npm install
```
## Run & build SlackSafe
Minify the css to `/public/dist/css/styles.min.css`
```bash
$ npm run css:minify
```
Convert css/sass to `./public/dist/css/styles.css`
```bash
$ npm run css:compress
```
Rebuild css on filechange (*.css)
```bash
$ npm run css:watch
```
Minify js to `/public/dist/js/bundle.min.js`
```bash
$ npm run js:minify
```
Bundle js to `/public/dist/js/bundle.js`
```bash
$ npm run js:browserify
```
Bundle and minify js
```bash
$ npm run js:compress
```
Watch js on filechange (*.js) bundle and minify
```bash
$ npm run js:watch
```
Watch js and css on filechange bundle and minify
```bash
$ npm run client:watch
```
Watch server js on filechange restart app.js *(nodemon)*
```bash
$ npm run server:watch
```
Watch all server js, client js and css. Bundle, minify and restart on filechange
```bash
$ npm run all:watch
```
Minify all client js and css
```bash
$ npm run build
```
Watch server js on filechange restart app.js *(nodemon)*
```bash
$ npm run start
```

## What is SlackSafe?

We live in a time where passwords are weak and information is priceless. It is important to have a healty workflow and be safe and secure.

Slacksafe is a simple and effective way to screen all your Slack teams. You can inform them about their stolen data. After the screening is done.

Within seconds you can see witch teams are safe, and witch are not.

Based on the [Have I Been Pownd](https://haveibeenpwned.com/) API that is very up-to date you are always in track of the leaks in your company!