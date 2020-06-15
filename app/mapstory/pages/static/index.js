
import lodash from 'lodash';
import jQuery from 'jquery';
import Vue from 'vue';

import params from '../shared/params';

import 'normalize.css';
import '../shared/fonts.css';

window.app = {
  libs: {
    lodash,
    jQuery,
    Vue
  },
  params,
  tellClicked() {
    window.parent.postMessage({header: 'content.clicked'}, '*');
  },
  tellReady() {
    window.parent.postMessage({header: 'content.ready'}, '*');
  }
};
