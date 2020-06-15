
// module
(function() {

  var $ = window.app.libs.jQuery;
  var config = window.app.config;

  function load() {
    var d = $.Deferred();
    // esri require
    window['require']([
      'esri/config',
      'esri/map',
      'esri/layers/FeatureLayer',
      'esri/graphic',
      'esri/Color',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/geometry/Extent',
      'dojo/domReady!'
    ], function() {
      var attrs = [
        'config',
        'Map',
        'FeatureLayer',
        'Graphic',
        'Color',
        'SimpleLineSymbol',
        'SimpleFillSymbol',
        'Extent'
      ];
      var esri = {};
      var args = arguments;
      attrs.forEach(function(attr, i) {
        esri[attr] = args[i];
      });

      // extends default timeout, esri is  slow in Indonesia
      esri.config.defaults.io.timeout = 1000 * 1000 * 1000;

      d.resolve(esri);
    });
    return d.promise();
  }

  function resolveOutFields(config) {
    if (!config.map.area) {
      return [];
    }
    return [config.map.area.src];
  }

  load().then(function(esri) {
    var extent = config.map.extent;
    // use standard lat lon on extent
    extent.spatialReference = {'wkid':4326};

    var map = new esri.Map('map-container', {
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

    map.on('load', function() {

      // uncover
      $('#map-cover').fadeOut(300);

      map.disableScrollWheelZoom();
      map.graphics.enableMouseEvents();
      if (layer) {
        map.addLayer(layer);
      }

      window.app.modules['esri-map'].resolve({
        esri: esri,
        map: map
      });
    });
  });

}());
