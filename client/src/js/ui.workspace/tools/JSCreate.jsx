import React from "react";
import InputModalFrame from './InputModalFrame.jsx';
import HorizonField from '../partComponents/HorizonField.jsx';

var CSSCreate = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 Javascript의 이름을 정해주세요.(확장자명 .js 제외)',
      savedName: ''
    }
  },

  create(){
    let that = this;
    var name = this.refs['name'].getValue();

    if (name === '') {
      this.setState({message: "Name을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewJS", {
      name: name + ".js",
      'success-notice':function(){
        that.emit("Close");
        that.props.params['success-notice']();
      },
      'fail-notice': function(){
        alert("Fail create js");
      }
    });
  },

  render(){
    return (
      <InputModalFrame message={this.state.message} submitName='Create' onSubmit={this.create}>
        <div className='fields'>
          <HorizonField fieldName='name' title='JS Name' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedName} height={40} ref='name'
                        nameWidth={150}/>

        </div>
      </InputModalFrame>
    )
  }
});

export default CSSCreate;
