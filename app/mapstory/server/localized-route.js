
import Path from 'path';
import fs from 'fs-promise';
import {root} from './config';

function toLocalized(lang, path) {
  let dir = Path.dirname(path);
  let ext = Path.extname(path);
  let base = Path.basename(path, ext);

  return dir + '/' + base + '.' + lang + ext;
}

export default function localizedStatic(basepath) {
  return (req, res) => {

    let original = decodeURI(basepath + req.path);
    let localized = decodeURI(basepath + toLocalized(res.locals.lang, req.path));

    fs.stat(root + localized).then(() => {
      res.redirect(localized);
    }).catch(() => {
      return fs.stat(root + original).then(() => {
        res.sendFile(root + original);
      }).catch(() => res.status(404).end());
    });
  };
}
