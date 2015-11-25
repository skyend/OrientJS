import React from "react";
import './DocumentCUForm.less';
import HorizonField from '../partComponents/HorizonField.jsx';
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";

var DocumentCUForm = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      message: '생성할 Fragment 의 기본 속성을 정해주세요.',
      savedTitle: '',
      savedType: 'contents'
    }
  },

  create(){
    var title = this.refs['title'].getValue();
    var type = this.refs['type'].getValue();

    if (title === '') {
      this.setState({message: "Title을 입력해 주세요."});
      return;
    }

    this.emit("CreateNewDocument", {
      title: title,
      type: type
    });
  },

  onThrowCatcherChangedValue(){
  },

  cancel(){
    this.emit("Close");
  },

  successDocumentCreate(){
    this.emit("Close");
  },

  failDocumentCreate(){
    alert("Fail create fragment");
  },

  onChange(){

  },

  render(){
    var classes = ['DocumentCUForm'];

    return (
      <div className={classes.join(' ')}>

        <div className='fields'>
          <HorizonField fieldName='title' title='Fragment Title' theme="dark" enterable={true} type='input'
                        onChange={ this.onChange }
                        defaultValue={this.state.savedTitle} height={40} ref='title'
                        nameWidth={150}/>

          <HorizonField fieldName='type' title='Fragment Type' theme="dark" enterable={true} type='select'
                        onChange={ this.onChange }
                        ref='type'
                        defaultValue={this.state.savedType} height={40}
                        options={[{title:'contents', value:'contents'}, {title:'layout', value:'layout'}]}
                        nameWidth={150}/>
        </div>

        <div className='message'>
          {this.state.message}
        </div>

        <div className='buttons'>
          <GridBox placements={[
            [
              <OutlineButton color='white' title='Cancel' onClick={this.cancel}/>,
              <OutlineButton color='white' title='Create' onClick={this.create}/>,
            ]
          ]} width={150} height={50}/>

        </div>
      </div>
    )
  }
});

export default DocumentCUForm;
