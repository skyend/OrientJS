import React from "react";
import './APIInterfaceCreateForm.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var APIInterfaceCreateForm = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 API Interface 의 이름을 정해주세요.',
      savedTitle: ''
    }
  },

  create(){
    var title = this.refs['title'].getValue();

    if (title === '') {
      this.setState({message: "Title을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewAPIInterface", {
      title: title
    });
  },

  onThrowCatcherChangedValue(){

  },

  cancel(){
    this.emit("Close");
  },

  successInterfaceCreate(){
    this.emit("Close");
    this.props.params['success-notice']();
  },

  failInterfaceCreate(){
    alert("Fail create interface");
  },


  render(){
    var classes = ['APIInterfaceCreateForm'];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='title' title='Interface Title' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedTitle} height={40} ref='title'
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

export default APIInterfaceCreateForm;
