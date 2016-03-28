import React from "react";
import _ from 'underscore';
import './InputModalFrame.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';

var InputModalFrame = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      message: 'Message',
      submitName: 'Submit',
      cancelName: 'Cancel'
    }
  },

  submit(){
    this.props.onSubmit();
  },

  cancel(){
    if( _.isFunction(this.props.onCancel) ){
      this.props.onCancel();
    } else {
      this.emit("Close");
    }
  },

  render(){
    var classes = ['InputModalFrame'];

    return (
      <div className={classes.join(' ')}>

        <div className='contents'>
          { this.props.children }
        </div>

        <div className='message'>
          {this.props.message}
        </div>

        <div className='buttons'>
          <OutlineButton color='red' width="70" height="40" title={this.props.cancelName} onClick={this.cancel}/>
          <OutlineButton color='blue' width="70" height="40" title={this.props.submitName} onClick={this.submit}/>
        </div>
      </div>
    )
  }
});

export default InputModalFrame;
