(function(){
    var App = require('./builder.App.js');

    window.onload = function(){
        var app = new App();
				app.initUI();
			
        window.app = app;
    };
})();