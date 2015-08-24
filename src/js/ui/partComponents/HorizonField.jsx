
require('./HorizonField.less');

var React = require("react");

var HorizonField = React.createClass({
    getInitialState(){
        return {
          valueIsDiff : false
        };
    },

    onChanged(_e){
      var changedValue = this.getValue();

      this.setState({valueIsDiff:this.isChanged()});
    },

    isChanged(){

      if( this.originValue === this.getValue()) {
        return false;
      } else {
        return true;
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

    valueReset( _value ){
      this.originValue = _value;

      var enterableField = this.refs['enterable-field'];
      if( enterableField !== undefined ){
        var enterableFieldDom = enterableField.getDOMNode();

        if( this.originValue !== undefined )
          enterableFieldDom.value = this.originValue;
        else
          enterableFieldDom.value = '';
      }
    },

    componentDidUpdate(){

      // fieldValue 속성과 originValue 값이 다르면 값을 변경해준다.
      if( this.resetValueFlag ){
        this.resetValueFlag = false;

        this.valueReset(this.props.fieldValue);
      }
    },

    componentWillReceiveProps( _nextProps ){
      this.resetValueFlag = true;
    },


    componentDidMount(){
      this.originValue = this.props.value;


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
            field = <input defaultValue={this.props.fieldValue} ref='enterable-field' onChange={this.onChanged}/>
            iconClass = "fa fa-pencil";
            break;
        }

        return (
            <div className={classes.join(' ')}>
              <div className="field-name" style={{width:this.props.nameWidth}}>
                {this.props.fieldName}
              </div>
              <div className='field-value' style={{left:this.props.nameWidth}}>
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
