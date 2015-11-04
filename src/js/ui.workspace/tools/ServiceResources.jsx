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
              runningContext: null,
              iceHost:'',
              documentList:[],
              pageList:[],
              apisourceList:[],
              apiinterfaceList:[],
              pageMetaList:[], // x
              documentMetaList:[], // x
              apiSourceMetaList:[] // x
            };
        },

        clickAddAPISource(){
          // 클릭시에 모달을 뛰어 정보를 입력받고 ok를 누르면 APISource를 추가하는 과정을 처리한다.
          //

          this.emit("RequestAttachTool", {
            "toolKey": "ICafeNodeExplorer",
            "where":"ModalWindow",
            "params":{ "holdnodetypes": this.state.apisourceList}
          });
        },

        clickAddAPIInterface(){
          this.emit("RequestAttachTool", {
            "toolKey": "APIInterfaceCreateForm",
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

        renderAPIInterfaceItem( _apiInterface ){
          var iconClass = 'fa-plug';

          var self = this;
          var click = function(){
            self.emit("BringApiInterfaceContext", {
              apiInterface : _apiInterface,
              iconClass: iconClass
            });
          };

          var contextIsRunning = false;
          //console.log("API context ", this.state.runningContext, _apiSourceMeta);

          if( this.state.runningContext !== null ){
            if( this.state.runningContext.contextType === "apiInterface" ){
              if( this.state.runningContext.apiInterfaceID ==  _apiInterface._id ){

                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              <i className={'fa '+iconClass}></i> <span> { _apiInterface.title } </span>
            </li>
          )
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

          if( this.state.runningContext !== null ){
            if( this.state.runningContext.contextType === "apiSource" ){
              if( this.state.runningContext.apiSourceID ==  _apiSource._id ){

                contextIsRunning = true;
              }
            }
          }

          return (
            <li onClick={click} className={contextIsRunning? 'running':''}>
              { _apiSource.icon !== ''? <img src={this.state.iceHost+'/icon/'+_apiSource.icon}/>:<i className={'fa '+iconClass}></i>} <span> { _apiSource.title } </span>
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
          if( this.state.runningContext !== null ){
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

          if( this.state.runningContext !== null ){
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
                <i className='fa fa-file-text-o'></i> Articles <span className='add-button'> <i className='fa fa-plus' onClick={this.clickNewDocument}></i> </span>
              </label>
              <ul>
                { this.state.documentList.map(this.renderDocumentItem) }
              </ul>
            </div>
          )
        },

        renderAPIInterfaceList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-plug'></i> API Interfaces
                <span className='add-button' onClick={this.clickAddAPIInterface}>
                  <i className='fa fa-plus'></i>
                </span>
              </label>
              <ul>
                { this.state.apiinterfaceList.map(this.renderAPIInterfaceItem) }
              </ul>
            </div>
          )
        },

        renderAPISourceList(){

          return (
            <div className="resourceList">
              <label className='listLabel'>
                <i className='fa fa-database'></i> ICafe API Sources
                <span className='add-button' onClick={this.clickAddAPISource}>
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

          this.emit("NeedICEHost");
          this.emit("NeedDocumentList");
          this.emit("NeedPageList");
          this.emit("UpdateAPISourceList");
          this.emit("UpdateAPIInterfaceList");
        },

        render() {
            var wide = false;
            var rootClasses = ['ServiceResources', this.props.config.theme,  this.getMySizeClass()];



            return (
                <div className={rootClasses.join(' ')}>
                    <div className='list-wrapper'>
                      { this.renderPageList() }
                      { this.renderDocumentList() }
                      { this.renderAPIInterfaceList() }
                      { this.renderAPISourceList() }
                    </div>
                </div>
            );
        }
    });

    module.exports = ProjectSetting;
})();
