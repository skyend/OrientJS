(function () {
    var React = require("react");
    require('./BuilderSetting.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');
    var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

    var BuilderSetting = React.createClass({
        mixins: [require('../reactMixin/EventDistributor.js')],


        render() {
            var wide = false;
            var rootClasses = ['BuilderSetting', 'white'];

            if( this.props.width <= 210 ){
                rootClasses.push('narrow-width');
            } else {
                rootClasses.push('wide-width');
            }

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
                                        <InputBoxWithSelector selectorItems={['Develop', 'Product']} dontEnter={true}/>
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

    module.exports = BuilderSetting;
})();
