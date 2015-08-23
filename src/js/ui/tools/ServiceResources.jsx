(function () {
    var React = require("react");
    require('./ServiceResources.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');
    var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

    var ProjectSetting = React.createClass({
        mixins: [
            require('../reactMixin/EventDistributor.js'),
            require('./mixins/WidthRuler.js')],


        getInitialState(){
            return {pageMetaList:[], documentMetaList:[]};
        },

        renderPageItem( _pageMeta ){
          var iconClass = 'fa-file-o';

          var self = this;
          var click = function(){
            self.emit("BringPageContext", {
              pageMeta : _pageMeta,
              iconClass: iconClass
            });
          };


          return (
            <li onClick={click}>
              <i className={'fa '+iconClass}></i> <span> { _pageMeta.name } </span>
            </li>
          )
        },

        renderDocumentItem( _documentMeta ){
          var iconClass;

          if( _documentMeta.purpose === 'layout' ){
            iconClass = 'fa-file-pdf-o'
          } else if ( _documentMeta.purpose === 'contents' ){
            iconClass = "fa-file-text"
          }

          var self = this;
          var click = function(){
            self.emit("BringDocumentContext", {
              documentMeta : _documentMeta,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;
          
          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === 'document' ){
              if( this.state.runningContext.documentID ==  _documentMeta.id ){
                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={ click } className={contextIsRunning? 'running':''}>
              <i className={'fa ' + iconClass}></i> <span> { _documentMeta.name } </span>
            </li>
          )
        },

        renderPageList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-file-o'></i> Pages <span className='temp-button'> <i className='fa fa-plus'></i> </span>
              </label>
              <ul>
                { this.state.pageMetaList.map(this.renderPageItem) }
              </ul>
            </div>
          )
        },

        renderDocumentList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-file'></i> Documents <span className='temp-button'> <i className='fa fa-plus'></i> </span>
              </label>
              <ul>
                { this.state.documentMetaList.map(this.renderDocumentItem) }
              </ul>
            </div>
          )
        },

        componentDidMount(){
            this.emit("NeedServiceResourcesMeta",{});
        },

        render() {
            var wide = false;
            var rootClasses = ['ServiceResources', this.props.config.theme,  this.getMySizeClass()];


            console.log('STAET CHECK', this.state);
            return (
                <div className={rootClasses.join(' ')}>
                    <div className='wrapper'>
                      { this.renderPageList() }
                      { this.renderDocumentList() }
                    </div>
                </div>
            );
        }
    });

    module.exports = ProjectSetting;
})();
