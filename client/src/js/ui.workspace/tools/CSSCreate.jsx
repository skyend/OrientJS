import React from "react";
import InputModalFrame from './InputModalFrame.jsx';
import HorizonField from '../partComponents/HorizonField.jsx';

var CSSCreate = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 CSS의 이름을 정해주세요.(확장자명 .css 제외)',
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

    this.emit("CreateNewCSS", {
      name: name + ".css",
      'success-notice':function(){
        that.emit("Close");
        that.props.params['success-notice']();
      },
      'fail-notice': function(){
        alert("Fail create css");
      }
    });
  },

  render(){
    return (
      <InputModalFrame message={this.state.message} submitName='Create' onSubmit={this.create}>
        <div className='fields'>
          <HorizonField fieldName='name' title='CSS Name' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedName} height={40} ref='name'
                        nameWidth={150}/>

        </div>
      </InputModalFrame>
    )
  }
});

export default CSSCreate;
