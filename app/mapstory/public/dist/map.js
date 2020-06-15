/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	__webpack_require__(218).then(function (context) {
	  window.app.tellReady();
	  $(document).on('click', window.app.tellClicked);

	  __webpack_require__(222)(context);

	  var modules = context.config.modules;
	  modules.forEach(function (id) {
	    loadModule(id, context);
	  });
	});

	function loadModule(id, context) {
	  switch (id) {
	    case 'map-hover':
	      return __webpack_require__(223)(context);
	    case 'map-click-main':
	      return __webpack_require__(224)(context);
	    case 'map-click-error':
	      return __webpack_require__(225)(context);
	    default:
	      throw new Error('Unknown module: ', id);
	  }
	}

/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	
	'use strict';

	var defers = {
	  indicator: $.Deferred(),
	  rows: $.Deferred()
	};

	function fetchIndicator(config) {
	  if (!config.indicator) {
	    defers.indicator.resolve(null);
	    return;
	  }
	  var id = config.indicator.id;
	  $.getJSON(config.indicator.path).then(function (iconfig) {
	    var indicator = iconfig.indicators.filter(function (e) {
	      return e.id === id;
	    })[0];
	    defers.indicator.resolve(indicator);
	  });
	}

	function fetchInidicatorRows(config) {
	  if (!config.dataset) {
	    defers.rows.resolve(null);
	    return;
	  }
	  var dataset = config.dataset;
	  var query = '$.root[?(@.indicatorId === "%(indicatorId)s")]';
	  var params = {
	    indicatorId: config.indicator.id
	  };
	  $.getJSON('/dataset/json', { q: JSON.stringify({
	      dataset: dataset,
	      query: query,
	      params: params
	    }) }).then(function (rows) {
	    return defers.rows.resolve(rows);
	  });
	}

	// initialize
	function init() {
	  var d = $.Deferred();
	  var loads = {
	    config: __webpack_require__(219),
	    map: __webpack_require__(220),
	    esri: __webpack_require__(221),
	    indicator: defers.indicator,
	    rows: defers.rows
	  };

	  var context = {};
	  _.each(loads, function (v, key) {
	    v.then(function (value) {
	      context[key] = value;
	    });
	  });
	  $.when.apply(null, _.values(loads)).then(function () {
	    return d.resolve(context);
	  });
	  return d.promise();
	}

	__webpack_require__(219).then(function (config) {
	  fetchIndicator(config);
	  fetchInidicatorRows(config);
	});

	module.exports = init();

/***/ },

/***/ 219:
/***/ function(module, exports) {

	
	'use strict';

	function load() {
	  var d = $.Deferred();

	  var paths = window.app.params.config;
	  if (typeof paths === 'string') {
	    paths = [paths];
	  }

	  var results = {};
	  $.when.apply(null, paths.map(function (p, i) {
	    return $.getJSON(p).then(function (cfg) {
	      results[i] = cfg;
	    });
	  })).then(function () {
	    var configs = paths.map(function (e, i) {
	      return results[i];
	    });
	    var config = $.extend.apply(null, [true, {}].concat(configs));
	    d.resolve(config);
	  });
	  return d.promise();
	}

	module.exports = load();

/***/ },

/***/ 220:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d = $.Deferred();

	function init(esri, config) {
	  var extent = config.map.extent;
	  // use standard lat lon on extent
	  extent.spatialReference = { 'wkid': 4326 };

	  var map = new esri.Map('map_container', {
	    basemap: 'topo',
	    extent: new esri.Extent(extent)
	  });

	  var layer = null;
	  if (config.map.url) {
	    layer = new esri.FeatureLayer(config.map.url, {
	      id: 'main',
	      outFields: resolveOutFields(config),
	      mode: esri.FeatureLayer.MODE_ONDEMAND
	    });
	  }

	  map.on('load', function () {
	    map.disableScrollWheelZoom();
	    map.graphics.enableMouseEvents();
	    if (layer) {
	      map.addLayer(layer);
	    }

	    d.resolve(map);
	  });
	}

	function resolveOutFields(config) {
	  if (!config.map.area) {
	    return [];
	  }
	  return [config.map.area.src];
	}

	// initialize
	$.when(__webpack_require__(221), __webpack_require__(219)).then(init);

	module.exports = d.promise();

/***/ },

/***/ 221:
/***/ function(module, exports) {

	
	'use strict';

	function load() {
	  var d = $.Deferred();
	  // prevent clash with webpack's require
	  window['require'](['esri/config', 'esri/map', 'esri/layers/FeatureLayer', 'esri/graphic', 'esri/Color', 'esri/symbols/SimpleLineSymbol', 'esri/symbols/SimpleFillSymbol', 'esri/geometry/Extent', 'dojo/domReady!'], function () {
	    var attrs = ['config', 'Map', 'FeatureLayer', 'Graphic', 'Color', 'SimpleLineSymbol', 'SimpleFillSymbol', 'Extent'];
	    var esri = {};
	    var args = arguments;
	    attrs.forEach(function (attr, i) {
	      esri[attr] = args[i];
	    });

	    // extends default timeout, esri is  slow in Indonesia
	    esri.config.defaults.io.timeout = 1000 * 1000 * 1000;

	    d.resolve(esri);
	  });
	  return d.promise();
	};

	module.exports = load();

/***/ },

/***/ 222:
/***/ function(module, exports) {

	'use strict';

	function init(_ref) {
	  var template = _ref.template;
	  var _lang = _ref.lang;
	  var config = _ref.config;
	  var indicator = _ref.indicator;
	  var rows = _ref.rows;

	  var header = new Ractive({
	    el: '#ractive_header',
	    template: template,
	    data: {
	      show: {
	        download: !!config.table,
	        tableview: !!config.table,
	        legend: !!config.legend
	      },
	      lang: function lang(id) {
	        return _lang[id];
	      }
	    }
	  });

	  header.on('download.click', function (e) {
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
	  });

	  header.on('tableview.click', function (e) {
	    post({
	      action: 'popup.map.show',
	      rows: resolveRows(rows, config),
	      columns: resolveColumns(config.table.columns, indicator, ['title', 'width']),
	      order: config.table.order
	    });
	  });

	  var toggled = false;
	  header.on('legend.click', function (e) {
	    toggled = !toggled;
	    post({
	      action: 'popup.legend.show',
	      toggle: toggled,
	      legend: config.legend,
	      title: config.title
	    });
	  });
	}

	function post(data) {
	  window.parent.postMessage(data, document.URL);
	}

	function evaluate(expression, params) {
	  return eval(sprintf(expression, params));
	}

	function resolveRows(rows, config) {
	  var columns = config.table.columns;
	  var expr = config.expression.showRow;
	  rows = rows.filter(function (r) {
	    return evaluate(expr, { row: r });
	  });
	  rows = rows.filter(function (r) {
	    return r.year == resolveMaxYear(rows);
	  });
	  return rows.map(function (r) {
	    return columns.map(function (c) {
	      return r[c.attr];
	    });
	  });
	}

	function resolveMaxYear(rows) {
	  return rows.reduce(function (max, r) {
	    var v = r.year;
	    return max === null || v > max ? v : max;
	  }, null);
	}

	function resolveColumns(columns, indicator, picks) {
	  return columns.map(function (column) {
	    var ext = _.extend({}, column, {
	      title: sprintf(column.title, { indicator: indicator })
	    });
	    return _.pick(ext, picks);
	  });
	}

	module.exports = function (context) {
	  var template = null;
	  var lang = null;
	  $.when($.get('./header.html').then(function (res) {
	    template = res;
	  }), $.getJSON('./header.lang.json').then(function (res) {
	    lang = res;
	  })).then(function () {
	    init($.extend({}, { template: template, lang: lang }, context));
	  });
	};

/***/ },

/***/ 223:
/***/ function(module, exports) {

	
	'use strict';

	function init(_ref) {
	  var config = _ref.config;
	  var esri = _ref.esri;
	  var indicator = _ref.indicator;
	  var map = _ref.map;
	  var rows = _ref.rows;

	  var layer = map.getLayer('main');
	  var highlightSymbol = new esri.SimpleFillSymbol(esri.SimpleFillSymbol.STYLE_SOLID, new esri.SimpleLineSymbol(esri.SimpleLineSymbol.STYLE_SOLID, new esri.Color([255, 255, 255]), 2), new esri.Color([125, 125, 125, 0.35]));

	  map.graphics.on('mouse-out', function (evt) {
	    close(map);
	  });

	  map.on('mouse-over', function (evt) {
	    // base map hovered
	    // FIXME: using static id for now
	    if (evt.target.id === 'map_container_gc') {
	      close(map);
	    }
	  });

	  map.on('mouse-drag', function (evt) {
	    close(map);
	  });

	  layer.on('mouse-over', function (evt) {
	    map.graphics.clear();
	    var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol);
	    highlightGraphic.setAttributes(evt.graphic.attributes);
	    map.graphics.add(highlightGraphic);

	    var srcAttr = config.map.area.src;
	    var areaId = evt.graphic.attributes[srcAttr];

	    var dstAttr = config.map.area.dst;
	    var chartRows = rows.filter(function (e) {
	      return e[dstAttr] === areaId;
	    });

	    // no data
	    if (chartRows.length === 0) {
	      return;
	    }

	    // sample row
	    var row = chartRows[0];

	    post({
	      action: 'area.hover',
	      toggle: true,
	      area: row,
	      rows: chartRows,
	      indicator: indicator,
	      position: {
	        x: evt.pageX,
	        y: evt.pageY
	      },
	      show: {
	        chart: eval(sprintf(config.expression.showChart, { row: row }))
	      }
	    });
	  });
	}

	function post(data) {
	  window.parent.postMessage(data, document.URL);
	}

	function close(map) {
	  map.graphics.clear();
	  post({
	    action: 'area.hover',
	    toggle: false
	  });
	}

	module.exports = init;

/***/ },

/***/ 224:
/***/ function(module, exports) {

	'use strict';

	function init(_ref) {
	  var config = _ref.config;
	  var map = _ref.map;
	  var indicator = _ref.indicator;

	  map.graphics.on('click', function (evt) {
	    var srcAttr = config.map.area.src;
	    var areaId = evt.graphic.attributes[srcAttr];

	    fetchData(config, areaId).then(function (_ref2) {
	      var rows = _ref2.rows;
	      var indicators = _ref2.indicators;
	      var priority = _ref2.priority;

	      if (rows.length === 0 || !rows[0].isRural) {
	        // don't show if no data or non rural area
	        return;
	      }
	      post({
	        action: 'popup.area.main',
	        rows: rows,
	        indicators: indicators,
	        indicator: indicator,
	        priority: priority
	      });
	      closeHover(map);
	    });
	  });
	}

	function post(data) {
	  window.parent.postMessage(data, document.URL);
	}

	function closeHover(map) {
	  map.graphics.clear();
	  post({
	    action: 'area.hover',
	    toggle: false
	  });
	}

	function fetchData(config, areaId) {
	  var d = $.Deferred();
	  var result = {};
	  var q = {
	    dataset: config.dataset,
	    query: '$.root[?(@.%(attr)s === %(areaId)i)]',
	    params: {
	      attr: config.map.area.dst,
	      areaId: areaId
	    }
	  };
	  var d1 = $.getJSON('/dataset/json', { q: JSON.stringify(q) }).then(function (rows) {
	    result.rows = rows;
	  });

	  var d2 = $.getJSON(config.indicator.path).then(function (res) {
	    result.indicators = res.indicators;
	  });

	  var d3 = $.getJSON('/dataset/json', { q: JSON.stringify({
	      dataset: config.dataset,
	      query: '$.root[?(@.indicatorId === "PRIO" && @.%(dstAttr)s === %(areaId)i)]',
	      params: {
	        dstAttr: config.map.area.dst,
	        areaId: areaId
	      }
	    }) }).then(function (rows) {
	    result.priority = rows.reduce(function (memo, r) {
	      return memo.year === null || r.year > memo.year ? r : memo;
	    }, { year: null, value: null }).value;
	  });

	  $.when(d1, d2, d3).then(function () {
	    d.resolve(result);
	  });
	  return d.promise();
	}

	module.exports = init;

/***/ },

/***/ 225:
/***/ function(module, exports) {

	'use strict';

	function init(_ref) {
	  var config = _ref.config;
	  var map = _ref.map;

	  var handler = function handler() {
	    return post({
	      action: 'popup.error',
	      content: config.messages['popup.click']
	    });
	  };
	  map.on('click', handler);
	}

	function post(data) {
	  window.parent.postMessage(data, document.URL);
	}

	module.exports = init;

/***/ }

/******/ });