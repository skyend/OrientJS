import React from 'react';
import GridManager from '../GridManager.jsx';
import './Grid.less';

export default React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      elementNode:null,
      width:'auto',
      height:'auto',
      minWidth:'auto',
      minHeight:'auto'
    };
  },

  appendRow(){
    console.log("?", this.props.elementNode);

    this.emit("AppendNewRow", {
      targetId: this.props.elementNode.getId()
    });
  },

  renderOutline(){
    return(
      <div className='outline-container'>
        <div className='outline left'/>
        <div className='outline right'/>
        <div className='outline top' />
        <div className='outline bottom'/>
      </div>
    );
  },

  renderRows(){

    let rowCount = this.props.elementNode.children.length;
    let leftSpace = 2;
    let rightSpace = 2;
    let topSpace = 2;
    let bottomSpace = 2;

    this.props.elementNode.temporaryDecrementRectSize = {
      width: leftSpace+rightSpace,
      height: topSpace+bottomSpace
    };

    let assignedWidth = this.props.width-(leftSpace+rightSpace);
    let assignedHeight = this.props.height-(topSpace+bottomSpace);

    //비율 계산
    // 실제 넓이 1000
    // 주어진 넓이 900
    let myContainerSize = this.props.elementNode.calcContainerSize();

    let widthRatio = assignedWidth / myContainerSize.width
    let heightRatio = assignedHeight / myContainerSize.height;

    if( rowCount == 1 ){
      let childContainerSize = this.props.elementNode.children[0].calcContainerSize();
      let width = childContainerSize.width * widthRatio;
      let height = childContainerSize.height * heightRatio;

      return <GridManager gridElementNode={this.props.elementNode.children[0]} left={leftSpace} top={topSpace} width={width} height={height}/>;
    } else {
      //console.log( this.props.elementNode.calcContainerSize() );

      let divideWidth = assignedWidth;
      let divideHeight = assignedHeight / rowCount;

      // 비율을 계산하여 assigned 값에 대입하여 처리하자 Okay!!!! 조금더 가까이
      //
      // let sumWidth = 0;
      // let sumHeight = 0;
      // this.props.elementNode.childrenIteration(function(_child){
      //   let childContainerSize = _child.calcContainerSize();
      //   sumWidth += childContainerSize.width; // rows의 경우 width를 모두 더하면 안된다 줄이 바뀌므로 개별로 접근해야한다.
      //   sumHeight += childContainerSize.height;
      // });


      return this.props.elementNode.children.map(function(_row, _i){
        let childContainerSize = _row.calcContainerSize();

        let width = childContainerSize.width === undefined ? divideWidth : childContainerSize.width * widthRatio;
        let height = childContainerSize.height === undefined ? divideHeight : childContainerSize.height * heightRatio;

        return <GridManager gridElementNode={_row} left={leftSpace} top={topSpace} width={width} height={height}/>
      });
    }
  },

  renderRowHolder(){
    console.log( this.props.elementNode.children );

    return (
      <div className='row-holder'>
        <button onClick={this.appendRow}>
          Add First Row
        </button>
      </div>
    )
  },

  render(){
    let style = {
      width:this.props.width,
      height:this.props.height,
      minWidth:this.props.minWidth,
      minHeight:this.props.minHeight,
      left:this.props.left,
      top:this.props.top
    };

    return (
      <div className='behavior behavior-grid' style={style}>
        { this.renderOutline() }
        { this.props.elementNode.children.length > 0 ? this.renderRows():this.renderRowHolder() }
      </div>
    )
  }
});
