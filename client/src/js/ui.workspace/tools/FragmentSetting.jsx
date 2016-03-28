import React from "react";
import './FragmentSetting.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var FragmentSetting = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 페이지의 기본 속성을 정해주세요.',
      savedTitle: ''
    }
  },

  apply(){

  },

  cancel(){
    this.emit("Close");
  },

  render(){
    var classes = ['FragmentSetting'];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='title' title='Page Title' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedTitle} height={40} ref='title'
                        nameWidth={150}/>

        </div>

        <div className='message'>
          {this.state.message}
        </div>

        <div className='buttons'>

              <OutlineButton color='red' width="70" height="40" title='Cancel' onClick={this.cancel}/>
              <OutlineButton color='blue' width="70" height="40" title='Apply' onClick={this.apply}/>


        </div>
      </div>
    )
  }
});

export default FragmentSetting;
