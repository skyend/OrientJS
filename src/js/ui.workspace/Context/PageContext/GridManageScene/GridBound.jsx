import React from 'react';
import './GridBound.less';
import GridElementBox from './GridBound/GridElementBox.jsx';
import OutlineButton from '../../../partComponents/OutlineButton.jsx';

export default React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0,
      cellStep:50,
      screenMode:'desktop',
      folding:false, // 접기
      rootGridElement: null,
      selectedGridElement: null
    };
  },

  getInitialState(){
    return {
      multiplier:1
    }
  },

  fold(){
    this.emit("Fold");
  },

  unfold(){
    this.emit("Unfold")
  },

  getCellStep(){
    return this.props.cellStep / this.state.multiplier;
  },

  creatRootGrid(){
    this.emit("CreateRootGrid");
  },

  getGetGridAvailableRect(){
    let cellStep = this.getCellStep();
    // 가로줄 수
    let horizonCount = Math.floor((this.props.height-30) / cellStep);

    // 세로줄 수
    let verticalCount = Math.floor(this.props.width / cellStep);

    let width = verticalCount * cellStep;
    let height = horizonCount * cellStep;

    let leftOffset = (this.props.width - width)/2;
    let topOffset = ((this.props.height - 30) - height)/2;

    return {
      width: width,
      height: height,
      left:leftOffset,
      top:topOffset
    };
  },

  renderGridElementHolder(){
    return <div className='holder'>
      <OutlineButton icon='th-large' width="200" title='Create Root Grid' color='blue' titleSize='14' iconSize='16' onClick={this.creatRootGrid}/>
    </div>
  },

  renderGridElement(){
    console.log('root GridRender', this.props.rootGridElement, this.props);
    let availableRect = this.getGetGridAvailableRect();

    if( this.props.rootGridElement === null ){
      return (
        <div className='grid-element-wrapper' style={availableRect}>
          {this.renderGridElementHolder()}
        </div>
      );
    }

    this.props.rootGridElement.screenSize = {
      width: availableRect.width,
      height: availableRect.height
    };

    return (
      <div className='grid-element-wrapper' style={availableRect}>
        <GridElementBox gridElement={this.props.rootGridElement} selectedGridElement={this.props.selectedGridElement} multiplier={this.state.multiplier} screenMode={this.props.screenMode}/>
      </div>
    );
  },

  renderGridMap(){
    let gridLines = [];
    let availableRect = this.getGetGridAvailableRect();
    let cellStep = this.getCellStep();


    let width = availableRect.width;
    let height = availableRect.height;

    // 가로줄 수
    let horizonCount = height / cellStep;

    // 세로줄 수
    let verticalCount = width / cellStep;

    let leftOffset = availableRect.left;
    let topOffset = availableRect.top;


    let style = {};

    // 가로 줄
    for( let i = 1; i < horizonCount; i++ ){
      style = {
        width:width,
        height: 1,
        left:leftOffset,
        top:topOffset + (cellStep*i)
      };

      gridLines.push(
        <div className='line' style={style}/>
      )
    }

    // 세로 줄
    for( let i = 1; i < verticalCount; i++ ){
      style = {
        width:1,
        height: height,
        left:leftOffset + (cellStep*i),
        top:topOffset
      };

      gridLines.push(
        <div className='line' style={style}/>
      )
    }

    // top
    style = {
      left:leftOffset,
      top:topOffset,
      width:width,
      height:1
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // bottom
    style = {
      left:leftOffset,
      top:topOffset+height,
      width:width,
      height:1
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // left
    style = {
      left:leftOffset,
      top:topOffset,
      width:1,
      height:height
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // right
    style = {
      left:leftOffset+width,
      top:topOffset,
      width:1,
      height:height
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // center of horizon
    style = {
      left:leftOffset+width/2,
      top:topOffset,
      width:1,
      height:height
    };

    gridLines.push(
      <div className='line center' style={style}/>
    )

    // center of vertical
    style = {
      left:leftOffset,
      top:topOffset + (height/2),
      width:width,
      height:1
    };

    gridLines.push(
      <div className='line center' style={style}/>
    )


    return (
      <div className='grid-area'>
        <div className='grid-map'>
          {gridLines}
        </div>
      </div>
    );
  },

  renderTopArea(){
    if( this.props.folding ){
      return (
        <div className='top-area'>
          <ul className='navigator right-navigator'>
            <li onClick={this.unfold}>
              <i className='fa fa-toggle-off'/>
            </li>
          </ul>
        </div>
      )
    }
    let self = this;
    let multipliers = [.5,1,2,3];
    let availableRect = this.getGetGridAvailableRect();

    return (
      <div className='top-area'>
        <div className='title'>
          {this.props.screenMode}
        </div>


        <ul className='navigator left-navigator'>
          {multipliers.map(function(_m){
            let switchMultiplier = function(){
              self.setState({multiplier:_m});
            };

            return (
              <li className={self.state.multiplier == _m ? 'button active':'button'} onClick={switchMultiplier}>
                x{(_m+"").replace(/^0\./,'.')}
              </li>
            );
          })}

          <li className='text'>
            {availableRect.width * this.state.multiplier} x {availableRect.height * this.state.multiplier}
          </li>
        </ul>

        <ul className='navigator right-navigator'>
          <li className='button' onClick={this.fold}>
            <i className='fa fa-toggle-on'/>
          </li>
        </ul>
      </div>
    );
  },

  renderFoldingHolder(){
    return (
      <div className='folding-holder'>
        <i className={'fa fa-'+this.props.screenMode}/>
      </div>
    )
  },

  render(){
    let style = {
      width: this.props.width,
      height: this.props.height,
      //left: this.props.left,
      top: this.props.top
    };

    return (
      <div className='GridBound' style={style}>
        {this.renderTopArea()}
        {this.props.folding? '':this.renderGridElement()}
        {this.props.folding? this.renderFoldingHolder():''}
        {this.props.folding? '':this.renderGridMap()}
      </div>
    )
  }
});
