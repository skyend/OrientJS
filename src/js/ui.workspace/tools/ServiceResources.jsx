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
            return {pageMetaList:[], documentMetaList:[], apiSourceMetaList:[]};
        },

        addAPISource(){
          // 클릭시에 모달을 뛰어 정보를 입력받고 ok를 누르면 APISource를 추가하는 과정을 처리한다.
          //
        },

        clickNewDocument(){
          console.log('why');
          this.emit("RequestAttachTool", {
            "toolKey": "DocumentCUForm",
            "where":"ModalWindow"
          });
        },

        renderAPISourceItem( _apiSourceMeta ){
          var iconClass = 'fa-database';

          var self = this;
          var click = function(){
            self.emit("BringApiSourceContext", {
              apiSourceMeta : _apiSourceMeta,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;
          //console.log("API context ", this.state.runningContext, _apiSourceMeta);

          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === "apiSource" ){
              if( this.state.runningContext.apiSourceID ==  _apiSourceMeta.id ){

                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              <i className={'fa '+iconClass}></i> <span> { _apiSourceMeta.title } </span>
            </li>
          )
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

          var contextIsRunning = false;
          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === 'page' ){
              if( this.state.runningContext.pageID ==  _pageMeta.id ){
                contextIsRunning = true;
              }
            }
          }


          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              <i className={'fa '+iconClass}></i> <span> { _pageMeta.title } </span>
            </li>
          )
        },

        renderDocumentItem( _documentMeta ){
          var iconClass;

          if( _documentMeta.purpose === 'layout' ){
            iconClass = 'fa-file-pdf-o'
          } else if ( _documentMeta.purpose === 'contents' ){
            iconClass = "fa-file-text-o"
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
              if( this.state.runningContext.documentID ==  _documentMeta.idx ){
                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={ click } className={contextIsRunning? 'running':''}>
              <i className={'fa ' + iconClass}></i> <span> { _documentMeta.title } </span>
            </li>
          )
        },

        renderPageList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-file-o'></i> Pages <span className='add-button'> <i className='fa fa-plus'></i> </span>
              </label>
              <ul>
                { this.state.pageMetaList.map(this.renderPageItem) }
              </ul>
            </div>
          )
        },

        renderAPISourceList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-database'></i> API Sources
                <span className='add-button' onClick={this.addAPISource}>
                  <i className='fa fa-plus'></i>
                </span>
              </label>
              <ul>
                { this.state.apiSourceMetaList.map(this.renderAPISourceItem) }
              </ul>
            </div>
          )
        },

        renderDocumentList(){



          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-file-text-o'></i> Documents <span className='add-button'> <i className='fa fa-plus' onClick={this.clickNewDocument}></i> </span>
              </label>
              <ul>
                { this.state.documentMetaList.map(this.renderDocumentItem) }
              </ul>
            </div>
          )
        },

        componentDidUpdate(){
          //console.log('updated', this.state);
        },

        componentDidMount(){
            this.emit("NeedServiceResourcesMeta",{});
        },

        render() {
            var wide = false;
            var rootClasses = ['ServiceResources', this.props.config.theme,  this.getMySizeClass()];



            return (
                <div className={rootClasses.join(' ')}>
                    <div className='list-wrapper'>
                      { this.renderPageList() }
                      { this.renderDocumentList() }
                      { this.renderAPISourceList() }
                    </div>
                </div>
            );
        }
    });

    module.exports = ProjectSetting;
})();
