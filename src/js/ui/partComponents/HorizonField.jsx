
require('./HorizonField.less');

var React = require("react");

var HorizonField = React.createClass({
    mixins:[require('../reactMixin/EventDistributor.js')],

    getInitialState(){
        return {
          valueIsDiff : false
        };
    },

    onChange(){
      var changedValue = this.getValue();

      if( this.props.fieldValue === changedValue ){
        this.setState({ valueIsDiff : false });
      } else {
        this.setState({ valueIsDiff : true});
      }

      this.emit("ChangedValue", {
        name:this.props.fieldName,
        data:changedValue
      });
    },

    reset(){
      switch( this.props.type ){
        case "enterable":
          this.setInputValue( this.props.fieldValue );
          this.onChange();
          break;
      }
    },

    getValue(){
      switch( this.props.type ){
        case "static":
          return this.props.fieldValue;
        case "enterable":
          return this.readInputValue();
      }
    },

    readInputValue(){
      var enterableField = this.refs['enterable-field'];
      if( enterableField === undefined ) throw new Error("Horizon Field is not enterable type.");
      return enterableField.getDOMNode().value;
    },

    setInputValue( _value ){
      var enterableField = this.refs['enterable-field'];
      if( enterableField === undefined ) throw new Error("Horizon Field is not enterable type.");
      enterableField.getDOMNode().value = _value ;
    },

    render(){
        var classes = ['HorizonField', this.props.theme, this.props.type];
        var field;
        var iconClass;

        switch( this.props.type ){
          case "static":
            field = this.props.fieldValue;
            iconClass = "fa fa-lock";
            break;
          case "enterable":
            field = <input defaultValue={this.props.fieldValue} ref='enterable-field' onChange={this.onChange}/>
            iconClass = "fa fa-pencil";
            break;
        }

        return (
            <div className={classes.join(' ')}>
              <div className="field-name" style={{width:this.props.nameWidth}}>
                {this.props.fieldName}
              </div>
              <div className={['field-value',this.state.valueIsDiff? 'diff':''].join(' ')} style={{left:this.props.nameWidth}}>
                { field }
              </div>
              <div className='field-type-guide'>
                <i className={ iconClass } />
              </div>
            </div>
        )
    }
});


 module.exports = HorizonField;
