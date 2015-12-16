/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */


import './Modal.less';
import React from "react";
import ToolNest from './ToolNest.jsx';

var Modal = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getInitialState() {
    return {
      toolEgg: null,
      helperShow: false
    }
  },

  onThrowCatcherClose(){
    this.removeAttachedTool();
  },

  removeAttachedTool(){
    this.setState({toolEgg: null});
  },

  toggleHelper(){
    this.setState({helperShow: !this.state.helperShow});
  },

  componentDidUpdate(){


  },

  renderHelper(){
    if (!this.state.helperShow) return;

    return <div className='info-popover'>
      <div className='info-title'>
        aa
      </div>
      <div className='info-body'>
        {this.state.toolEgg.toolHelperText}
      </div>
    </div>;
  },

  renderToolNest(){


    return (
      <ToolNest toolEgg={this.state.toolEgg}/>
    );
  },

  renderContent(){
    if (this.state.toolEgg === null) {
      return '';
    }

    return (
      <div className='window-wrapper'>

        { this.renderHelper() }

        <div className='window-header'>
          <div className='title'>
            <i className='fa fa-paw icon'/>
            {this.state.toolEgg.toolTitle}
          </div>

          <div className='close' onClick={this.removeAttachedTool}>
            <i className='fa fa-times'/>
          </div>

          <div className='helper' onClick={this.toggleHelper}>
            <i className='fa fa-exclamation'/>
          </div>

        </div>
        { this.renderToolNest() }
      </div>
    )
  },

  renderModalLayout(){

    return (
      <div className='modal-window-area'>
        <div className='modal-window'>
          { this.renderContent() }
        </div>
      </div>
    )
  },

  render: function () {
    var classes = ['ModalSpace'];
    var modalLayout;

    if (this.state.toolEgg !== null) {
      classes.push('on');
    }

    return (
      <div className={classes.join(' ')}>

        {this.renderModalLayout()}
      </div>
    )
  }
});

export default Modal;
