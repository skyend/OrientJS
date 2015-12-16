let React = require("react");
import './ContentsCopyBoard.less';
let OutlineButton = require('../partComponents/OutlineButton.jsx');
let GridBox = require("../partComponents/GridBox.jsx");
let Copy2Clipboard = require('copy-to-clipboard');
var ContentsCopyBoard = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  copy(){
    Copy2Clipboard(this.props.params.copyableContents);

    this.emit("NoticeMessage", {
      title:"복사완료",
      message:"복사가 완료 되었습니다."
    });
  },

  close(){
    this.emit("Close");
  },

  render(){
    var classes = ['ContentsCopyBoard'];

    return (
      <div className={classes.join(' ')}>
        <div className='data-info'>
          <span>{ this.props.params.dataInfo }</span>
        </div>
        <div className='board'>
          <textarea disabled>
            { this.props.params.copyableContents }
          </textarea>
        </div>

        <div className='buttons'>
          <OutlineButton color='red' width="70" height="40" title='Close' onClick={this.close}/>
          <OutlineButton color='blue' width="70" height="40" title='Copy' onClick={this.copy}/>
        </div>
      </div>
    )
  }
});

module.exports =  ContentsCopyBoard;
