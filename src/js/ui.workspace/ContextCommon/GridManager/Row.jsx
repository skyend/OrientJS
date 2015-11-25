import React from 'react';
import GridManager from '../GridManager.jsx';
import './Row.less';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],
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

    let leftSpace = 5;
    let rightSpace = 5;
    let topSpace = 5;
    let bottomSpace = 5;

    if( this.state.activeHandleInsertRowBefore ) topSpace = 20;
    else if (this.state.activeHandleInsertRowAfter) bottomSpace = 20;

    this.props.elementNode.temporaryDecrementRectSize({
      width: leftSpace+rightSpace,
      height: topSpace+bottomSpace
    });


    // 부모의 넓이가 필요한 이유?
    // 자식의 넓이를 설정할 때 자식의 넓이를 적절히 분배하기 위해



    if( columnCount == 1 ){
      return <GridManager gridElementNode={this.props.elementNode.children[0]} left={leftSpace} top={topSpace} width={this.props.width-(leftSpace+rightSpace)} height={this.props.height-(topSpace+bottomSpace)}/>;
    } else {

      return this.props.elementNode.children.map(function(_column, _i){
        return <GridManager gridElementNode={_column}/>
      });
    }
  },

  renderColumnHolder(){
    console.log( this.props.elementNode.children );

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
