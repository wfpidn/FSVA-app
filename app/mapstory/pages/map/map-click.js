
(function(){

  var _ = window.app.libs.lodash;
  var $ = window.app.libs.jQuery;
  var Vue = window.app.libs.Vue;
  var sprintf = window.app.libs.sprintf;
  var indicatorChart = window.app.libs.indicatorChart;

  var config = window.app.config;

  // FIXME: hardcoded data
  var povData = {
    main: {
      2005: 16.66,
      2009: 15.42,
      2015: 10.96
    },
    ntb: {
      2015: 17.25
    },
    ntt: {
      2015: 23.31
    },
    jatim: {
      2015: 12.73
    },
    papua: {
      2015: 31.25
    }
  };

  function init(args) {
    var esri = args.esri;
    var map = args.map;
    var mainIndicator = args.indicator;
    var indicators = args.indicators;

    map.graphics.on('click', function(evt) {
      var srcAttr = config.map.area.src;
      var areaId = evt.graphic.attributes[srcAttr];

      fetchData(areaId).then(function(rows) {
        open(rows);
      });
    });

    function open(rows) {
      var prioRows = _.filter(rows, {indicatorId: 'PRIO'});
      var priority = prioRows.length === 0 ? null : _.maxBy(prioRows, 'year').value;

      // sample row
      var row = rows[0] || {};

      var prioChart = {
        selector: '.chart-priority',
        opts: indicatorChart.buildOpts({
          indicator: _.find(indicators, {id: 'PRIO'}),
          rows: _.filter(rows, {indicatorId: 'PRIO'}),
          opts: {
            chart: {
              type: 'column'
            }
          }
        })
      };

      var povChart = {
        selector: '.chart-poverty',
        opts: indicatorChart.buildOpts({
          indicator: _.find(indicators, {id: 'POV'}),
          rows: _.filter(rows, {indicatorId: 'POV'}),
          opts: {
            chart: {
              type: 'line'
            }
          }
        })
      };

      injectPovChart(povChart.opts, row);

      window.app.post('popup.show', {
        template: document.querySelector('#template-popup-click').textContent,
        data: {
          config: config,
          area: row,
          priority: priority,
          table: buildTable(indicators, rows)
        },
        width: '800px',
        charts: [prioChart, povChart]
      });
    }
  }

  function fetchData(areaId) {
    var q = {
      dataset: config.dataset,
      query: '$.root[?(@.%(attr)s === %(areaId)i)]',
      params: {
        attr: config.map.area.dst,
        areaId: areaId
      }
    };
    return $.getJSON('/dataset/json', { q: JSON.stringify(q)});
  }

  function buildTable(indicators, rows) {
    var years = _.chain(rows).map('year').uniq().sort().value();

    function getValue(year, indicatorId) {
      var row = _.find(rows, {year: year, indicatorId: indicatorId});
      return row ? row.value : null;
    }

    return {
      header: indicators,
      rows: years.map(function(y) {
        return {
          year: y,
          values: indicators.map(function(indicator) {
            return getValue(y, indicator.id);
          })
        };
      })
    };
  }

  function injectPovChart(opts, row) {
    var lang = window.app.lang;
    var storyId = getStoryId();
    var data = povData[storyId];

    opts.series.push({
      name: '',
      data: opts.xAxis.categories.map(function(y) {
        var value = y in data ? data[y] : null;
        return {
          name: String(y),
          y: value
        };
      }),
      color: '#CC4444',
      dataLabels: {
        enabled: false
      }
    });

    // FIXME: again, hardcoded
    if (storyId === 'main') {
      opts.series[0].name = sprintf(lang['povertyrate'], {name: row.district});
      opts.series[1].name = lang['nationpovertyrate'];
    } else {
      opts.series[0].name = sprintf(lang['povertyrate'], {name: row.subdistrict});
      opts.series[1].name = sprintf(lang['povertyrate'], {name: row.province});
    }
  }

  // FIXME: dirty method for knowing storyId
  function getStoryId() {
    return window.app.config.dataset.match(/stories\/(.*?)\//)[1];
  }

  window.app.modules['esri-map'].then(function(emod) {
    window.app.modules['indicator'].then(function(imod) {
      init({
        esri: emod.esri,
        map: emod.map,
        indicator: imod.indicator,
        indicators: imod.indicators
      });
    });
  });

}());
