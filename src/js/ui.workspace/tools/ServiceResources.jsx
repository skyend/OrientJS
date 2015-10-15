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
            return {
              documentList:[],
              pageList:[],
              apisourceList:[],
              pageMetaList:[], // x
              documentMetaList:[], // x
              apiSourceMetaList:[] // x
            };
        },

        addAPISource(){
          // 클릭시에 모달을 뛰어 정보를 입력받고 ok를 누르면 APISource를 추가하는 과정을 처리한다.
          //

          this.emit("RequestAttachTool", {
            "toolKey": "ICafeNodeExplorer",
            "where":"ModalWindow"
          });
        },

        documentDragEnd( _e){
          console.log( 'drag end document', _e.nativeEvent);
        },
        documentDragOver( _e){
          console.log( 'drag over document', _e.nativeEvent);
        },

        clickNewPage(){

          this.emit("RequestAttachTool", {
            "toolKey": "PageCUForm",
            "where":"ModalWindow"
          });
        },

        clickNewDocument(){

          this.emit("RequestAttachTool", {
            "toolKey": "DocumentCUForm",
            "where":"ModalWindow"
          });
        },

        renderAPISourceItem( _apiSource ){
          var iconClass = 'fa-database';

          var self = this;
          var click = function(){
            self.emit("BringApiSourceContext", {
              apiSource : _apiSource,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;
          //console.log("API context ", this.state.runningContext, _apiSourceMeta);

          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === "apiSource" ){
              if( this.state.runningContext.apiSourceID ==  _apiSource._id ){

                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              <i className={'fa '+iconClass}></i> <span> { _apiSource.title } </span>
            </li>
          )
        },

        renderPageItem( _page ){
          var iconClass = 'fa-newspaper-o';

          var self = this;
          var click = function(){
            self.emit("BringPageContext", {
              page : _page,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;
          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === 'page' ){
              if( this.state.runningContext.pageID ==  _page._id ){
                contextIsRunning = true;
              }
            }
          }


          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              <i className={'fa '+iconClass}></i> <span> { _page.title } </span>
            </li>
          )
        },

        renderDocumentItem( _document ){
          var iconClass;

          if( _document.type === 'layout' ){
            iconClass = 'fa-file-pdf-o'
          } else if ( _document.type === 'contents' ){
            iconClass = "fa-file-text-o"
          }

          var self = this;
          var click = function(){
            self.emit("BringDocumentContext", {
              document : _document,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;

          if( typeof this.state.runningContext === 'object' ){
            if( this.state.runningContext.contextType === 'document' ){
              if( this.state.runningContext.documentID ==  _document._id ){
                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={ click } className={contextIsRunning? 'running':''} draggable={true} onDragEnd={this.documentDragEnd}  onDragOver={this.documentDragOver}>
              <i className={'fa ' + iconClass}></i> <span> { _document.title } </span>
            </li>
          )
        },

        renderPageList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-file-o'></i> Pages <span className='add-button'> <i className='fa fa-plus'  onClick={this.clickNewPage}></i> </span>
              </label>
              <ul>
                { this.state.pageList.map(this.renderPageItem) }
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
                { this.state.documentList.map(this.renderDocumentItem) }
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
                { this.state.apisourceList.map(this.renderAPISourceItem) }
              </ul>
            </div>
          )
        },

        componentDidUpdate(){
          //console.log('updated', this.state);
        },

        componentDidMountByRoot(){
          console.log("ROOT Mounted");
        },

        componentDidMount(){
          var self = this;
          //this.emit("NeedServiceResourcesMeta",{});
          //setTimeout(function(){
            self.emit("NeedDocumentList");
            self.emit("NeedPageList");
            self.emit("UpdateAPISourceList");
          //},100);
        },

        render() {
          console.log(this.state);
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
