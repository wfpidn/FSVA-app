import fs from 'fs-promise';
import express from 'express';
import _ from 'lodash';
import compression from 'compression';
import bodyParser from 'body-parser';

import config from './config';
import localizedRoute from './localized-route';

const SupportedLang = ['en', 'id'];
const app = express();
const root = config.root;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression({level:9}));

app.use((req, res, next) => {
  var lang = req.header('fsva_lang');
  if (SupportedLang.indexOf(lang) < 0) {
    res.status(400).send('Language not supported: ' + lang);
    return;
  }
  res.locals.lang = lang;
  next();
});

// check the language used
app.get('/language', (req, res) => {
  res.json({
    languages: SupportedLang,
    current: res.locals.lang
  });
});

// landing page form QR codes
app.get(/^\/qr[\/]?$/i, (req, res) => {
  res.redirect('/pages/static/landing/index.html');
});

app.get('/', (req, res) => {
  // go to default story
  fs.readFile(root + '/stories/stories.json', 'utf8')
    .then(content => {
      let story = JSON.parse(content)['default'];
      res.redirect(`/s/${story}`);
    })
    .catch(err => res.send(err));
});

app.get('/s/:story', (req, res) => {
  res.sendFile(`${root}/pages/shell/index.html`);
});

app.use('/public', localizedRoute('/public'));
app.use('/pages', localizedRoute('/pages'));
app.use('/stories', localizedRoute('/stories'));

app.get('/dataset/csv', (req, res) => {
  require('./dataset').csv.call(null, req, res);
});

app.get('/dataset/json', (req, res) => {
  require('./dataset').json.call(null, req, res);
});

// FIXME: editor disabled for the time being
app.get('/editor', (req, res) => {
  res.sendFile(`${root}/pages/editor/index.html`);
});
app.post('/editor/save', (req, res) => {
  require('./editor').save.call(null, req, res);
});

app.listen(config.port, config.host, () => {
  console.log(`listening on: ${config.host}:${config.port}`);
});
