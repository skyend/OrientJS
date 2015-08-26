
require('./HorizonField.less');

var React = require("react");

var brace  = require('brace');
var AceEditor  = require('react-ace');

require('brace/mode/css')
require('brace/mode/javascript')
require('brace/mode/html')
require('brace/mode/json')
require('brace/theme/twilight')

var EnterableWrapperInput = React.createClass({
  mixins:[require('../reactMixin/EventDistributor.js')],
  getInitialState(){
      return {
        value:undefined
      };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value:value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps( _props ){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value:this.props.defaultValue});
  },

  render(){
    return (
      <input value={ this.state.value } onChange={this.onChange}/>
    );
  }
});

var EnterableWrapperTextarea = React.createClass({
  mixins:[require('../reactMixin/EventDistributor.js')],
  getInitialState(){
      return {
        value:undefined
      };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value:value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps( _props ){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value:this.props.defaultValue});
  },

  render(){

    return (
      <textarea onChange={this.onChange} spellCheck="false" value={ this.state.value }/>
    );
  }
});

var EnterableWrapperCodeEditor = React.createClass({
  mixins:[require('../reactMixin/EventDistributor.js')],
  getInitialState(){
      return {
        value:undefined
      };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_value){
    var value = _value;

    this.setState({value:value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps( _props ){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value:this.props.defaultValue});
  },

  render(){

    return (
      <div className='ace'>
          <AceEditor
            mode={this.props.lang}
            theme="twilight"
            onChange={this.onChange}
            name="UNIQUE_ID_OF_DIV"
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
  mixins:[require('../reactMixin/EventDistributor.js')],
  getInitialState(){
      return {
        value:undefined
      };
  },

  getValue(){
    return this.state.value;
  },

  onChange(_e){
    var value = _e.target.value;

    this.setState({value:value});

    this.emit("ChangedValue", {
      value: value
    });
  },

  componentWillReceiveProps( _props ){
    this.state.value = _props.defaultValue;
  },

  componentDidMount(){
    this.setState({value:this.props.defaultValue});
  },

  renderOption( _option ){
    return (
      <option value={ _option.value }> { _option.value } </option>
    )
  },

  render(){
    return (
      <select value={ this.state.value } onChange={this.onChange}>
        { this.props.options.map( this.renderOption )}

      </select>
    );
  }
});

var HorizonField = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getInitialState(){
        return {
          valueIsDiff : false
        };
    },

    onThrowCatcherChangedValue( _eventData ){
      var value = _eventData.value;


      this.emit("ChangedValue", {
        name:this.props.fieldName,
        data:value
      });
    },

    reset(){
      this.setValue(this.props.defaultValue);
    },

    getValue(){
      if( this.props.enterable ){
        return this.refs['enterable-field'].getValue();
      } else {
        return this.props.defaultValue;
      }
    },

    setValue(_value){
      if( this.props.enterable ){
        this.refs['enterable-field'].setState({value:_value});
      } else {
        this.props.defaultValue = _value;
      }
    },


    render(){
        var classes = ['HorizonField', this.props.theme, this.props.type];
        var field;
        var iconClass;

        if( this.props.enterable ){
          switch( this.props.type ){
            case "input":
              field = <EnterableWrapperInput defaultValue={this.props.defaultValue} ref='enterable-field'/>
              break;
            case "select":
              field = <EnterableWrapperSelect defaultValue={this.props.defaultValue} options={ this.props.options } ref='enterable-field'/>
              break;
            case "textarea":
              field = <EnterableWrapperTextarea defaultValue={this.props.defaultValue}  ref='enterable-field'/>
              break;
            case "ace":
              field = <EnterableWrapperCodeEditor lang={this.props.lang || 'plain'} defaultValue={this.props.defaultValue} ref='enterable-field'/>
              break;
          }
          iconClass = "fa fa-pencil";
        } else {
          field = <label title={this.props.defaultValue}>{this.props.defaultValue}</label>
          iconClass = "fa fa-lock";
        }




        return (
            <div className={classes.join(' ')} style={{height: this.props.height || 26}}>
              <div className="field-name" style={{width:this.props.nameWidth}}>
                <div className='vertical-standard'></div>
                <span>{this.props.fieldName}</span>
              </div>
              <div className={['field-value',this.state.valueIsDiff? 'diff':''].join(' ')} style={{left:this.props.nameWidth}}>
                <div className='vertical-standard'></div>
                { field }
              </div>
              <div className='field-type-guide'>
                <div className='vertical-standard'></div>
                <i className={ iconClass } />
              </div>
            </div>
        )
    }
});


 module.exports = HorizonField;
