var _ = function () {

    this.vroot = null;

    this.setVRoot = function (vroot) {
        this.vroot = vroot;
        console.log(this.vroot);
    }

    this.createVRoot = function (htmlElement) {
        this.setVRoot(require('./VRoot').importHtmlElement(htmlElement))
    }
};

module.exports = _;