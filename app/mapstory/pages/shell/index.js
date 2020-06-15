import Vue from 'vue';
import numeral from 'numeral';

import 'purecss/build/base.css';
import 'purecss/build/grids.css';
import 'purecss/build/tables.css';

import '../shared/fonts.css';
import './css/index.scss';
import './css/header.scss';
import './css/menu.scss';
import './css/narration.scss';
import './css/popup.scss';

Vue.config.debug = process.env.NODE_ENV !== 'production';

// external
let lang = window.app.lang;
Vue.filter('lang', key => {
  return lang[key];
});

Vue.filter('numeral', (value, fmt) => {
  if (!isFinite(value)) {
    return '';
  }
  let label = numeral(value).format(fmt || '0');
  return label.endsWith('.00') ? label.substr(0, label.length - 3) : label;
});

import App from './App.vue';
import './history';
import './popup';

new Vue({
  el:'body',
  components: { App }
});
