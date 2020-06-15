
(function() {
  var $ = window.app.libs.jQuery;
  var Vue = window.app.libs.Vue;
  var sprintf = window.app.libs.sprintf;
  var config = window.app.config;
  var indicatorChart = window.app.libs.indicatorChart;

  var vm = null;
  var wrapper = $('<div class="popup-hover"></div>')
        .css({'display': 'none'})
        .appendTo(document.body)
        .get(0);

  var template = document.querySelector('#template-popup-hover').textContent;

  function init(args) {
    var esri = args.esri;
    var indicator = args.indicator;
    var rows = args.rows;
    var map = args.map;
    var Highcharts = args.Highcharts;

    var layer = map.getLayer('main');
    var highlightSymbol = new esri.SimpleFillSymbol(
      esri.SimpleFillSymbol.STYLE_SOLID,
      new esri.SimpleLineSymbol(
        esri.SimpleLineSymbol.STYLE_SOLID,
        new esri.Color([255,255,255]), 2
      ),
      new esri.Color([125,125,125,0.35])
    );

    wrapper.addEventListener('mouseenter', function() {
      close(map);
    });

    map.graphics.on('mouse-out', function(evt) {
      close(map);
    });

    map.on('mouse-over', function(evt){
      // base map hovered
      if (evt.target.id === 'map-container_gc') {
        close(map);
      }
    });

    map.on('mouse-drag', function(evt) {
      close(map);
    });

    layer.on('mouse-over', function(evt) {
      map.graphics.clear();
      var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
      highlightGraphic.setAttributes(evt.graphic.attributes);
      map.graphics.add(highlightGraphic);

      var srcAttr = config.map.area.src;
      var areaId = evt.graphic.attributes[srcAttr];

      var dstAttr = config.map.area.dst;
      var chartRows  = rows.filter(function(e) {
        return e[dstAttr] === areaId;
      });

      // no data
      if (chartRows.length === 0) {
        return;
      }

      // sample row
      var row = chartRows[0];

      open({
        config: config,
        area: row,
        rows: chartRows,
        indicator: indicator,
        pageX: evt.pageX,
        pageY: evt.pageY,
        show: {
          chart: eval(sprintf(config.expression.showChart, {row:row}))
        }
      });
    });
  }

  function open(opts) {
    if (vm !== null) {
      vm.$destroy();
    }

    wrapper.style.display = 'block';

    vm = new Vue({
      el: wrapper,
      template: template,
      replace: false,
      data: opts,
      filters: {
        lang: function(key) {
          return window.app.lang[key];
        }
      }
    });

    var pos = positioning({
      x: opts.pageX,
      y: opts.pageY,
      width: $(wrapper).width(),
      height: $(wrapper).height()
    });

    $(wrapper).css(pos);

    if(opts.show.chart) {
      var chartOpts = indicatorChart.buildOpts({
        indicator: opts.indicator,
        rows: opts.rows,
        opts: {
          chart: {
            type: config.hover.chart
          }
        }
      });

      chartOpts.chart = chartOpts.chart || {};
      chartOpts.chart.renderTo = wrapper.querySelector('.chart');
      new Highcharts.Chart(chartOpts);
    }
  }

  function close(map) {
    map.graphics.clear();
    wrapper.style.display = 'none';
  }

  function positioning(args) {
    var x = args.x;
    var y = args.y;
    var width = args.width;
    var height = args.height;

    var rHeight = $(window).height();
    var rWidth = $(window).width();

    var top = null;
    var right = null;
    var bottom = null;
    var left = null;

    var pad = 25;

    if (x + width + (2*pad) > rWidth) {
      right = pad;
    } else {
      left = x + pad;
    }

    if (y - height > 2 * pad) {
      bottom = rHeight - y + pad;
      if (left !== null) {
        left = Math.max(left - pad - (width/2), pad);
      }
    } else {
      top = pad;
      if (right !== null) {
        right = rWidth - x + pad;
      }
    }

    top = top? top+'px':'auto';
    right = right? right+'px':'auto';
    bottom = bottom? bottom+'px':'auto';
    left = left? left+'px':'auto';

    return {
      top: top,
      right: right,
      bottom: bottom,
      left: left
    };
  }

  window.app.modules['esri-map'].then(function(emod) {
    window.app.modules['indicator'].then(function(imod) {
      init({
        esri: emod.esri,
        map: emod.map,
        indicator: imod.indicator,
        rows: imod.rows
      });
    });
  });

}());
