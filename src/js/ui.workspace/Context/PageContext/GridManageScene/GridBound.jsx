import React from 'react';
import './GridBound.less';
import GridElementBox from './GridBound/GridElementBox.jsx';

export default React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0,
      cellStep:20,
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

  getGetGridAvailableRect(){
    // 가로줄 수
    let horizonCount = Math.floor((this.props.height-30) / this.props.cellStep);

    // 세로줄 수
    let verticalCount = Math.floor(this.props.width / this.props.cellStep);

    let width = verticalCount * this.props.cellStep;
    let height = horizonCount * this.props.cellStep;

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

  },

  renderGridElement(){
    if( this.props.rootGridElement === null ){
      return (
        <div className='grid-element-wrapper'>
          {this.renderGridElementHolder()}
        </div>
      );
    }

    return (
      <div className='grid-element-wrapper'>
        <GridElementBox gridElement={this.props.rootGridElement}/>
      </div>
    );
  },

  renderGridMap(){
    let gridLines = [];
    let availableRect = this.getGetGridAvailableRect();



    let width = availableRect.width;
    let height = availableRect.height;

    // 가로줄 수
    let horizonCount = height / this.props.cellStep;

    // 세로줄 수
    let verticalCount = width / this.props.cellStep;

    let leftOffset = availableRect.left;
    let topOffset = availableRect.top;


    let style = {};

    // 가로 줄
    for( let i = 1; i < horizonCount; i++ ){
      style = {
        width:width,
        height: 1,
        left:leftOffset,
        top:topOffset + (this.props.cellStep*i)
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
        left:leftOffset + (this.props.cellStep*i),
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
        {this.renderGridElement()}
        {this.props.folding? this.renderFoldingHolder():''}
        {this.props.folding? '':this.renderGridMap()}
      </div>
    )
  }
});
