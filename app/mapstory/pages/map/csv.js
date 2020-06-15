
(function() {
  var _ = window.app.libs.lodash;
  var $ = window.app.libs.jQuery;
  var sprintf = window.app.libs.sprintf;
  var config = window.app.config;

  function init(indicator, rows) {
    function download() {
      var q = {
        dataset: config.dataset,
        query: '$.root[?(@.indicatorId === "%(indicatorId)s" && @.year === %(year)i)]',
        params: {
          year: resolveMaxYear(rows),
          indicatorId: indicator.id
        },
        columns: resolveColumns(config.table.columns, indicator, ['title', 'attr']),
        order: config.table.order,
        filename: 'FSVA_' + indicator.label.split(/\s+/).join('_') + '.csv'
      };
      window.open('/dataset/csv/?q=' + encodeURIComponent(JSON.stringify(q)));
    }

    function tableView() {
      window.app.post('popup.show', {
        template: document.querySelector('#template-popup-table').textContent,
        data: {},
        width: '800px',
        datatables: [{
          selector: '.dt',
          opts:  {
            scrollY: '400px',
            scrollColapse: true,
            paging: false,
            data: resolveRows(rows, config),
            columns: resolveColumns(config.table.columns, indicator, ['title', 'width']),
            order: config.table.order
          }
        }]
      });
    }

    window.app.modules['csv'].resolve({
      download: download,
      tableView: tableView
    });
  }

  function resolveRows(rows) {
    var columns = config.table.columns;
    var expr = config.expression.showRow;
    rows = rows.filter(function(r) {
      return  evaluate(expr, {row: r});
    });
    rows = rows.filter(function(r) {
      return r.year === resolveMaxYear(rows);
    });
    return rows.map(function(r) {
      return columns.map(function(c) {
        return r[c.attr];
      });
    });
  }

  function evaluate(expression, params) {
    return eval(sprintf(expression, params));
  }

  function resolveMaxYear(rows) {
    return _.chain(rows).map('year').max().value();
  }

  function resolveColumns(columns, indicator, picks) {
    return columns.map (function(column) {
      var ext = _.extend({}, column, {
        title: sprintf(column.title, {indicator: indicator})
      });
      return _.pick(ext, picks);
    });
  }

  window.app.modules['indicator'].then(function(mod) {
    init(mod.indicator, mod.rows);
  });

}());
