
require('./HorizonField.less');

var React = require("react");


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
              iconClass = "fa fa-pencil";
              break;
            case "select":
              field = <EnterableWrapperSelect defaultValue={this.props.defaultValue} options={ this.props.options } ref='enterable-field'/>
              iconClass = "fa fa-pencil";
              break;
          }
        } else {
          field = <label title={this.props.defaultValue}>{this.props.defaultValue}</label>
          iconClass = "fa fa-lock";
        }




        return (
            <div className={classes.join(' ')}>
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
