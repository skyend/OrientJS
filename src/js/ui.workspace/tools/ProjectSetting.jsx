(function () {
  var React = require("react");
  require('./ProjectSetting.less');

  var BasicButton = require('../partComponents/BasicButton.jsx');
  var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

  var ProjectSetting = React.createClass({
    mixins: [
      require('../reactMixin/EventDistributor.js'),
      require('./mixins/WidthRuler.js')],


    getInitialState(){
      return {meta: {}};
    },

    componentDidMount(){
      this.emit("NeedProjectMeta", {});
    },

    render() {
      var wide = false;
      var rootClasses = ['ProjectSetting', 'white', this.getMySizeClass()];

      return (
        <div className={rootClasses.join(' ')}>
          <div className='wrapper'>
            <div className='head'>
              Project Settings
            </div>
            <div className='body'>
              <div className='row'>
                <div className='column'>
                  <div className='title'>
                    Project Name
                  </div>
                  <div className='field'>
                    { this.state.meta.ProjectName }
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='column'>
                  <div className='title'>
                    Service Key
                  </div>
                  <div className='field'>
                    { this.state.meta.ServiceKey }
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='column'>
                  <div className='title'>
                    Project Mode
                  </div>
                  <div className='input'>
                    <InputBoxWithSelector selectorItems={['Develop', 'Product']} dontEnter={true}
                                          color={'red'}/>
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
