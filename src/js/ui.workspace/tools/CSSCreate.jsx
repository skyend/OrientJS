import React from "react";
import './CSSCreate.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var CSSCreate = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 CSS의 이름을 정해주세요.(확장자명 .css 제외)',
      savedName: ''
    }
  },

  create(){
    var name = this.refs['name'].getValue();

    if (name === '') {
      this.setState({message: "Name을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewCSS", {
      name: name + ".css"
    });
  },

  onThrowCatcherChangedValue(){
  },

  cancel(){
    this.emit("Close");
  },

  successPageCreate(){
    this.emit("Close");
  },

  failPageCreate(){
    alert("Fail create css");
  },

  onChange(){

  },

  render(){
    var classes = ['CSSCreate'];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='name' title='CSS Name' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedName} height={40} ref='name'
                        nameWidth={150}/>

        </div>

        <div className='message'>
          {this.state.message}
        </div>

        <div className='buttons'>
          <GridBox placements={[
            [
              <OutlineButton color='red' width="70" height="40" title='Cancel' onClick={this.cancel}/>,
              <OutlineButton color='blue' width="70" height="40" title='Create' onClick={this.create}/>
            ]
          ]} width={150} height={50}/>

        </div>
      </div>
    )
  }
});

export default CSSCreate;
