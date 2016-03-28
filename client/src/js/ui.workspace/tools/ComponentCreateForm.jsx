import React from "react";
import './ComponentCreateForm.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var ComponentCreateForm = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 컴포넌트의 이름을 정해주세요.',
      savedName: ''
    }
  },

  create(){
    var name = this.refs['name'].getValue();

    if (name === '') {
      this.setState({message: "Name 을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewComponent", {
      name: name
    });
  },

  onThrowCatcherChangedValue(){

  },

  cancel(){
    this.emit("Close");
  },

  successComponentCreate(){
    this.emit("Close");
    this.props.params['success-notice']();
  },

  failComponentCreate(){
    alert("Fail create component");
  },


  render(){
    var classes = ['ComponentCreateForm'];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='name' title='Component Name' theme="dark" enterable={true} type='input'
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
              <OutlineButton color='blue' width="70" height="40" title='Create' onClick={this.create}/>,
            ]
          ]} width={140} height={50}/>

        </div>
      </div>
    )
  }
});

export default ComponentCreateForm;
