
require('./HorizonFieldSet.less');

var React = require("react");
var HorizonField = require('./HorizonField.jsx');

var HorizonFieldSet = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getAllFieldData(){
      var self = this;

      return this.props.fields.map(function(_field){
        return {name: _field.name , data:self.refs[_field.name].getValue()};
      });
    },

    onThrowCatcherChangedValue( _eventData ){
      console.log(_eventData );
    },

    resetAll(){
      var self = this;
      this.props.fields.map(function(_field){
        self.refs[_field.name].reset();
      });
    },

    renderField( _field ){
      return (
        <HorizonField fieldName={_field.name} theme="dark" type={_field.type} ref={ _field.name } onChange={ this.onChange }
                     fieldValue={_field.initialValue}
                     nameWidth={this.props.nameWidth}/>
      )
    },

    componentDidUpdate(){
      this.resetAll();
    },

    componentDidMount(){

    },

    render(){
        var classes = ['HorizonFieldSet', this.props.theme];

        return (
            <div className={classes.join(' ')}>
              <div className='wrapper'>
                <div className='head'>
                  <label> {this.props.title} </label>
                </div>
                <div className='body'>
                  { this.props.fields.map( this.renderField )}
                </div>
              </div>
            </div>
        )
    }
});


 module.exports = HorizonFieldSet;
