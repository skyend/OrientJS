(function () {
    var React = require("react");
    require('./ProjectSetting.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');
    var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

    var ProjectSetting = React.createClass({
        mixins: [
            require('../reactMixin/EventDistributor.js'),
            require('./mixins/WidthRuler.js')],

        render() {
            var wide = false;
            var rootClasses = ['ProjectSetting', 'white',  this.getMySizeClass()];

            return (
                <div className={rootClasses.join(' ')}>
                    <div className='wrapper'>
                        <div className='head'>
                            Builder Settings
                        </div>
                        <div className='body'>
                            <div className='row'>
                                <div className='setting'>
                                    <div className='title'>
                                        Builder Mode
                                    </div>
                                    <div className='input'>
                                        <InputBoxWithSelector selectorItems={['Develop', 'Product']} dontEnter={true} color={'red'}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='foot'>
                            <BasicButton desc="Reset" color='error' size='small'/>
                            <BasicButton desc="Apply" color='primary' size='small'/>
                        </div>
                    </div>
                </div>
            );
        }
    });

    module.exports = ProjectSetting;
})();
