(function () {
    var React = require("react");
    require('./ComponentPalette.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');
    var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
    var ComponentPreviewer = require('../partComponents/ComponentPreviewer.jsx');

    var ComponentPalette = React.createClass({
        mixins: [
            require('../reactMixin/EventDistributor.js'),
            require('./mixins/WidthRuler.js')],

        componentDidMount(){
            this.refs['ComponentPreviewer'].displayComponent( InputBoxWithSelector, "reactClass");
        },

        render() {
            var wide = false;
            var rootClasses = ['ComponentPalette', 'black', this.getMySizeClass()];

            return (
                <div className={rootClasses.join(' ')}>
                    <div className='wrapper'>
                        <div className='head'>
                            ComponentPalette
                        </div>
                        <div className='body'>
                            <div className='previewer-area'>
                                <ComponentPreviewer width="100%" height="100%" ref="ComponentPreviewer"/>
                            </div>
                        </div>
                        <div className='foot'>

                        </div>
                    </div>
                </div>
            );
        }
    });

    module.exports = ComponentPalette;
})();
