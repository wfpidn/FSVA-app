
(function(){

  var config = window.app.config;

  window.app.modules['esri-map'].then(function(mod) {
    var map = mod.map;
    map.on('click', function(evt) {
      window.app.post('popup.show', {
        width: '400px',
        template: '<div>{{{message}}}</div>',
        data: {
          message: config.messages['popup.click']
        }
      });
    });
  });

}());
