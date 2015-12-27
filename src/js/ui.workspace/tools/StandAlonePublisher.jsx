import React from "react";
import './StandAlonePublisher.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var StandAlonePublisher = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: 'Publish 타입을 선택하세요. (Zip Download, Auto Deploy)',
      savedTitle: ''
    }
  },

  create(){
    var title = this.refs['title'].getValue();

    if (title === '') {
      this.setState({message: "Title을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewPage", {
      title: title
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
    alert("Fail create page");
  },

  render(){
    var classes = ['StandAlonePublisher'];
    let publishOptions = [
      {title:"Zip download", value:"zip"},
      {title:"Auto Deploy", value:"deploy"}
    ];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='type' title='Publish Type' theme="dark" enterable={true} type='select'
                        onChange={ this.onChange }
                        options={publishOptions}
                        defaultValue={this.state.savedTitle} height={40} ref='title'
                        nameWidth={150}/>
        </div>

        <div className='message'>
          {this.state.message}
        </div>

        <div className='buttons'>
          <OutlineButton color='red' width="70" height="40" title='Cancel' onClick={this.cancel}/>
          <OutlineButton color='blue' width="70" height="40" title='Start' onClick={this.create}/>
        </div>
      </div>
    )
  }
});

export default StandAlonePublisher;
