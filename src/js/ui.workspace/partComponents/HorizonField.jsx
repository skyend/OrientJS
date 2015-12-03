require('./HorizonField.less');

import React from "react";
import brace from 'brace';
import AceEditor from 'react-ace';
import InputBoxWithSelector from './InputBoxWithSelector.jsx';

require('brace/mode/css')
require('brace/mode/javascript')
require('brace/mode/html')
require('brace/mode/json')
require('brace/theme/twilight')


var EnterableWrapperSelectable = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      value: undefined
    };
  },

  render(){
    return (
      <InputBoxWithSelector color="gray" value={ this.state.value } onChange={this.onChange} options={this.props.options} onDrop={this.onDrop}/>
    );
  }
})


var EnterableWrapperInput = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      value: undefined
    };
  },

  getValue(){
    return this.state.value;
  },

  onDrop(e){

  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value: value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps(_props){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value: this.props.defaultValue});
  },

  render(){
    return (
      <input value={ this.state.value } onChange={this.onChange} onDrop={this.onDrop}/>
    );
  }
});

var EnterableWrapperTextarea = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      value: undefined
    };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value: value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps(_props){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value: this.props.defaultValue});
  },

  render(){

    return (
      <textarea onChange={this.onChange} spellCheck="false" value={ this.state.value }/>
    );
  }
});

var EnterableWrapperCodeEditor = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      value: undefined
    };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_value){
    if (this.blockEmitChange) return;

    var value = _value;

    this.setState({value: value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentDidUpdate(){
    this.blockEmitChange = false;
  },

  componentWillUpdate(){
    this.blockEmitChange = true;
  },

  componentWillReceiveProps(_props){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value: this.props.defaultValue});
  },

  render(){

    return (
      <div className='ace'>
        <AceEditor
          mode={this.props.lang}
          theme="twilight"
          onChange={this.onChange}
          name={this.props.editorId}
          value={ this.state.value }
          width='100%'
          height='100%'
          editorProps={{$blockScrolling: true}}
          />
      </div>
    );
  }
});

var EnterableWrapperSelect = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      value: undefined
    };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value: value});

    this.emit("ChangedValue", {
      value: value
    });
  },


  componentWillReceiveProps(_props){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value: this.props.defaultValue});
  },

  renderOption(_option){

    return (
      <option value={ _option.value }> { _option.title || _option.value } </option>
    )
  },

  render(){
    return (
      <select value={ this.state.value } onChange={this.onChange}>
        { this.props.options.map(this.renderOption)}
      </select>
    );
  }
});

var HorizonField = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      value: this.props.defaultValue,
      valueIsDiff: false,
      nameBoxSlideX: 0,
      fieldNameEditMode: false
    };
  },

  onThrowCatcherChangedValue(_eventData){
    var value = _eventData.value;

    this.emit("ChangedValue", {
      name: this.props.fieldName,
      data: value
    });
  },

  reset(){
    this.setValue(this.props.defaultValue);
  },

  onRemove(){
    this.emit("RemoveField", {
      fieldName: this.props.fieldName
    });
  },

  nameDoubleClick(_e){
    if (!this.props.editorableFieldName) return;

    if (this.state.fieldNameEditMode) {
      var input = this.refs['FieldNameInput'].getDOMNode();

      this.emit("RenameField", {
        'past': this.props.fieldName,
        'current': input.value
      });
    }

    this.setState({fieldNameEditMode: !this.state.fieldNameEditMode});


  },

  fieldNameMouseDown(_e){
    if (!this.state.fieldNameEditMode) {
      app.ui.occupyGlobalDrag(this, true);
      app.ui.enableGlobalDrag();
      app.ui.toMouseDawn();
    }


  },

  onGlobalDragStartFromUI(_e){

  },

  onGlobalDragFromUI(_e){
    var currentX = _e.clientX;
    var currentY = _e.clientY;

    if (this.prevX !== undefined) {
      var moveX = currentX - this.prevX;
      var moveY = currentY - this.prevY;


      var toLeft = this.state.nameBoxSlideX + moveX;

      if (this.refs['field-option-box'] === undefined) return;
      var optionBoxDom = this.refs['field-option-box'].getDOMNode();
      var optionBoxWidth = optionBoxDom.offsetWidth;

      if ((toLeft * -1) > optionBoxWidth) {
        toLeft = optionBoxWidth * -1;
      }

      if (toLeft > 0) toLeft = 0;


      this.setState({nameBoxSlideX: toLeft});
    }

    this.prevX = currentX;
    this.prevY = currentY;
  },

  onGlobalDragStopFromUI(_e){
    this.prevX = undefined;
    this.prevY = undefined;
  },

  getValue(){
    if (this.props.enterable) {
      return this.refs['enterable-field'].getValue();
    } else {
      return this.props.defaultValue;
    }
  },

  componentDidUpdate(){
    if (this.refs['FieldNameInput'] !== undefined) {
      var input = this.refs['FieldNameInput'].getDOMNode();
      input.value = this.props.fieldName;
    }
  },

  setValue(_value){
    if (this.props.enterable) {
      this.refs['enterable-field'].setState({value: _value});
    } else {
      this.props.defaultValue = _value;
    }
  },

  render(){
    var classes = ['HorizonField', this.props.theme, this.props.type];
    var field;
    var iconClass;

    if (this.props.enterable) {
      switch (this.props.type) {
        case "input":
          field = <EnterableWrapperInput defaultValue={this.props.defaultValue} ref='enterable-field'/>
          break;
        case "select":
          field =
            <EnterableWrapperSelect defaultValue={this.props.defaultValue} options={ this.props.options }
                                    ref='enterable-field'/>
          break;
        case "textarea":
          field = <EnterableWrapperTextarea defaultValue={this.props.defaultValue} ref='enterable-field'/>
          break;
        case "ace":
          field = <EnterableWrapperCodeEditor lang={this.props.lang || 'plain'} editorId={this.props.editorId}
                                              defaultValue={this.props.defaultValue} ref='enterable-field'/>
          break;
        case "selectable":
          field = <EnterableWrapperSelectable defaultValue={this.props.defaultValue} options={ this.props.options } ref='enterable-field'/>
          break;
      }
      iconClass = "fa fa-pencil";
    } else {
      field = <label title={this.props.defaultValue}>{this.props.defaultValue}</label>
      iconClass = "fa fa-lock";
    }

    var fieldNameRender;
    if (!this.state.fieldNameEditMode) {
      fieldNameRender = <span>{this.props.title || this.props.fieldName}</span>;
    } else {
      fieldNameRender = <input ref='FieldNameInput'/>;
    }


    return (
      <div className={classes.join(' ')} style={{height: this.props.height || 26}}>
        <div className="field-name" style={{width:this.props.nameWidth}}
             onMouseDown={ this.fieldNameMouseDown }>
          <ul className='field-option-box' ref='field-option-box'>
            { this.props.deletable ? (
              <li className='remove-box' onClick={this.onRemove}>
                <div className='vertical-standard'></div>
                <i className='fa fa-trash'/>
              </li>
            ) : ''}
          </ul>

          <div className='field-name-box' ref='field-name-box' style={{left:this.state.nameBoxSlideX}}
               onDoubleClick={this.nameDoubleClick}>
            <div className='vertical-standard'></div>
            { fieldNameRender }
          </div>

        </div>
        <div className={['field-value',this.state.valueIsDiff? 'diff':''].join(' ')}
             style={{left:this.props.nameWidth}}>
          <div className='vertical-standard'></div>
          { field }
        </div>
        <div className='field-type-guide'>
          <div className='vertical-standard'></div>
          <i className={ iconClass }/>
        </div>
      </div>
    )
  }
});


module.exports = HorizonField;
