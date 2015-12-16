let React = require("react");
import './DocumentCUForm.less';
let HorizonField = require('../partComponents/HorizonField.jsx');
let OutlineButton = require('../partComponents/OutlineButton.jsx');
let GridBox = require("../partComponents/GridBox.jsx");

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

  onChangeHTML(_e){
    console.log(_e.nativeEvent);

    function readSingleFile(_target) {
      //Retrieve the first (and only!) File from the FileList object
      var f = _target.files[0];
      console.log(f, f.webkitRelativePath);

      if (f) {
        var r = new FileReader();
        r.onload = function(e) {
  	      var contents = e.target.result;
          console.log(contents);
          // alert( "Got the file.n"
          //       +"name: " + f.name + "n"
          //       +"type: " + f.type + "n"
          //       +"size: " + f.size + " bytesn"
          //       + "starts with: " + contents.substr(1, contents.indexOf("n"))
          // );
        }
        r.readAsText(f);
      } else {
        alert("Failed to load file");
      }
    }

    console.log(readSingleFile(_e.nativeEvent.target));

    //document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
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
          <HorizonField fieldName='type' title='Fragment HTML' theme="dark" enterable={true} type='file'
            onChange={ this.onChangeHTML }
            ref='type'
            defaultValue='' height={40}
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
          ]} width={150} height={50}/>

        </div>
      </div>
    )
  }
});

export default DocumentCUForm;
