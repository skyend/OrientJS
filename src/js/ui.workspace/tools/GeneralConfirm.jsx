import React from "react";
import './GeneralConfirm.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var PageCUForm = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

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
          <GridBox placements={[
            [
              <OutlineButton color='white' title='NO' onClick={this.negative}/>,
              <OutlineButton color='white' title='YES' onClick={this.positive}/>,
            ]
          ]} width={200} height={30}/>
        </div>
      </div>
    )
  }
});

export default PageCUForm;
