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
### NodeJS and NPM
Download [NodeJS with NPM](https://nodejs.org/en/download/).
### Installing modules
Run the following command in `/the_root_of_your_slacksafe_dir`
```bash
$ npm install
```
### Running the app
```bash
$ npm run css:minify
$ npm run css:compress
$ npm run css:watch
$ npm run js:minify
$ npm run js:browserify
$ npm run js:compress
$ npm run js:watch
$ npm run client:watch
$ npm run server:watch
$ npm run all:watch
$ npm run build
$ npm run start
```


## Setting up SlackSafe

