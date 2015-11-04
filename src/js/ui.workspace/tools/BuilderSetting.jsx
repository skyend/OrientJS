(function() {
  var React = require("react");
  require('./BuilderSetting.less');

  var BasicButton = require('../partComponents/BasicButton.jsx');
  var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

  var BuilderSetting = React.createClass({
    mixins: [
      require('../reactMixin/EventDistributor.js'), require('./mixins/WidthRuler.js')
    ],

    render () {
      var wide = false;
      var rootClasses = [
        'BuilderSetting', 'white', this.getMySizeClass()
      ];

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
                    <InputBoxWithSelector selectorItems={[
                      'Develop', 'Product'
                    ]} dontEnter={true} color={'red'}/>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='setting'>
                  <div className='title'>
                    Accept Log level
                  </div>
                  <div className='input'>
                    <InputBoxWithSelector selectorItems={[
                      'All', 'Fatal', 'Error', 'Warnings', 'Info', 'No Log'
                    ]} dontEnter={true} color={'red'}/>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='setting'>
                  <div className='title'>
                    Server
                  </div>
                  <div className='input'>
                    <InputBoxWithSelector selectorItems={[
                      'Develop', 'Product'
                    ]} dontEnter={false} color={'red'}/>
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
})
();
