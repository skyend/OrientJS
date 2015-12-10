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
        documentList: [],
        pageList: [],
      };
    },

    getInitialState(){
      return {
        iceHost: '',
        apisourceList: [],
        apiinterfaceList: [],
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

    renderAPISourceItem(_apiSource){
      var iconClass = 'fa-database';

      var self = this;
      var click = function () {
        self.emit("BringApiSourceContext", {
          apiSource: _apiSource,
          iconClass: iconClass
        });
      };

      var contextIsRunning = false;
      //console.log("API context ", this.props.runningContext, _apiSourceMeta);
      if (this.props.runningContext !== null) {
        if (this.props.runningContext.contextType === "apiSource") {
          if (this.props.runningContext.apiSourceID == _apiSource.id) {

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
          <i className={'fa ' + iconClass}></i> <span> { _document.title } </span>
        </li>
      )
    },

    renderPageList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-file-text'></i> Pages
            <span className='add-button' onClick={this.clickNewPage}>
              <i className='fa fa-plus'/>
            </span>
          </label>
          <ul>
            { this.props.pageList.map(this.renderPageItem) }
          </ul>
        </div>
      )
    },

    renderDocumentList(){


      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-html5'></i> Fragments
            <span className='add-button' onClick={this.clickNewDocument}>
              <i className='fa fa-plus'/>
            </span>
          </label>
          <ul>
            { this.props.documentList.map(this.renderDocumentItem) }
          </ul>
        </div>
      )
    },

    renderCSSList(){
      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-css3'></i> Cascading Style Sheets
            <span className='add-button' onClick={this.clickNewDocument}>
              <i className='fa fa-plus'></i>
            </span>
          </label>
          <ul>

          </ul>
        </div>
      )
    },

    renderJSList(){
      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-gg'></i> Javascripts
            <span className='add-button' onClick={this.clickNewDocument}>
              <i className='fa fa-plus'></i>
            </span>
          </label>
          <ul>

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

    renderICEAPISourceList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-database'></i> ICE API Sources
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

    renderMashupAPISourceList(){

      return (
        <div className="resourceList">
          <label className='listLabel'>
            <i className='fa fa-share-alt-square'></i> Mashup APIs
              <span className='add-button' onClick={this.clickAddAPISource}>
                <i className='fa fa-plus'></i>
              </span>
          </label>
          <ul>

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
      self.emit("NeedAPISourceList");
      self.emit("NeedAPIInterfaceList");
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
