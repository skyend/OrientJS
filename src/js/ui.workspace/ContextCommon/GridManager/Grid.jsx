import React from 'react';
import GridManager from '../GridManager.jsx';
import './Grid.less';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

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
    console.log(rowCount, this.props.elementNode.children[0]);
    if( rowCount == 1 ){
      console.log( this.props.height, 'renderRows');
      return <GridManager gridElementNode={this.props.elementNode.children[0]} left={5} top={5} width={this.props.width-10} height={this.props.height-10}/>;
    } else {
      console.log( this.props.elementNode.calcContainerSize() );
      return this.props.elementNode.children.map(function(_row, _i){
        return <GridManager gridElementNode={_row}/>
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
