/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

import './HeadToolBar.less';
import React from "react";
import OutlineButton from "./partComponents/OutlineButton.jsx";
import GridBox from "./partComponents/GridBox.jsx";

var HeadToolBar = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      undoable: false,
      redoable: false,
      contextItem: null,
      'user-info': {}
    }
  },

  clickSave(){
    this.emit('SaveCurrentContext');
  },

  signout(){
    this.emit("UserSignout");
  },

  exitbuilder(){
    this.emit("ExitBuilder");
  },

  undo(){
    this.emit('DocumentUndo');
  },

  redo(){
    this.emit('DocumentRedo');
  },

  modeChangeTablet(){
    this.emit('ChangeStageMode', {
      mode: 'tablet'
    });
  },

  modeChangeMobile(){
    this.emit('ChangeStageMode', {
      mode: 'mobile'
    });
  },

  modeChangeDesktop(){
    this.emit('ChangeStageMode', {
      mode: 'desktop'
    });
  },

  setData(_fieldName, _data){
    var addState = {};
    addState[_fieldName] = _data;
    this.setState(addState);
  },

  componentDidMount(){

  },

  componentDidMountByRoot(){
    console.log('Fire!!!');
    this.emit("NeedData", {
      field: ['user-info']
    });
  },

  render: function () {
    console.log(this.state);
    var saveDisabled = true;
    var undoDisabled = true;
    var redoDisabled = true;
    var modeChangeDisabled = true;

    if (this.state.contextItem !== null) {
      switch (this.state.contextItem.contextType) {
        case "document":
          //saveDisabled = false;
          modeChangeDisabled = false;
          break;
        case "page":
          //saveDisabled = false;
          modeChangeDisabled = false;
          break;
        case "apiInterface":
        case "apiSource":
          //saveDisabled = false;
          break;
      }

      if (this.state.contextItem.contextController.isUnsaved) {
        saveDisabled = false;
      }

      if (this.state.contextItem.contextType === 'document'/* || this.state.contextItem.contextType === 'page'*/) {
        if (this.state.contextItem.contextController.existsUndoHistory()) {
          undoDisabled = false;
        }

        if (this.state.contextItem.contextController.existsRedoHistory()) {
          redoDisabled = false;
        }
      }
    }

    return (
      <header className='HeadToolBar'>
        <ul className="navigation">
          <li style={{width:100}}>
            <OutlineButton icon='floppy-o' title='Save' color='white' iconSize='24' onClick={this.clickSave}
                           disabled={saveDisabled}/>
          </li>
          <li>
            <GridBox placements={[
                        [
                          <OutlineButton icon='reply' title='Undo' color='white' iconSize='24' onClick={this.undo} disabled={undoDisabled}/>,
                          <OutlineButton icon='share' title='Redo' color='white' iconSize='24' onClick={this.redo} disabled={redoDisabled}/>
                        ]
                      ]} width={140} height={80}/>
          </li>


          <li className='right'>

            <GridBox placements={[
                        [
                          <OutlineButton icon='user' title={this.state['user-info'].name || this.state['user-info'].userid} color='white' iconSize='12'/>
                        ],[
                          <OutlineButton icon='sign-out'  color='white' iconSize='22' onClick={this.signout} />,
                          <OutlineButton icon='power-off'  color='white' iconSize='22' onClick={this.exitbuilder} />
                        ]
                      ]} width={130} height={80}/>
          </li>
          <li className='right'>
            <GridBox placements={[
                        [
                          <OutlineButton icon='desktop' title='Desktop' color='white' onClick={this.modeChangeDesktop} disabled={modeChangeDisabled}/>
                        ],[
                          <OutlineButton icon='tablet' title='Tablet' color='white' onClick={this.modeChangeTablet} disabled={modeChangeDisabled}/>,
                          <OutlineButton icon='mobile' title='Mobile' color='white' onClick={this.modeChangeMobile} disabled={modeChangeDisabled}/>
                        ]
                      ]} width={140} height={80}/>
          </li>


        </ul>
      </header>
    )
  }
});

export default HeadToolBar;
