import React from 'react';
import CheckBox from '../../partComponents/CheckBox.jsx';
import ICafeResultTable from '../../partComponents/ICafeResultTable.jsx';
import './Request.less';

let FieldRow = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      field: null
    };
  },

  changeName(_e){
    this.props.changeName(this.props.field.id, _e);
  },

  changeValue(_e){
    this.props.changeValue(this.props.field.id, _e);
  },

  changeTestValue(_e){
    this.props.changeTestValue(this.props.field.id, _e);
  },

  removeMe(_e){
    this.props.remove(this.props.field.id);
  },

  render(){
    return (
      <div className='row'>
        <div className='accessible-input'>
          <label><span>Name</span></label>
          <input onChange={this.changeName} value={this.props.field.key} placeholder='Field Name'/>
        </div>

        <div className='accessible-input'>
          <label><span>Value</span></label>
          <input onChange={this.changeValue} value={this.props.field.value} placeholder='Field Value'/>
        </div>

        <div className='accessible-input'>
          <label><span>Test Value</span></label>
          <input onChange={this.changeTestValue} value={this.props.field.testValue} placeholder='Field TestValue'/>
        </div>

        <button onClick={this.removeMe}>
          <i className='fa fa-trash'/>
        </button>
      </div>
    );
  }
});

var Request = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      open:false
    }
  },

  getDefaultProps(){
    return {
      request: null,
      contextController: null
    }
  },

  changeCRUD(_e){
    let value = _e.target.value;

    this.emit("ChangedRequestCRUD", {
      requestId : this.props.request.id,
      value: value
    });
  },

  changeCustomCRUD(_e){
    let value = _e.target.value;

    this.emit("ChangedRequestCustomCRUD", {
      requestId : this.props.request.id,
      value: value
    });
  },

  changeMethod(_e){
    let value = _e.target.value;

    this.emit("ChangedRequestMethod", {
      requestId : this.props.request.id,
      value: value
    });
  },

  addNewField(_e){
    this.emit("AddNewField", {
      requestId : this.props.request.id
    });
  },

  changeFieldName(_fieldId, _e){
    this.emit("ChangeFieldName", {
      requestId : this.props.request.id,
      fieldId:_fieldId,
      value: _e.target.value
    });
  },

  changeFieldValue(_fieldId, _e){
    this.emit("ChangeFieldValue", {
      requestId : this.props.request.id,
      fieldId:_fieldId,
      value: _e.target.value
    });
  },

  changeFieldTestValue(_fieldId, _e){
    this.emit("ChangeFieldTestValue", {
      requestId : this.props.request.id,
      fieldId:_fieldId,
      value: _e.target.value
    });
  },

  removeField(_fieldId){
    this.emit("RemoveRequestField", {
      requestId : this.props.request.id,
      fieldId:_fieldId,
    });
  },

  toggle(){
    this.setState({open: !this.state.open});
  },

  removeRequest(){
    this.tryRemoveRequest();
  },

  tryRemoveRequest(_force){
    console.log(_force);
    if( _force ){
      this.emit("RemoveRequest", {
        requestId: this.props.request.id
      });
    } else {
      let self = this;

      this.emit("RequestAttachTool", {
        "toolKey": "ConfirmBox",
        "where": "ModalWindow",
        "params": {
          "title": "Request 제거",
          "confirm-message": "[ " + this.props.request.name + " ] 요청을 제거 하시겠습니까?",
          "positive-action": function () {
            self.tryRemoveRequest(true);
          }
        }
      });
    }
  },

  renderEditPart(){
    let self = this;

    return (
      <div className='part'>
        <div className='section'>
          <div className='title'>
            <span>CRUD</span>
          </div>
          <div className='data'>
            <div className='top'>
              { this.props.request.crud === '*' ? (
                <div className='accessible-input'>
                  <label><span>Input CRUD</span></label>
                  <input onChange={this.changeCustomCRUD} value={this.props.request.customCrud} placeholder='Custom CRUD Type'/>
                </div> ):''}

              <select onChange={this.changeCRUD} value={this.props.request.crud}>
                {this.props.contextController.getAvailableCRUDs().map(function(_crud){
                  return (
                    <option value={_crud.type}>{_crud.type + " ("+_crud.name+")"}</option>
                  );
                })}
              </select>
            </div>

            <div className='row'>
              <label>
                {this.props.contextController.instance.getRequestLocation(this.props.request.id)}
              </label>
            </div>
          </div>
        </div>

        <div className='section'>
          <div className='title'>
            <span>Method</span>
          </div>
          <div className='data'>
            <div className='row'>
              <select onChange={this.changeMethod} value={this.props.request.method}>
                <option value='get'>GET</option>
                <option value='post'>POST</option>
                <option value='put'>PUT</option>
                <option value='delete'>DELETE</option>
              </select>
            </div>
          </div>
        </div>

        <div className='section'>
          <div className='title'>
            <span>Header</span>
          </div>
          <div className='data'>
          A
          </div>
        </div>

        <div className='section'>
          <div className='title'>
            <span>Fields</span>
          </div>
          <div className='data'>
            <div className='top'>
                <CheckBox /> Fill From Nodetype properties <button onClick={this.addNewField}>ADD</button>
            </div>
            { this.props.request.fields.map(function(_field){
              return <FieldRow field={_field} changeName={self.changeFieldName} changeValue={self.changeFieldValue} changeTestValue={self.changeFieldTestValue} remove={self.removeField}/>;
            })}
          </div>
        </div>
      </div>
    )
  },

  renderBody(){
    if( !this.state.open ) return '';

    return (
      <div className='body'>
        { this.renderEditPart() }
      </div>
    )
  },

  render(){
    var self = this;

    return (
      <div className="Request">
        <div className='head'>
          <button className='folder button' onClick={this.toggle}>
            { this.state.open? <i className='fa fa-angle-right'/>:<i className='fa fa-angle-down'/>}
          </button>
          <div className='headline'>
            <span className='title'>
              { this.props.request.name }
            </span>
          </div>
          <div className='right-zone'>
            <button className='button' onClick={this.removeRequest}>
              <i className='fa fa-trash'/>
            </button>
            <button className='button'>
              <i className='fa fa-refresh fa-spin'/> Execute For Test
            </button>
          </div>
        </div>

        { this.renderBody() }

      </div>
    );
  }
});

export default Request;
