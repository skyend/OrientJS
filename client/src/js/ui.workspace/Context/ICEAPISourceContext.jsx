import React from 'react';
import _ from 'underscore';
import ToggleColumns from '../partComponents/ToggleColumns.jsx';
import Request from './API/Request.jsx';

//import Request from './APISourceContext/Request.jsx';
require('./ICEAPISourceContext.less');

export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'), require("./ContextAdaptor.js")],
  getInitialState(){
    return {

    };
  },

  onThrowCatcherChangedRequestCRUD(_e){
    this.props.contextController.modifyRequestCRUD(_e.requestId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherChangedRequestCustomCRUD(_e){
    this.props.contextController.modifyRequestCustomCRUD(_e.requestId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherChangedRequestCustomURL(_e){
    this.props.contextController.modifyRequestCustomURL(_e.requestId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherChangedRequestMethod(_e){
    this.props.contextController.modifyRequestMethod(_e.requestId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherAddNewField(_e){
    this.props.contextController.modifyRequestNewField(_e.requestId);
    this.forceUpdate();
  },

  onThrowCatcherChangeFieldName(_e){
    this.props.contextController.modifyRequestFieldName(_e.requestId, _e.fieldId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherChangeFieldValue(_e){
    this.props.contextController.modifyRequestFieldValue(_e.requestId, _e.fieldId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherChangeFieldTestValue(_e){
    this.props.contextController.modifyRequestFieldTestValue(_e.requestId, _e.fieldId, _e.value);
    this.forceUpdate();
  },

  onThrowCatcherRemoveRequestField(_e){
    this.props.contextController.modifyRemoveRequestField(_e.requestId, _e.fieldId);
    this.forceUpdate();
  },

  onThrowCatcherRemoveRequest(_e){
    this.props.contextController.modifyRemoveRequest(_e.requestId);
    this.forceUpdate();
  },

  newRequest(_e){
    let name = this.refs['new-request-name-input'].getDOMNode().value;
    let crud = this.refs['new-request-type-input'].getDOMNode().value;

    if(/[\s-]/.test(name)){
      this.emit('NoticeMessage', {
        title: "요청 추가 실패",
        message: "요청 이름에 공백문자와 하이픈(-)을 사용 하실 수 없습니다. 대신 언더바( _ ) 를 사용 해 주세요.",
        level: "error"
      });

      return;
    }

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

    if (this.props.contextController.checkDuplicatedRequest(name)) {
      this.emit('NoticeMessage', {
        title: "요청 추가 실패",
        message: "동일한 요청이름이 존재합니다.",
        level: "error"
      });
      return;
    }


    this.props.contextController.modifyNewRequest(name, crud);
    this.forceUpdate();
  },

  componentDidMount(){
    //this.props.contextController.
  },

  renderRequest( _request, _i ){
    return (
      <Request request={_request} contextController={ this.props.contextController }/>
    )
  },

  renderBody(){
    if( this.props.contextController.instance.nodeTypeMeta === null ){

      return (
        <div className='body'>
          <div className='loading'>
            <i className="fa fa-spinner fa-pulse loading"/>
          </div>
        </div>
      );
    }

    return (
      <div className='body'>
        <div className='request-control'>
          <label>
            이름
          </label>
          <input type='text' ref='new-request-name-input' />
          <label>
            API 유형
          </label>
          <select ref='new-request-type-input'>
            {this.props.contextController.getAvailableCRUDs().map(function(_crud){
              return (
                <option value={_crud.type}>{_crud.type + " ("+_crud.name+")"}</option>
              );
            })}
          </select>
          <button onClick={this.newRequest}>
            새 요청 추가
          </button>
        </div>
        {/*<div className="horizontal">
          <span>Requests</span>
        </div>*/}
        <div className='request-list'>
          { this.props.contextController.instance.requests.map( this.renderRequest ) }
        </div>
      </div>
    );
  },

  renderSummary(){
    let self = this;

    if( this.props.contextController.instance.nodeTypeMeta === null ){

      this.props.contextController.prepareNodeTypeMeta(function(_nodeTypeData){

        self.forceUpdate();
      });

      return (
        <div className='summary'>
          <div className='loading'>
            <i className="fa fa-spinner fa-pulse loading"/>
          </div>
        </div>
      );
    }

    return (
      <div className='summary'>
        <div className='section'>
          <div className='name'>
            <span>상위 노드 타입</span>
          </div>
          <div className='data'>
            <span className='block-merge'>
              {function () {
                let items = [];

                if (this.props.contextController.instance.nodeTypeMeta.tree.display !== undefined) {
                  items.push(
                    <span className='block display-field'>{this.props.contextController.instance.nodeTypeMeta.tree.display}</span>
                  );
                }

                if (this.props.contextController.instance.nodeTypeMeta.tree.value !== undefined) {
                  items.push(
                    <span className='block value-field'>{this.props.contextController.instance.nodeTypeMeta.tree.value}</span>
                  );
                }

                if (this.props.contextController.instance.nodeTypeMeta.tree.nid !== undefined) {
                  items.push(
                    <span className='block nid-field'>{this.props.contextController.instance.nodeTypeMeta.tree.nid}</span>
                  );
                }

                return items;
              }.apply(this)}
            </span>
          </div>
        </div>
        <div className='section'>
          <div className='name'>
            <span>속성 목록</span>
          </div>
          <div className='data'>
            {Object.keys(this.props.contextController.instance.nodeTypeMeta.propertytype).map(function (_key) {
              let property = self.props.contextController.instance.nodeTypeMeta.propertytype[_key];

              return (
                <span className='block-merge'>
                  <span className='block display-field'>{property.name}</span>
                  <span className='block value-field'>{property.pid}</span>
                  <span className='block type-field'>{property.valuetype}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className='section'>
          <div className='name'>
            <span>지원 API 유형 목록</span>
          </div>
          <div className='data'>
            {this.props.contextController.instance.nodeTypeMeta.crud.map(function (_crud) {
              return (
                <span className='block-merge' title={"/api/"+self.props.contextController.instance.nt_tid+"/"+ _crud.type+".json"}>
                  <span className='block display-field'>{_crud.name}</span>
                  <span className='block type-field'>{_crud.type}</span>
                  <span className='block value-field'>{_crud.extractor}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  },

  renderHead(){
    return (
      <div className='head' ref='head'>
        <div className='subject'>
          <span className='title'>
            <span className='icon'>
              { this.props.contextController.iconURL !== undefined? <img src={this.props.contextController.iconURL}/>:<i className='fa fa-database'/>}
            </span>
            { this.props.contextController.instance.title }
          </span>
          <span className='tid'>
             { this.props.contextController.instance.nt_tid }
          </span>
          <span className='nid'>
             { this.props.contextController.instance.nid }
          </span>
        </div>
        { this.renderSummary() }
      </div>
    );
  },

  render(){

    return (
      <div className='ICEAPISourceContext' style={this.getRootBaseStyle()}>
        { this.renderHead() }
        { this.renderBody() }
      </div>
    );
  }
});
