(function () {
  var React = require("react");
  require('./ServiceResources.less');

  var BasicButton = require('../partComponents/BasicButton.jsx');
  var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');

  var ProjectSetting = React.createClass({
    mixins: [
      require('../reactMixin/EventDistributor.js'),
      require('./mixins/WidthRuler.js')],

    getDefaultProps(){
      return {
        runningContext: null,
        documentList: null,
        pageList: null,
      };
    },

    getInitialState(){
      return {
        iceHost: '',
        apisourceList: null,
        apiinterfaceList: null,
        cssList:null,
        jsList:null,
        componentList:null,

        filterSet:new Set()
      };
    },

    clickAddAPISource(){
      // 클릭시에 모달을 뛰어 정보를 입력받고 ok를 누르면 APISource를 추가하는 과정을 처리한다.
      //
      let self = this;

      this.emit("RequestAttachTool", {
        "toolKey": "ICafeNodeExplorer",
        "where": "ModalWindow",
        "params": {
          "holdnodetypes": this.state.apisourceList,
          "success-notice": function(){
            self.emit("NeedAPISourceList");
          }
        }
      });
    },

    clickAddAPIInterface(){
      let self = this;

      this.emit("RequestAttachTool", {
        "toolKey": "APIInterfaceCreateForm",
        "where": "ModalWindow",
        "params": {
          "success-notice": function(){
            self.emit("NeedAPIInterfaceList");
          }
        }
      });
    },

    clickExportFragments(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'Fragment'
      });
    },

    clickExportPages(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'Page'
      });
    },

    clickExportCasecadeStyleSheets(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'CasecadeStyleSheet'
      });
    },

    clickExportJavascripts(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'Javascript'
      });
    },

    clickExportAPIInterfaces(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'APIInterfaces'
      });
    },

    clickExportAPISources(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'ICEAPISource'
      });
    },

    clickExportMashupAPIs(){
      this.emit("ShowServiceResourceCopyBoard", {
        resourceName: 'MashupAPI'
      });
    },



    documentDragEnd(_e){
      console.log('drag end document', _e.nativeEvent);
    },

    documentDragOver(_e){
      console.log('drag over document', _e.nativeEvent);
    },

    clickNewPage(){

      this.emit("RequestAttachTool", {
        "toolKey": "PageCUForm",
        "where": "ModalWindow"
      });
    },

    clickNewDocument(){
      console.log("new document");

      this.emit("RequestAttachTool", {
        "toolKey": "DocumentCUForm",
        "where": "ModalWindow"
      });
    },

    clickNewComponent(){
      console.log("new component");
      let self = this;
      this.emit("RequestAttachTool", {
        "toolKey": "ComponentCreateForm",
        "where": "ModalWindow",
        "params": {
          "success-notice": function(){
            self.emit("NeedComponentList");
          }
        }
      });
    },

    clickNewCSS(){
      let that = this;
      this.emit("RequestAttachTool", {
        "toolKey": "CSSCreate",
        "where": "ModalWindow",
        "params": {
          "success-notice": function(){
            that.emit("NeedCSSList");
          }
        }
      });
    },

    clickNewScript(){
      let that = this;

      this.emit("RequestAttachTool", {
        "toolKey": "JSCreate",
        "where": "ModalWindow",
        "params": {
          "success-notice": function(){
            that.emit("NeedJSList");
          }
        }
      });
    },

    renderAPIInterfaceItem(_apiInterface){
      var iconClass = 'fa-plug';

      var self = this;
      var click = function () {
        self.emit("BringApiInterfaceContext", {
          apiInterface: _apiInterface,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;
      //console.log("API context ", this.props.runningContext, _apiSourceMeta);

      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === "apiInterface") {
          if (this.props.runningContext.apiInterfaceID == _apiInterface._id) {

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

    renderICEAPISourceItem(_apiSource){
      var iconClass = 'fa-database';

      var self = this;
      var click = function () {
        self.emit("BringICEAPISourceContext", {
          apiSource: _apiSource,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;
      //console.log("API context ", this.props.runningContext, _apiSourceMeta);
      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === "apiSource") {
          if (this.props.runningContext.apiSourceID == _apiSource._id) {

            contextIsRunning = true;
          }
        }
      }

      return (
        <li onClick={click} className={contextIsRunning? 'running':''}>
          { _apiSource.icon !== '' ? <img src={this.state.iceHost+'/icon/'+_apiSource.icon}/> :
            <i className={'fa '+iconClass}></i>} <span> { _apiSource.title } </span>
        </li>
      )
    },

    renderPageItem(_page){
      var iconClass = 'fa-file-text';

      var self = this;
      var click = function () {
        self.emit("BringPageContext", {
          page: _page,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;
      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === 'page') {
          if (this.props.runningContext.pageID == _page._id) {
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

    renderDocumentItem(_document){
      var iconClass = 'fa-html5';

      var self = this;
      var click = function () {
        self.emit("BringDocumentContext", {
          document: _document,
          iconClass: iconClass
        });
      };

      var clickOption = function (_e) {
        _e.stopPropagation();

        self.emit("RequestAttachTool", {
          "toolKey": "FragmentSetting",
          "where": "ModalWindow",
          "params": {
            "success-notice": function(){
              self.emit("NeedDocumentList");
            },
            fragmentId: _document._id
          }
        });
      };


      var contextIsRunning = false;

      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === 'document') {
          if (this.props.runningContext.documentID == _document._id) {
            contextIsRunning = true;
          }
        }
      }

      return (
        <li onClick={ click } className={contextIsRunning? 'running':''} draggable={true}
            onDragEnd={this.documentDragEnd} onDragOver={this.documentDragOver}>
          <i className={'fa ' + iconClass}/>
          <span> { _document.title }</span>
          <div className='item-options'>
            <button className='option' onClick={clickOption}>
              <i className='fa fa-cog'/>
            </button>
          </div>
        </li>
      )
    },

    renderCSSItem(_css){
      var iconClass = 'fa-css3';

      var self = this;
      var click = function () {
        self.emit("BringCSSContext", {
          css: _css,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;

      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === 'css') {
          if (this.props.runningContext.cssID == _css._id) {
            contextIsRunning = true;
          }
        }
      }

      return (
        <li onClick={ click } className={contextIsRunning? 'running':''}>
          <i className={'fa ' + iconClass}></i> <span> { _css.name } </span>
        </li>
      )
    },

    renderJSItem(_js){
      var iconClass = 'fa-gg';

      var self = this;
      var click = function () {
        self.emit("BringJSContext", {
          js: _js,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;

      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === 'js') {
          if (this.props.runningContext.jsID == _js._id) {
            contextIsRunning = true;
          }
        }
      }

      return (
        <li onClick={ click } className={contextIsRunning? 'running':''}>
          <i className={'fa ' + iconClass}></i> <span> { _js.name } </span>
        </li>
      )
    },

    renderComponentItem(_component){
      var iconClass = 'fa-cube';

      var self = this;
      var click = function () {
        self.emit("BringComponentContext", {
          component: _component,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;

      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === 'component') {
          if (this.props.runningContext.componentID == _component._id) {
            contextIsRunning = true;
          }
        }
      }

      return (
        <li onClick={ click } className={contextIsRunning? 'running':''}>
          <i className={'fa ' + iconClass}></i> <span> { _component.name } </span>
        </li>
      )
    },

    renderPageList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-file-text'></i> Pages
            <span className='import-button' onClick={this.clickExportAPISources}>
              <i className='fa fa-upload'></i>
            </span>
            <span className='export-button' onClick={this.clickExportPages}>
              <i className='fa fa-download'></i>
            </span>
            <span className='add-button' onClick={this.clickNewPage}>
              <i className='fa fa-plus'/>
            </span>
          </label>
          <ul>
            { this.props.pageList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.props.pageList.map(this.renderPageItem) }
          </ul>
        </div>
      )
    },

    renderDocumentList(){


      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-html5'></i> Fragments

            <span className='import-button' onClick={this.clickExportAPISources}>
              <i className='fa fa-upload'></i>
            </span>
            <span className='export-button' onClick={this.clickExportFragments}>
              <i className='fa fa-download'></i>
            </span>
            <span className='add-button' onClick={this.clickNewDocument}>
              <i className='fa fa-plus'/>
            </span>
          </label>
          <ul>
            { this.props.documentList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.props.documentList.map(this.renderDocumentItem) }
          </ul>
        </div>
      )
    },

    renderCSSList(){
      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-css3'></i> Cascading Style Sheets
            <span className='import-button' onClick={this.clickExportAPISources}>
              <i className='fa fa-upload'></i>
            </span>
            <span className='export-button' onClick={this.clickExportCasecadeStyleSheets}>
              <i className='fa fa-download'></i>
            </span>
            <span className='add-button' onClick={this.clickNewCSS}>
              <i className='fa fa-plus'></i>
            </span>
          </label>
          <ul>
            { this.state.cssList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.state.cssList.map(this.renderCSSItem) }
          </ul>
        </div>
      )
    },

    renderJSList(){
      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-gg'></i> Javascripts
              <span className='import-button' onClick={this.clickExportAPISources}>
                <i className='fa fa-upload'></i>
              </span>
              <span className='export-button' onClick={this.clickExportJavascripts}>
                <i className='fa fa-download'></i>
              </span>
            <span className='add-button' onClick={this.clickNewScript}>
              <i className='fa fa-plus'></i>
            </span>
          </label>
          <ul>
            { this.state.jsList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.state.jsList.map(this.renderJSItem) }
          </ul>
        </div>
      )
    },

    renderAPIInterfaceList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-plug'></i> API Interfaces
              <span className='import-button' onClick={this.clickExportAPISources}>
                <i className='fa fa-upload'></i>
              </span>
              <span className='export-button' onClick={this.clickExportAPIInterfaces}>
                <i className='fa fa-download'></i>
              </span>
              <span className='add-button' onClick={this.clickAddAPIInterface}>
                <i className='fa fa-plus'></i>
              </span>
          </label>
          <ul>
            { this.state.apiinterfaceList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.state.apiinterfaceList.map(this.renderAPIInterfaceItem) }
          </ul>
        </div>
      )
    },

    renderICEAPISourceList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-database'></i> ICE API Sources
              <span className='import-button' onClick={this.clickExportAPISources}>
                <i className='fa fa-upload'></i>
              </span>
              <span className='export-button' onClick={this.clickExportAPISources}>
                <i className='fa fa-download'></i>
              </span>
              <span className='add-button' onClick={this.clickAddAPISource}>
                <i className='fa fa-plus'></i>
              </span>
          </label>
          <ul>
            { this.state.apisourceList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.state.apisourceList.map(this.renderICEAPISourceItem) }
          </ul>
        </div>
      )
    },

    renderMashupAPISourceList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-share-alt-square'></i> Mashup APIs
              <span className='import-button' onClick={this.clickExportAPISources}>
                <i className='fa fa-upload'></i>
              </span>
              <span className='export-button' onClick={this.clickExportMashupAPIs}>
                <i className='fa fa-download'></i>
              </span>
              <span className='add-button' onClick={this.clickAddAPISource}>
                <i className='fa fa-plus'></i>
              </span>
          </label>
          <ul>

          </ul>
        </div>
      )
    },

    renderComponentList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-cubes'></i> Components
              <span className='import-button' onClick={this.clickExportComponents}>
                <i className='fa fa-upload'></i>
              </span>
              <span className='export-button' onClick={this.clickExportComponents}>
                <i className='fa fa-download'></i>
              </span>
              <span className='add-button' onClick={this.clickNewComponent}>
                <i className='fa fa-plus'></i>
              </span>
          </label>
          <ul>
            { this.state.componentList === null ? <li className='load-holder'><i className='fa fa-pulse fa-spinner'/></li>:this.state.componentList.map(this.renderComponentItem) }
          </ul>
        </div>
      )
    },



    toggleFilterItem(_name){
      let filterSet = this.state.filterSet;

      if( filterSet.has(_name) ){
        filterSet.delete(_name);
      } else {
        filterSet.add(_name);
      }

      this.setState({filterSet: filterSet});
    },

    componentDidUpdate(){
      //console.log('updated', this.state);
    },

    componentDidMountByRoot(){
      console.log("ROOT Mounted");
    },

    componentDidMount(){
      var self = this;

      self.emit("NeedICEHost");
      self.emit("NeedDocumentList");
      self.emit("NeedPageList");
      self.emit("NeedCSSList");
      self.emit("NeedJSList");
      self.emit("NeedAPISourceList");
      self.emit("NeedAPIInterfaceList");
      self.emit("NeedComponentList");
    },

    renderLists(){
      let renderList = [];

      if( this.state.filterSet.size > 0 ){
        if( this.state.filterSet.has('page') ){
          renderList.push( this.renderPageList() );
        }
        if( this.state.filterSet.has('fragment') ){
          renderList.push( this.renderDocumentList() );
        }
        if( this.state.filterSet.has('Component') ){
          renderList.push( this.renderComponentList() );
        }
        if( this.state.filterSet.has('css') ){
          renderList.push( this.renderCSSList() );
        }
        if( this.state.filterSet.has('js') ){
          renderList.push( this.renderJSList() );
        }
        if( this.state.filterSet.has('APIInterface') ){
          renderList.push( this.renderAPIInterfaceList() );
        }
        if( this.state.filterSet.has('APISource') ){
          renderList.push( this.renderICEAPISourceList() );
        }
        if( this.state.filterSet.has('MashupAPISource') ){
          renderList.push( this.renderMashupAPISourceList() );
        }
      } else {
        renderList.push( this.renderPageList() );
        renderList.push( this.renderDocumentList() );
        renderList.push( this.renderComponentList() );
        renderList.push( this.renderCSSList() );
        renderList.push( this.renderJSList() );
        renderList.push( this.renderAPIInterfaceList() );
        renderList.push( this.renderICEAPISourceList() );
        renderList.push( this.renderMashupAPISourceList() );
      }

      return renderList;
    },

    render() {
      let self = this;
      let wide = false;
      let rootClasses = ['ServiceResources', this.props.config.theme, this.getMySizeClass()];

      return (
        <div className={rootClasses.join(' ')}>
          <div className="top-area">
            <div className='filters'>
              <ul>
                <li className='filter-mark'>
                  <i className="fa fa-filter"/>
                </li>
                <li className={this.state.filterSet.has('page')? 'selected':''} onClick={function(){self.toggleFilterItem('page')}}>
                  <i className="fa fa-file-text"/>
                </li>
                <li className={this.state.filterSet.has('fragment')? 'selected':''} onClick={function(){self.toggleFilterItem('fragment')}}>
                  <i className="fa fa-html5"/>
                </li>
                <li className={this.state.filterSet.has('Component')? 'selected':''} onClick={function(){self.toggleFilterItem('Component')}}>
                  <i className="fa fa-cubes"/>
                </li>
                <li className={this.state.filterSet.has('css')? 'selected':''} onClick={function(){self.toggleFilterItem('css')}}>
                  <i className="fa fa-css3"/>
                </li>
                <li className={this.state.filterSet.has('js')? 'selected':''} onClick={function(){self.toggleFilterItem('js')}}>
                  <i className="fa fa-gg"/>
                </li>
                <li className={this.state.filterSet.has('APIInterface')? 'selected':''} onClick={function(){self.toggleFilterItem('APIInterface')}}>
                  <i className="fa fa-plug"/>
                </li>
                <li className={this.state.filterSet.has('APISource')? 'selected':''} onClick={function(){self.toggleFilterItem('APISource')}}>
                  <i className="fa fa-database"/>
                </li>
                <li className={this.state.filterSet.has('MashupAPISource')? 'selected':''} onClick={function(){self.toggleFilterItem('MashupAPISource')}}>
                  <i className="fa fa-share-alt-square"/>
                </li>
              </ul>
            </div>
          </div>
          <div className='list-wrapper'>
            { this.renderLists() }
          </div>
        </div>
      );
    }
  });

  module.exports = ProjectSetting;
})();
