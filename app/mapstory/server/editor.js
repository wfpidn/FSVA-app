
import fs from 'fs-promise';

import {root} from './config';

export function save(req, res) {
  let story = JSON.parse(req.body.story);
  let path = req.body.path;

  fs.writeFile(
    root + path,
    JSON.stringify(story, null, 4)
  )
    .then(() => res.send('Success'))
    .catch(err => res.status(400).send(String(err)));
}
