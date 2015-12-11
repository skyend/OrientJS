import React from 'react';
import CheckBox from '../../partComponents/CheckBox.jsx';
import ICafeResultTable from '../../partComponents/ICafeResultTable.jsx';
import './Request.less';

var Request = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      request: null,
      nodeTypeData: null,
      isInterface: false,
      width:0
    }
  },

  getInitialState(){
    return {
      showDataPreviewer: false,
      interfaces: [],
      fold: true,
      icafeResult: null
    }
  },

  interfaceCheck(){
    if (this.props.interface !== undefined) {

      return true;
    }

    return false;
  },

  toggleFold(){
    this.setState({fold: !this.state.fold});
  },

  deleteRequest(_e, _force){
    if (this.interfaceCheck()) return;

    if (_force != true) {
      var self = this;

      this.emit("RequestAttachTool", {
        "toolKey": "ConfirmBox",
        "where": "ModalWindow",
        "params": {
          "title": "요청 제거",
          "confirm-message": "[ " + this.props.request.name + " ] 요청을 제거 하시겠습니까?",
          "positive-action": function () {
            self.deleteRequest(_e, true);
          }
        }
      });

      return;
    }

    this.emit("DeleteRequest", {
      request: this.props.request
    });
  },


  testRequest(){
    let self = this;
    this.setState({loadingData: true, fold: false});

    //this.setState({showDataPreviewer:true, loadingData: false});
    console.log(this.getFields());

    this.props.contextController.executeRequestTest(this.props.request, this.getFields(), this.getHeaders(), function (_result) {
      console.log('test data setState', _result);

      self.setState({icafeResult: _result, showDataPreviewer: true, loadingData: false});
    });
  },

  testRequestWithChain(){
    this.setState({loadingDataWithChain: true, fold: false});

    //this.setState({showDataPreviewer:true, loadingDataWithChain: false});
  },

  getHeaders(){
    return [];
  },

  getFields(){

    var fields = [];
    for (let i = 0; i < this.props.request.fieldList.length; i++) {
      fields.push(this.props.request.fieldList[i]);
    }

    if (this.props.request.fieldFillFromNodeType) {
      if (this.props.nodeTypeData === null) throw new Error("노드타입데이터가 로드되지 않았습니다.");

      let self = this;

      let propertyTypes = Object.keys(this.props.nodeTypeData.propertytype).map(function (_key) {
        var pt = self.props.nodeTypeData.propertytype[_key];

        switch (pt.pid) {
          case "created":
          case "changed":
          case "owner":
          case "modifier":
            return false;
        }

        self.props.nodeTypeData.propertytype[_key].name = pt.pid;

        fields.push(self.props.nodeTypeData.propertytype[_key]);
      });
    }

    return fields;
  },

  changeURLPattern(){
    if (this.interfaceCheck()) return;

    this.props.request.customUrlPattern = this.refs['url-pattern'].getDOMNode().value;

    this.updateEmit();
  },

  changeCRUD(){
    if (this.interfaceCheck()) return;

    var value = this.refs['crud-selector'].getDOMNode().value;

    this.props.request.crud = value;

    this.updateEmit();
  },

  changeMethod(){
    if (this.interfaceCheck()) return;

    var value = this.refs['method-selector'].getDOMNode().value;

    this.props.request.method = value;

    this.updateEmit();
  },

  addNewField(){
    if (this.interfaceCheck()) return;

    this.props.request.fieldList.push({
      name: '',
      value: '',
      testValue: ''
    });

    this.updateEmit();
  },

  deleteField(_fieldIndex){
    var newFieldList = [];
    this.props.request.fieldList.map(function (_field, _i) {
      if (_i != _fieldIndex) {
        newFieldList.push(_field);
      }
    });

    this.props.request.fieldList = newFieldList;

    this.updateEmit();
  },

  deleteHeader(_headerIndex){
    var newHeaderList = [];
    this.props.request.headerList.map(function (_header, _i) {
      if (_i != _headerIndex) {
        newHeaderList.push(_header);
      }
    });

    this.props.request.headerList = newHeaderList;

    this.updateEmit();
  },

  changeFieldName(_index, _e){
    if (this.interfaceCheck()) return;

    this.props.request.fieldList[_index].name = _e.target.value;

    this.updateEmit();
  },

  changeFieldValue(_index, _e){
    if (this.interfaceCheck()) return;

    this.props.request.fieldList[_index].value = _e.target.value;

    this.updateEmit();
  },

  changeFieldTestValue(_fieldName, _e){
    let value = _e.target.value;

    this.updateInterfacePlaceholders(this.props.request.name, {
      target: 'testField',
      name: _fieldName,
      value: value
    });

    console.log(_fieldName);

    // this.props.request.fieldList[_index].testValue = _e.target.value;
    // console.log('here', this);
    //this.updateEmit();
  },

  // changeTestValueOfField(_fieldName, _value){
  //   //this.props.request.fieldTestValues[_fieldName] = _value;
  //
  //   this.updateInterfacePlaceholders(this.props.request.name,{
  //     target:'testField',
  //     name: _fieldName,
  //     value:_value
  //   });
  //
  //   this.updateEmit();
  // },

  addNewHeader(){
    if (this.interfaceCheck()) return;

    this.props.request.headerList.push({
      name: '',
      value: '',
      testValue: ''
    });

    this.updateEmit();
  },

  changeHeaderName(_index, _e){
    if (this.interfaceCheck()) return;

    this.props.request.headerList[_index].name = _e.target.value;

    this.updateEmit();
  },

  changeHeaderValue(_index, _e){
    if (this.interfaceCheck()) return;

    this.props.request.headerList[_index].value = _e.target.value;

    this.updateEmit();
  },

  changeHeaderTestValue(_index, _e){
    this.props.request.headerList[_index].testValue = _e.target.value;

    this.updateEmit();
  },


  fillFromPropertytypesToggle(_value){
    if (this.interfaceCheck()) return false;

    this.props.request.fieldFillFromNodeType = _value;

    this.updateEmit();
  },

  onThrowCatcherGoToPage(_eventData){

    this.updateInterfacePlaceholders(this.props.request.name, {
      target: 'testField',
      name: 'pagecurrent',
      value: _eventData.to
    });

    this.testRequest();
  },

  updateInterfacePlaceholders(_requestName, _object){
    this.emit("UpdatedRequestPlaceholder", {
      requestName: _requestName,
      object: _object
    });
  },

  updateEmit(){

    this.emit("UpdatedRequest", {
      request: this.props.request,
      isInheritance: this.isInheritance
    });
  },

  renderWithCheckEditable(_buttonElement){
    if( this.isInheritance ) return '';

    return _buttonElement;
  },

  renderDataZone(){

    return (
      <div className='data-render-zone open'>
        <ICafeResultTable result={this.state.icafeResult} propertytypes={this.props.nodeTypeData.propertytype}/>
      </div>
    );
  },

  renderFillFieldsFromNodeType(){
    if (this.props.request.fieldFillFromNodeType !== true) return '';
    if (this.props.nodeTypeData === null) return '';

    let self = this;

    let propertyTypes = Object.keys(this.props.nodeTypeData.propertytype).map(function (_key) {
      return self.props.nodeTypeData.propertytype[_key];
    });

    propertyTypes = propertyTypes.filter(function (_pt) {
      switch (_pt.pid) {
        case "created":
        case "changed":
        case "owner":
        case "modifier":
          return false;
      }

      return true;
    });


    var testFieldPlaceHolders = this.props.contextController.getRequestTestFieldPlaceholder(this.props.request.name);

    return propertyTypes.map(function (_pt, _i) {

      return (
        <div className='field'>
          <div className='input-wrapper name'>
            <input className='name' placeholder="Header name (a-z,_,-)" value={_pt.pid}/>
          </div>
          <div className='input-wrapper value'>
            <input className='value' placeholder="Header value or resolver" value={"${"+_pt.pid+"}"}/>
          </div>
          <div className='input-wrapper test-value'>
            <input className='test-value' placeholder="Test value" value={testFieldPlaceHolders[_pt.pid]} onChange={function(_e){ self.changeFieldTestValue(_pt.pid,_e); }}/>
          </div>
        </div>
      );
    })
  },

  renderURLPatternInput(){
    let contextController = this.props.contextController;

    if (this.props.request.crud !== "*") {
      let urlPattern = contextController.serviceManager.iceHost +
        "/api/" +
        (contextController.nodeTypeId !== undefined ? contextController.nodeTypeId : "{tid}") +
        "/" +
        this.props.request.crud +
        ".json";

      return <input value={urlPattern} disabled/>
    } else {
      let customUrlPattern = this.props.request.customUrlPattern || '';

      return <input defaultValue={customUrlPattern} onChange={this.changeURLPattern} ref='url-pattern'/>
    }
  },

  renderRows(_width){

    let self = this;
    let returnElements = [];
    let testFieldPlaceHolders;

    if (!this.props.isInterface) testFieldPlaceHolders = this.props.contextController.getRequestTestFieldPlaceholder(this.props.request.name);

    returnElements.push(
      <div className='row'>
        <div className='head'>
          <label>
            <span>URL Pattern</span>
          </label>
          <div className='right-area'>
            {this.renderWithCheckEditable(
              <div className='option-box blue'>
                {this.renderWithCheckEditable(
                  <select onChange={this.changeCRUD} value={this.props.request.crud.toUpperCase()} ref='crud-selector'>
                    { this.props.crudOptions }
                  </select>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='request-pattern'>
          {this.renderURLPatternInput()}
        </div>
      </div>
    );

    returnElements.push(
      <div className='row'>
        <div className='head'>
          <label>
            Headers
          </label>
          <div className='right-area'>
            {this.renderWithCheckEditable(
              <button className='option-box blue' onClick={this.addNewHeader}>
                <i className='fa fa-plus'/>
              </button>
            )}
          </div>
        </div>
        <div className='request-field-set'>
          <div className='field'>
            <div className='input-wrapper name'>
              Field Name
            </div>
            <div className='input-wrapper value'>
              Value
            </div>
            <div className='input-wrapper test-value'>
              Test & Sample Value
            </div>
          </div>
          { this.props.request.headerList.map(function (_header, _i) {
            return (
              <div className='field'>
                <div className='input-wrapper name'>
                  <input className='name' placeholder="Header name (a-z,_,-)" value={_header.name}  onChange={function(_e){ self.changeHeaderName(_i,_e); }}/>
                </div>
                <div className='input-wrapper value'>
                  <input className='value' placeholder="Header value or resolver" value={_header.value}  onChange={function(_e){ self.changeHeaderValue(_i,_e); }}/>
                </div>
                <div className='input-wrapper test-value'>
                  <input className='test-value' placeholder="Test value" value={_header.testValue} onChange={function(_e){ self.changeHeaderTestValue(_i,_e); }}/>
                  { self.renderWithCheckEditable(
                    <button onClick={ function(){self.deleteHeader(_i)} }><i className='fa fa-trash'/></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    returnElements.push(
      <div className='row'>
        <div className='head'>
          <label>Fields</label>
          <div className='right-area'>
            <div className='option-box'>
              <CheckBox value={this.props.request.fieldFillFromNodeType||false} onToggle={this.fillFromPropertytypesToggle}/>
               Fill From Nodetype properties
            </div>
            {this.renderWithCheckEditable(
              <button className='option-box blue' onClick={this.addNewField}>
                <i className='fa fa-plus'/>
              </button>)}
          </div>
        </div>
        <div className='request-field-set'>
          <div className='field'>
            <div className='input-wrapper name'>
              Field Name
            </div>
            <div className='input-wrapper value'>
              Value
            </div>
            <div className='input-wrapper test-value'>
              Test & Sample Value
            </div>
          </div>

          { this.renderFillFieldsFromNodeType() }
          { this.props.request.fieldList.map(function (_field, _i) {
            return (
              <div className='field'>
                <div className='input-wrapper name'>
                  <input className='name' placeholder="Field name (a-z,_,-)" value={_field.name} onChange={function(_e){ self.changeFieldName(_i,_e); }}/>
                </div>
                <div className='input-wrapper value'>
                  <input className='value' placeholder="Field value or resolver" value={_field.value} onChange={function(_e){ self.changeFieldValue(_i,_e); }}/>
                </div>
                {self.props.isInterface ? '':(
                  <div className='input-wrapper test-value'>
                    <input className='test-value' placeholder="Test value" value={testFieldPlaceHolders[_field.name]} onChange={function(_e){ self.changeFieldTestValue(_field.name,_e); }}/>
                    { self.renderWithCheckEditable(
                      <button onClick={ function(){self.deleteField(_i)} }><i className='fa fa-trash'/></button>
                    )}
                  </div>
                  )
                }
              </div>
            )
          })}

        </div>
      </div>
    );

    returnElements.push(
      <div className='row'>
        <div className='head'>
          <label>Chains</label>
          <div className='right-area'>
            {this.renderWithCheckEditable(
              <button className='option-box blue' onClick={this.addNewField}>
                <i className='fa fa-plus'/>
              </button>)}
          </div>
        </div>
      </div>
    );


    return returnElements;
  },

  renderBody(){
    if (this.state.fold) return '';
    let edittingZone;
    let dataZone;

    let editZoneStyle = {
      width:'100%'
    };

    let dataZoneStyle = {
      display:'none'
    };

    edittingZone = (
      <div className='editting-zone' style={editZoneStyle}>
        { this.renderRows(editZoneStyle.width)}
      </div>
    );

    if( this.state.showDataPreviewer && this.state.icafeResult){
      editZoneStyle={
        width:'50%'
      };
      dataZoneStyle = {
        width:'50%'
      };

      dataZone = (
        <div className='data-zone' style={dataZoneStyle}>
          { this.renderDataZone()}
        </div>
      );
    }


    return (
      <div className='body'>
        {edittingZone}
        {dataZone}
      </div>
    )
  },

  render(){
    var self = this;
    this.isInheritance = this.props.request.isInheritance;



    return (
      <div className={'request '+ (this.isInheritance? "smaller from-interface":'')}>
        <div className='head'>
          <button onClick={this.toggleFold} className='option-box blue'> { this.state.fold ?
            <i className='fa fa-chevron-down'/> : <i className='fa fa-chevron-up'/>}
          </button>

          <div className='request-name'>
            { this.props.request.name}
          </div>

          { this.isInheritance ? <div className='interface-name'>
            <i className='fa fa-plug'/> { this.props.request.interface.title }
          </div> : ''}

          <div className='right-area'>
            {this.renderWithCheckEditable(
              <button className='option-box blue' onClick={this.deleteRequest}>
                <i className='fa fa-trash'/>
              </button>
            )}

            <button className='option-box blue'>
              <select onChange={this.changeMethod} value={this.props.request.method} ref='method-selector'>
                <option value='get'>GET</option>
                <option value='post'>POST</option>
                <option value='put'>PUT</option>
                <option value='delete'>DELETE</option>
              </select>
            </button>

            <button className='option-box blue' onClick={this.testRequest}>
              <i className={'fa fa-refresh '+ (this.state.loadingData? "fa-spin":'')}/>
              Test
            </button>

            <button className='option-box blue' onClick={this.testRequestWithChain}>
              <i className={'fa fa-refresh '+ (this.state.loadingDataWithChain? "fa-spin":'')}/>
              Test With Chain
            </button>

          </div>
        </div>
        {this.renderBody()}
      </div>
    );
  }
});

export default Request;
