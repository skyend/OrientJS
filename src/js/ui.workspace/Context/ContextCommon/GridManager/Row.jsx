import React from 'react';
import GridManager from '../GridManager.jsx';
import './Row.less';

export default React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      activeHandleInsertRowBefore:false,
      activeHandleInsertRowAfter:false
    };
  },

  getDefaultProps(){
    return {
      elementNode:null,
      width:'auto',
      height:'auto',
      minWidth:'auto',
      minHeight:'auto'
    };
  },

  appendColumn(){
    console.log("?", this.props.elementNode);

    this.emit("AppendNewColumn", {
      targetId: this.props.elementNode.getId()
    });
  },

  activeHandleInsertRowBefore(){
    this.setState({activeHandleInsertRowBefore:true});
  },

  activeHandleInsertRowAfter(){
    this.setState({activeHandleInsertRowAfter:true});
  },

  inactiveHandleInsertRowBefore(){
    this.setState({activeHandleInsertRowBefore:false});
  },

  inactiveHandleInsertRowAfter(){
    this.setState({activeHandleInsertRowAfter:false});
  },

  appendBeforeNewRow(){
    this.emit("AppendBeforeNewRow", {
      targetId: this.props.elementNode.getId()
    });
  },

  appendAfterNewRow(){
    this.emit("AppendAfterNewRow", {
      targetId: this.props.elementNode.getId()
    });
  },

  renderOutline(){
    return(
      <div className='outline-container'>
        <div className='outline left' />
        <div className='outline right'/>
        <div className='outline top activable' onClick={this.appendBeforeNewRow} onMouseOver={this.activeHandleInsertRowBefore} onMouseOut={this.inactiveHandleInsertRowBefore}/>
        <div className='outline bottom activable' onClick={this.appendAfterNewRow} onMouseOver={this.activeHandleInsertRowAfter} onMouseOut={this.inactiveHandleInsertRowAfter}/>
      </div>
    );
  },

  renderColumns(){
    let columnCount = this.props.elementNode.children.length;

    let leftSpace = 2;
    let rightSpace = 2;
    let topSpace = 2;
    let bottomSpace = 2;

    if( this.state.activeHandleInsertRowBefore ) topSpace = 10;
    else if (this.state.activeHandleInsertRowAfter) bottomSpace = 10;

    this.props.elementNode.temporaryDecrementRectSize = {
      width: leftSpace+rightSpace,
      height: topSpace+bottomSpace
    };
    let assignedWidth = this.props.width-(leftSpace+rightSpace);
    let assignedHeight = this.props.height-(topSpace+bottomSpace);

    let myContainerSize = this.props.elementNode.calcContainerSize();

    let widthRatio = assignedWidth / myContainerSize.width;
    let heightRatio = assignedHeight / myContainerSize.height;

    // 부모의 넓이가 필요한 이유?
    // 자식의 넓이를 설정할 때 자식의 넓이를 적절히 분배하기 위해
    //let containerSize = this.props.elementNode.calcContainerSize();

    if( columnCount == 1 ){
      let childContainerSize = this.props.elementNode.children[0].calcContainerSize();
      let width = childContainerSize.width * widthRatio;
      let height = childContainerSize.height * heightRatio;

      return <GridManager gridElementNode={this.props.elementNode.children[0]} left={leftSpace} top={topSpace} width={width} height={height}/>;
    } else {

      let divideWidth = assignedWidth / columnCount;
      let divideHeight = assignedHeight;


      return this.props.elementNode.children.map(function(_column, _i){
        let childContainerSize = _column.calcContainerSize();

        let width = childContainerSize.width === undefined ? divideWidth : childContainerSize.width * widthRatio;
        let height = childContainerSize.height === undefined ? divideHeight : childContainerSize.height * heightRatio;

        return <GridManager gridElementNode={_column} left={leftSpace} top={topSpace} width={width} height={height}/>
      });
    }
  },

  renderColumnHolder(){
    //console.log( this.props.elementNode.children );

    return (
      <div className='column-holder'>
        <button onClick={this.appendColumn}>
          Add First Column
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
      <div className='behavior behavior-row' style={style}>
        { this.renderOutline() }
        { this.props.elementNode.children.length > 0 ? this.renderColumns():this.renderColumnHolder() }
      </div>
    )
  }
});
