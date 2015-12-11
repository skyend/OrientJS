import React from 'react';
import _ from 'underscore';
import Request from './APISourceContext/Request.jsx';
require('./APISourceContext.less');

var APISourceContext = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      mode: 'json',
      showInterfaceAdder: false,
      nodeTypeData: null,
      apiInterfaceList: [],
      followInterfaces: []
    };
  },

  goingToContextStop(){

    this.contextController.pause();
    //console.log('changed context state to stop!');
  },

  goingToContextRunning(){
    this.contextController.resume();
    if (this.props.contextType === 'apiSource')
      this.contextController.needFollowInterfacesState();
  },

  getContextType(){
    return this.props.contextType;
  },

  toggleInterfaceAdder(){
    this.setState({showInterfaceAdder: !this.state.showInterfaceAdder});
  },

  addInterface(_interfaceId){

    if (!this.props.contextController.addInterface(_interfaceId)) {
      this.emit('NoticeMessage', {
        title: "인터페이스 추가 실패",
        message: "해당 인터페이스를 이미 따르고 있으므로 추가 하실 수 없습니다.",
        level: "error"
      });
    }

    this.contextController.needFollowInterfacesState();

    this.setState({showInterfaceAdder: !this.state.showInterfaceAdder});
  },

  createRequest(_e){
    let name = this.refs['request-name'].getDOMNode().value;
    let crud = this.refs['crud-selector'].getDOMNode().value;

    if (name === '') {
      this.emit('NoticeMessage', {
        title: "요청 추가 실패",
        message: "요청 이름을 입력해주세요.",
        level: "error"
      });
      return;
    }

    if (crud === '') {
      this.emit('NoticeMessage', {
        title: "요청 추가 실패",
        message: "부적절한 CRUD",
        level: "error"
      });
      return;
    }

    if (this.props.contextController.existsRequest(name)) {
      this.emit('NoticeMessage', {
        title: "요청 추가 실패",
        message: "동일한 요청이름이 존재합니다.",
        level: "error"
      });
      return;
    }

    this.props.contextController.addRequest(name, crud);

    this.forceUpdate();
  },

  onThrowCatcherUpdatedRequest(_eventData){
    if (_eventData.isInheritance) return; // implemented 의 request 는 저장할 수 없다.

    this.props.contextController.updateRequest(_eventData.request);

    this.forceUpdate();
  },

  onThrowCatcherUpdatedRequestPlaceholder(_eventData){
    var requestName = _eventData.requestName;
    var object = _eventData.object;


    switch (object.target) {
      case "testField":
        this.props.contextController.setRequestTestFieldPlaceholder(requestName, object.name, object.value);
        break;
      default:

    }

    // this.props.contextController.changedContent();

    this.forceUpdate();
  },

  onThrowCatcherDeleteRequest(_eventData){
    this.props.contextController.deleteRequest(_eventData.request);

    this.forceUpdate();
  },


  save(){
    this.props.contextController.save();
  },


  componentDidUpdate(){
    if (this.props.runningState === this.props.contextController.running) return;

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){
    var self = this;
    // contextController 연결
    this.contextController = this.props.contextController;
    this.contextController.attach(this);

    if (this.props.contextType === 'apiSource') {
      this.contextController.getNodetypeData(function (_result) {
        self.setState({nodeTypeData: _result});
      });

      console.log(this, 'NeedAPIInterfaceList');
      this.emit("NeedAPIInterfaceList");
    }

    if (this.props.runningState) {
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  feedSaveStateChange(){
    this.emit("ChangedSaveState");
  },

  renderCRUDList(){
    if (this.props.contextType === 'apiSource') {
      return [this.state.nodeTypeData === null ?
        <option value=''>Loading....</option> : this.state.nodeTypeData.crud.map(function (_crud) {
        return <option value={_crud.type}>{_crud.name}</option>
      }),
        <option value="LIST">List</option>,
        <option value="READ">Read</option>,
        <option value="*">CRUD Free</option>]

    } else {
      return [
        <option value="CREATE">Create</option>,
        <option value="READ">Read</option>,
        <option value="RETRIEVE">Retrieve</option>,
        <option value="LIST">List</option>,
        <option value="DELETE">Delete</option>,
        <option value="UPDATE">Update</option>,
        <option value="*">CRUD Free</option>
      ]
    }
  },

  renderCRUDPicker(){
    return <select ref='crud-selector'>
      { this.renderCRUDList()}
    </select>;
  },

  renderRequestEditor(){
    var self = this;

    if (this.props.contextType === 'apiSource') {
      if (this.state.nodeTypeData === null) {
        return <div className='loading'>
          <i className="fa fa-spinner fa-pulse loading"/>

          <div className='loading-text'>
            Nodetype Data Loading...
          </div>
        </div>
      }
    }

    return [
      <div className='new-form'>

        <span className='field-name'>
          Request Name
        </span>
        <input ref='request-name'/>
        <span className='field-name'>
          Main CRUD
        </span>
        { this.renderCRUDPicker() }
        <div className='right-button-area'>
          <button onClick={this.createRequest}>
            <i className='fa fa-plus'/> Add Request
          </button>
        </div>
      </div>,
      <div className='request-list'>
        { this.props.contextController.requestsList.map(function (_request) {
          console.log(_request);

          return <Request request={_request} contextController={self.props.contextController} width={self.props.width}
                          crudOptions={self.renderCRUDList()} nodeTypeData={self.state.nodeTypeData}
                          isInterface={self.props.contextType === 'apiInterface'}/>
        })}

      </div>];
  },

  renderInterfaceAdder(){
    var self = this;
    return [<select onClick={function(_e){ _e.stopPropagation() }} ref='interface-selector'>
      { this.state.apiInterfaceList.map(function (_apiInterface) {
        return <option value={_apiInterface._id}> {_apiInterface.title} </option>
      })}
    </select>,
      <button
        onClick={function(_e){ _e.stopPropagation(); self.addInterface(self.refs['interface-selector'].getDOMNode().value); }}>
        <i className='fa fa-plus'/>
      </button>,
      <button>
        <i className='fa fa-times'/>
      </button>];
  },

  renderNodeTypeDetail(){
    var self = this;

    return (
      <table className='nodetype-list'>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>Parent Nodetype</span>
          </td>
          <td className='item-description'>
            <span className='block-merge'>
              {function () {
                var items = [];
                if (this.state.nodeTypeData.tree.display !== undefined) {
                  items.push(<span className='block display-field'>{this.state.nodeTypeData.tree.display}</span>);
                }
                if (this.state.nodeTypeData.tree.value !== undefined) {
                  items.push(<span className='block value-field'>{this.state.nodeTypeData.tree.value}</span>);
                }
                if (this.state.nodeTypeData.tree.nid !== undefined) {
                  items.push(<span className='block nid-field'>{this.state.nodeTypeData.tree.nid}</span>);
                }
                return items;
              }.apply(this)}
            </span>
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>Properties</span>
          </td>
          <td className='item-description'>
            {Object.keys(this.state.nodeTypeData.propertytype).map(function (_key) {
              var property = self.state.nodeTypeData.propertytype[_key];

              return <span className='block-merge'>
                <span className='block display-field'>{property.name}</span>
                <span className='block value-field'>{property.pid}</span>
                <span className='block type-field'>{property.valuetype}</span>
              </span>;

            })}
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>CRUD</span>
          </td>
          <td className='item-description'>
            {this.state.nodeTypeData.crud.map(function (_crud) {
              // console.log(_crud);
              // var api_useable = false;
              // if( _crud.executor === 'FUNCTION' ){
              //   api_useable = true;
              // }
              //
              return <span className='block-merge'
                           title={"/api/"+self.props.contextController.nodeTypeId+"/"+ _crud.type+".json"}>
                                    <span className='block display-field'>{_crud.name}</span>
                                    <span className='block type-field'>{_crud.type}</span>
                                    <span className='block value-field'>{_crud.extractor}</span>
                                  </span>;

            })}
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>API Interface</span>
          </td>
          <td className='item-description'>

            {this.props.contextController.followedInterfaceList.map(function (_apiInterfaceId) {
              if (self.state.apiInterfaceList === null) {
                return <span className='block-merge'>
                                          <i className="fa fa-spinner fa-pulse loading"/>
                                      </span>
              }

              var matchInterfaceIndex = _.findIndex(self.state.apiInterfaceList, function (_apiInterface) {
                return _apiInterface._id === _apiInterfaceId;
              });

              let title;

              if (matchInterfaceIndex > -1) {
                title = self.state.apiInterfaceList[matchInterfaceIndex].title;
              } else {
                title = "유효하지 않은 인터페이스";
              }

              return <span className='block-merge'>
                                      <span className='block display-field'>
                                        <i className='fa fa-plug'/>
                                        {title}
                                      </span>
                                    </span>
            })}

            <span
              className={'block display-field plus-button '+(this.state.showInterfaceAdder? 'select-box-width-plus':'')}
              onClick={this.toggleInterfaceAdder}>
              { this.state.showInterfaceAdder ? this.renderInterfaceAdder() : <i className='fa fa-plus'/>}
            </span>
          </td>
        </tr>
      </table>
    )
  },

  renderNodeTypeSpecInfo(){
    return <div className='nodetype-spec-info'>
      <h1>
        { this.props.contextController.iconURL !== undefined ?
          <img src={this.props.contextController.iconURL}/> : <i className='fa fa-database'/>}
        {this.props.contextController.title}
        <small className='tid'>
          {this.props.contextController.nodeTypeId}
        </small>
        <small className='nid'>
          {this.props.contextController.nid}
        </small>
      </h1>
      <div className='detail'>
        { this.state.nodeTypeData === null ?
          <i className="fa fa-spinner fa-pulse loading"/> : this.renderNodeTypeDetail() }
      </div>
    </div>;
  },

  renderInterfaceInfo(){
    return <div className='interface-info'>
      <h1>
        <i className='fa fa-plug'/>
        {this.props.contextController.title}
      </h1>
    </div>;
  },

  render(){
    var style = {
      width: this.props.width,
      height: this.props.height
    };

    if (this.props.runningState) {
      style.opacity = 1;
    } else {
      style.opacity = 0;
      style.pointerEvents = 'none';
    }

    return (

      <div className='APISourceContext dark' style={style}>
        { this.props.contextType === 'apiSource' ? this.renderNodeTypeSpecInfo() : this.renderInterfaceInfo() }

        <div className='requests-editor'>
          { this.renderRequestEditor() }


        </div>

        <div className='request-navigation'>

        </div>


        <div className='node-render-zone' style={{display:'none'}}>
          { this.state.nodeTypeData !== null ? 'this.renderDataZone()' : ''}
        </div>
      </div>
    )
  }
});


module.exports = APISourceContext;
