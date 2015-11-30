require('./HorizonFieldSet.less');

var React = require("react");
var HorizonField = require('./HorizonField.jsx');

var HorizonFieldSet = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      fields: [
        {
          "name": "default",
          title: "default",
          "initialValue": 'default',
          enterable: true,
          type: 'ace',
          lang: 'css',
          height: 100
        }
      ]
    }
  },

  getAllFieldData(){
    var self = this;

    return this.props.fields.map(function (_field) {
      return {name: _field.name, data: self.refs[_field.name].getValue()};
    });
  },

  getFieldValue(_name){
    return this.refs[_name].getValue();
  },

  onThrowCatcherChangedValue(_eventData, _pass){
    //console.log(_eventData );
    _pass();
  },

  resetAll(){
    var self = this;

    this.props.fields.map(function (_field) {
      self.refs[_field.name].reset();
    });
  },

  addNewField(){
    this.emit('NewFieldAdd');
  },

  componentDidUpdate(){
    this.resetAll();
  },

  componentDidMount(){

  },

  renderOptions(){
    var optionEles = [];

    if (this.props.extendable) {
      optionEles.push(
        <li className='trigger' onClick={this.addNewField}>
          <i className="fa fa-plus"/>
        </li>
      )

    }

    return optionEles;
  },

  renderField(_field){
    return (
      <HorizonField fieldName={_field.name} title={_field.title} theme="dark" enterable={_field.enterable}
                    type={_field.type} ref={ _field.name } onChange={ this.onChange }
                    defaultValue={_field.initialValue} options={ _field.options } height={_field.height}
                    lang={_field.lang} editorId={_field.editorId} deletable={ _field.deletable }
                    nameWidth={this.props.nameWidth} editorableFieldName={_field.editorableFieldName}/>
    )
  },

  render(){
    var classes = ['HorizonFieldSet', this.props.theme];


    return (
      <div className={classes.join(' ')}>
        <div className='wrapper'>
          <div className='head'>
            <label> {this.props.title} </label>
            <ul className='options'>
              { this.renderOptions() }
            </ul>
          </div>
          <div className='body'>
            { this.props.fields.map(this.renderField)}
          </div>
        </div>
      </div>
    )
  }
});


module.exports = HorizonFieldSet;
