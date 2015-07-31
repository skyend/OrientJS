(function () {
    var React = require("react");
    require('./ProjectSetting.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');

    var ProjectSetting = React.createClass({
        mixins: [require('../reactMixin/EventDistributor.js')],


        render() {
            var wide = false;
            var rootClasses = ['ProjectSetting', 'white'];

            if( this.props.width > 210 ){
                rootClasses.push('wide');
            }

            return (
                <div className={rootClasses.join(' ')}>
                    <div className='wrapper'>

                    </div>
                </div>
            );
        }
    });

    module.exports = ProjectSetting;
})();
