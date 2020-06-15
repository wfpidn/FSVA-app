
(function() {

  var $ = window.app.libs.jQuery;
  var _ = window.app.libs.lodash;
  var config = window.app.config;

  function fetchIndicator() {
    if (!config.indicator) {
      return Promise.resolve(null);
    }
    var id = config.indicator.id;
    return $.getJSON(config.indicator.path)
      .then(function(data){
        var indicators = data.indicators;
        var indicator = _.find(data.indicators, {id: id});
        return {
          indicators: indicators,
          indicator: indicator
        };
      });
  }

  function fetchInidicatorRows() {
    if (!config.dataset) {
      return Promise.resolve([]);
    }
    var dataset = config.dataset;
    var query = '$.root[?(@.indicatorId === "%(indicatorId)s")]';
    var params = {
      indicatorId: config.indicator.id
    };
    var q = {
      dataset: dataset,
      query: query,
      params: params
    };
    return $.getJSON('/dataset/json', {
      q: JSON.stringify(q)
    }).then(function(data) { return data; });
  }

  $.when(fetchIndicator(), fetchInidicatorRows())
    .then(function(r1, r2) {
      window.app.modules['indicator'].resolve({
        indicators: r1.indicators,
        indicator: r1.indicator,
        rows: r2
      });
    });

}());
