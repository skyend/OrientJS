var _ = function(mountElement, resourceUrl, navigator) {

  this.mountElement = mountElement;
  this.vController = null;

  this.eventResponser = null;
  this.viewer = {
    "element": null
  };


  this.mount = function() {
    var EventResponser = require('./EventResponser');
    this.eventResponser = new EventResponser(this);

    this.viewer.element = document.createElement("iframe");
    this.viewer.element.setAttribute("id", "viewer");
    mountElement.appendChild(this.viewer.element);

  };


  this.documentLoad = function() {

    var editor = this;
    this.viewer.element.addEventListener("load", function(event) {
      var contentDocument = this.contentDocument;
      require("bundle?lazy!../../virtualdom/VDomController")(function(Controller) {
        editor.vController = new Controller();
        editor.documentLoadComplate();
      });

    });
    this.viewer.element.src = resourceUrl;
  };

  this.documentLoadComplate = function() {
    var contentDocument = this.viewer.element.contentDocument;
    this.vController.createVRoot(contentDocument.querySelectorAll('body').item(0));
    navigator.setState(this.vController.vroot.export());

    this.eventResponser.eventBind();
  };

  this.mount();
  this.documentLoad();

};
module.exports = _;