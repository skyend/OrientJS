import './ElementHierarchyViewer.less';
import _ from 'underscore';
import React from 'react';

export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      selectedElementNode:null
    }
  },

  renderElementNodeFriends(_elementNode){
    return "renderElementNodeFriends";
  },

  renderElementNodeBlock(_elementNode, _reversedIndex, _isLast){
    let that = this;
    let type = _elementNode.getType();
    let style = {
      zIndex : _reversedIndex
    };

    function mouseEnterFunc(){
      that.emit("MouseEnterElementNode", {
        elementNode: _elementNode
      });
    }

    function mouseLeaveFunc(){
      that.emit("MouseLeaveElementNode", {
        elementNode: _elementNode
      });
    }

    function clickFunc(){
      that.emit("SelectElementNode", {
        elementNode: _elementNode
      });
    }

    function contextMenuFunc(_e){
      _e.preventDefault();

      // 선택된 요소의 같은 레벨에 있는 요소를 세로 리스트로 랜더링한다.
      // 나중에 개발
      that.setState({showFriends:_elementNode});
      return false;
    }
 
    if(type === 'string'){
      return <li className='string' style={style} onMouseEnter={mouseEnterFunc} onMouseLeave={mouseLeaveFunc} onClick={clickFunc} onContextMenu={contextMenuFunc}>
        <span className='type'>STRING</span>
      </li>;
    }

    let attributes = _elementNode.attributes;





    return <li className='tag-based' style={style} onMouseEnter={mouseEnterFunc} onMouseLeave={mouseLeaveFunc} onClick={clickFunc} onContextMenu={contextMenuFunc}>
      {type !== 'html' ? <span className='type'>{type}</span>:''}
      <span className='tagName'>
        {_elementNode.getTagName()}
      </span>
      { ( attributes.id !== undefined && attributes.id !== '' ) ? <span className='id'>{attributes.id}</span>:''}
      { ( attributes.class !== undefined && attributes.class !== '' ) ? <span className='class'>{attributes.class}</span>:''}

    </li>
  },

  renderList(){
    if( this.props.selectedElementNode === null ){
      return <li className='placeholder'>
        No Selected
      </li>
    }

    let that = this;

    let parentList = this.props.selectedElementNode.getParentList();
    let parentCount = parentList.length;

    let renderElementNodeBlocks = [];

    parentList.map(function(_elementNode, _i){
      renderElementNodeBlocks.push(that.renderElementNodeBlock(_elementNode,parentCount - _i));
    });

    renderElementNodeBlocks.push( this.renderElementNodeBlock(this.props.selectedElementNode, 0,true) );

    return renderElementNodeBlocks;
  },

  render(){


    return (
      <div className='ElementHierarchyViewer'>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    )
  }
});
