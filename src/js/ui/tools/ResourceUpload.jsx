
var React = require("react");
require('./ResourceUpload.less');

var ResourceUpload = React.createClass({
    mixins: [
        require('../reactMixin/EventDistributor.js'),
        require('./mixins/WidthRuler.js')],

    getInitialState(){
        return {
        };
    },

    render() {
        return (
            <div>
            </div>
        );
    }
});

module.exports = ResourceUpload;
