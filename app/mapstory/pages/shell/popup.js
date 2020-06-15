
import TinyModal from 'tiny-modal';
import DataTable from 'datatables';
import Vue from 'vue';
import _ from 'lodash';
import $ from 'jquery';
import { bus } from './state';
import Highcharts from 'highcharts-browserify';

import 'datatables/media/css/jquery.dataTables.min.css';

$.DataTable = DataTable;

let el = $(`
<div class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
        </div>
        <div class="modal-hide">
        </div>
    </div>
</div>
`).get(0);

let vm = null;

export function open(config) {
  if (vm !== null) {
    vm.$destroy();
  } else {
    document.body.appendChild(el);
  }

  let modal = el.querySelector('.modal-content');
  modal.parentNode.style.width = config.width;

  let template = config.template;
  let data = config.data;

  vm = new Vue({
    el: modal,
    template,
    replace: false,
    data
  });

  (new TinyModal(el, {})).show();

  // inject datatables
  _.each(config.datatables, ({selector, opts}) => {
    $(modal.querySelector(selector)).DataTable(opts);
  });

  // inject charts
  _.each(config.charts, ({selector, opts}) => {
    new Highcharts.Chart(_.merge(opts, {
      chart: {
        renderTo: modal.querySelector(selector)
      }
    }));
  });
}


bus.on('popup.show', open);
