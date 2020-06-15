import fs from 'fs-promise';
import fastCsv from 'fast-csv';
import _ from 'lodash';
import {sprintf} from 'sprintf-js';
import jsonPath from 'JSONPath';

import {root} from './config';

let cache = {};

export function json(req, res) {
  let q = JSON.parse(req.query.q);
  res.json(execute(q));
}

export function csv(req, res) {
  let q = JSON.parse(req.query.q);
  let data = execute(q);

  let header = _.map(q.columns, 'title');
  let rows = generateRows(data, q.columns, q.order);

  res.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-disposition': 'attachment; filename=' + q.filename
  });
  fastCsv.write([header].concat(rows), { headers: true })
    .pipe(res);
}

function read(path) {
  if (!(path in cache)) {
    cache[path] = JSON.parse(fs.readFileSync(path));
  }
  return cache[path];
}

function execute(opts) {
  let dataset = opts.dataset;
  let query = opts.query;
  let params = opts.params;

  let data = read(root + dataset);
  let rows = jsonPath.eval({root:data}, sprintf(query, params));
  rows.forEach(r => {
    // force 2 digit precision
    if ('value' in r) {
      r.value = parseInt(r.value * 100) / 100;
    }
  });
  return rows;
}

function generateRows(data, columns, order) {
  let rows = data.map (r => {
    return columns.map(c => {
      return r[c.attr];
    });
  });
  return sort(rows, order);
}

function sort(rows, order) {
  return rows.sort ((a, b) => {
    for (let o in order) {
      let index = o[0];
      let dir = o[1] === 'asc' ? -1 : 1;

      let v1 = a[index];
      let v2 = b[index];
      if (v1 === v2) {
        continue;
      }
      return ((v1 > v2) ? 1 : -1) * dir;
    }
    return 0;
  });
}

