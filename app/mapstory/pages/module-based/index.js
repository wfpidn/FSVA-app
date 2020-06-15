
import _ from 'lodash';
import $ from 'jquery';
import Vue from 'vue';
import {sprintf} from 'sprintf-js';
import Highcharts from 'highcharts-browserify';
import indicatorChart from '../shared/indicator-chart';

import params from '../shared/params';

import 'normalize.css';
import '../shared/fonts.css';

window.app = {
  libs: {
    lodash: _,
    jQuery: $,
    Vue,
    sprintf,
    Highcharts,
    indicatorChart
  },
  params,
  post(header, body) {
    window.parent.postMessage({header, body}, '*');
  },
  tellClicked() {
    window.parent.postMessage({header: 'content.clicked'}, '*');
  },
  tellReady() {
    window.parent.postMessage({header: 'content.ready'}, '*');
  },
  config: null,

  lang: {},
  registerLang(rows) {
    _.merge(window.app.lang, rows);
  },
  modules: {}
};

function init(config) {
  window.app.config = config;
  $(document).on('click', window.app.tellClicked);

  config.modules.map(path => {
    let name = basename(path);
    window.app.modules[name] = $.Deferred();
    $.getScript(path + '.js').fail((xhr, settings, ex) => {
      console.error(`Exception on module: ${path}`, ex);
    });
  });
}

function basename(path) {
  return _.last(path.split('/'));
}

function loadConfig() {
  let paths = window.app.params.config;
  if (typeof paths === 'string') {
    paths = [paths];
  }

  let results = {};
  let promises = paths.map(p => {
    return $.getJSON(p).then(config => {
      results[p] = config;
    });
  });

  return Promise.all(promises).then(() => {
    let configs = paths.map(p => results[p]);
    let config = _.merge({}, ...configs);

    return config;
  });
}

$(document).ready(() => {
  loadConfig().then(init);
});
