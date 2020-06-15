
(function() {
  var Vue = window.app.libs.Vue;
  var config = window.app.config;

  var vm = new Vue({
    template: '#template-header',
    el: '#vue-header',
    data: {
      config: config,
      buttons: resolveButtons(),
      toggle: {
        legend: true
      }
    },
    methods: {
      click: function(button) {
        if ('active' in button) {
          button.active = !button.active;
        }
        button.handler.call(null);
      }
    }
  });

  function resolveButtons() {
    var lang = window.app.lang;
    var buttons = [];
    if ('csv' in window.app.modules) {
      buttons.push({
        label: lang['button.download'],
        handler: download
      });
      buttons.push({
        label: lang['button.table'],
        handler: tableView
      });
    }
    if ('legend' in config) {
      buttons.push({
        label: lang['button.legend'],
        active: true,
        handler: toggleLegend
      });
    }
    return buttons;
  }

  function download() {
    window.app.modules['csv'].then(function(mod) {
      mod.download();
    });
  }

  function tableView() {
    window.app.modules['csv'].then(function(mod) {
      mod.tableView();
    });
  }

  function toggleLegend() {
    vm.toggle.legend = !vm.toggle.legend;
  }
}());
