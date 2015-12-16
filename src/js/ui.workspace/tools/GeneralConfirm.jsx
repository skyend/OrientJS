let React = require("react");
import './GeneralConfirm.less';
let HorizonField = require('../partComponents/HorizonField.jsx');
let OutlineButton = require('../partComponents/OutlineButton.jsx');
let GridBox = require("../partComponents/GridBox.jsx");

var PageCUForm = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getDefaultProps(){
    return {
      _storedState:{
      }
    };
  },
  getInitialState(){
    return {
      message: '',
      savedTitle: ''
    }
  },

  negative(){
    if( typeof this.props.params['nagative-action'] === 'function' ){
      this.props.params['nagative-action']();
    }

    this.emit("Close");
  },

  positive(){
    if( typeof this.props.params['positive-action'] === 'function' ){
      this.props.params['positive-action']();
    }

    this.emit("Close");
  },

  render(){
    var classes = ['GeneralConfirm'];

    return (
      <div className={classes.join(' ')}>
        <div className='message-box'>
          { this.props.params['confirm-message'] }
        </div>
        <div className='button-box'>
          <OutlineButton color='red' height="40" title='NO' onClick={this.negative}/>
          <OutlineButton color='blue' height="40" title='YES' onClick={this.positive}/>
        </div>
      </div>
    )
  }
});

export default PageCUForm;
