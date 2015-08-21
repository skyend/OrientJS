
require('./HorizonField.less');

var React = require("react");

var HorizonField = React.createClass({

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
            field = <input defaultValue={this.props.fieldValue}/>
            iconClass = "fa fa-pencil";
            break;
        }

        return (
            <div className={classes.join(' ')}>
              <div className="field-name" style={{width:this.props.nameWidth}}>
                {this.props.fieldName}
              </div>
              <div className='field-value' style={{width:this.props.width - this.props.nameWidth}}>
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
