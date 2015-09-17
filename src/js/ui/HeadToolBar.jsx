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

    clickSave(){
      this.emit('SaveCurrentContext');
    },

    modeChangeTablet(){
      this.emit('ChangeStageMode', {
        mode:'tablet'
      });
    },

    modeChangeMobile(){
      this.emit('ChangeStageMode', {
        mode:'mobile'
      });
    },

    modeChangeDesktop(){
      this.emit('ChangeStageMode', {
        mode:'desktop'
      });
    },

    render: function () {
        return (
            <header className='HeadToolBar'>
                <ul className="navigation">
                    <li style={{width:100}}>
                        <OutlineButton icon='floppy-o' title='Save' color='white' iconSize='24' onClick={this.clickSave}/>
                    </li>
                    <li>
                      <GridBox placements={[
                        [
                          <OutlineButton icon='reply' title='Undo' color='white' iconSize='24' onClick={this.modeChangeTablet}/>,
                          <OutlineButton icon='share' title='Redo' color='white' iconSize='24' onClick={this.modeChangeMobile}/>
                        ]
                      ]} width={140} height={80}/>
                    </li>


                    <li className='right' style={{width:130}}>
                      <OutlineButton icon='user' title='I-ON Guest' color='white' iconSize='24' onClick={this.modeChangeDesktop}/>
                    </li>
                    <li className='right'>
                      <GridBox placements={[
                        [
                          <OutlineButton icon='desktop' title='Desktop' color='white' onClick={this.modeChangeDesktop}/>
                        ],[
                          <OutlineButton icon='tablet' title='Tablet' color='white' onClick={this.modeChangeTablet}/>,
                          <OutlineButton icon='mobile' title='Mobile' color='white' onClick={this.modeChangeMobile}/>
                        ]
                      ]} width={140} height={80}/>
                    </li>


                </ul>
            </header>
        )
    }
});

export default HeadToolBar;
