import React from 'react';
import './GridTreeView.less';
import OutlineButton from '../../../partComponents/OutlineButton.jsx';

let sharedCopyData = {};
sharedCopyData.grid = null;
sharedCopyData.rows = null;
sharedCopyData.column = null;
sharedCopyData.columnChildren = null;

export default React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      width:0,
      height:0,
      folding:false, // 접기
      rootGridElement: null,
      selectedGridElement: null,
      indentSize:20
    };
  },

  getInitialState(){
    return {
      multiplier:1
    }
  },

  fold(){
    this.emit("FoldTreeView");
  },

  unfold(){
    this.emit("UnfoldTreeView")
  },

  clcikSetting(_e, _gridNode){
    _e.stopPropagation();
    this.emit("OpenElementNodeGeometryEditor", {
      gridElementNode: _gridNode
    });

    this.emit("SuccessfullyElementNodeSelected", {
      elementNode: _gridNode
    });
  },

  clickEraser(_e, _gridNode){
    _e.stopPropagation();

    this.emit("ClearGridElement", {
      targetId: _gridNode.getId()
    });
  },

  clickTrash(_e, _gridNode){
    _e.stopPropagation();

    this.emit("RemoveGridElement", {
      targetId: _gridNode.getId()
    });
  },

  copyElement(){
    let copyData = this.props.selectedGridElement.export(true);
    // this.emit('NoticeMessage', {
    //   title: "복사 완료",
    //   message: "Grid 가 복사되었습니다.",
    //   level: "info"
    // });
  },

  copyChildren(){
    let copyData = this.props.selectedGridElement.export(true);
    // this.emit('NoticeMessage', {
    //   title: "복사 완료",
    //   message: "Grid 가 복사되었습니다.",
    //   level: "info"
    // });
  },

  paste(){
    let copyData = this.props.selectedGridElement.export(true);
    // this.emit('NoticeMessage', {
    //   title: "붙여넣기 완료",
    //   message: "Grid가 삽입 되었습니다.",
    //   level: "info"
    // });
  },

  appendRow(){
    this.emit("AppendNewRow", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  appendColumn(){
    this.emit("AppendNewColumn", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  appendBeforeNewRow(){
    this.emit("AppendBeforeNewRow", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  appendAfterNewRow(){
    this.emit("AppendAfterNewRow", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  appendBeforeNewColumn(){
    this.emit("AppendBeforeNewColumn", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  appendAfterNewColumn(){
    this.emit("AppendAfterNewColumn", {
      targetId: this.props.selectedGridElement.getId()
    });
  },

  componentDidMount(){
    let self = this;

  },

  renderGridElementFootInfo(_gridElement){
    let returnInfoElements = [];
    let className = _gridElement.getAttribute('class');
    let idName = _gridElement.getAttribute('id');

    if( idName !== '' && idName !== undefined ){
      returnInfoElements.push( <span className='subject id'>{idName}</span> );
    }

    if( className !== '' && className !== undefined ){
      returnInfoElements.push( <span className='subject class'>{className}</span> );
    }

    return returnInfoElements;
  },

  renderGridElement(_gridElement, _depth){

    if(_gridElement === null){
      return <div>
        No Grid
      </div>;
    }


    let self = this;
    let indentBlocks = [];
    let indentStyle = {
      width:this.props.indentSize
    };
    let infoStyle = {
      left: (this.props.indentSize*_depth) + 60
    }

    for(let i = 0; i < _depth; i++ ){
      indentBlocks.push(
        <div className='indent-block' style={indentStyle}/>
      );
    }

    let thumbIcon;
    if( _gridElement.behavior === 'grid' ){
      thumbIcon = <i className='fa fa-th-large'/>;
    } else if( _gridElement.behavior === 'row' ){
      thumbIcon = <i className='fa fa-bars'/>;
    } else if( _gridElement.behavior === 'column' ){
      thumbIcon = <i className='fa fa-columns'/>;
    } else if( _gridElement.behavior === 'layer' ){
      thumbIcon = <i className='fa fa-plane'/>;
    }

    let selectGridNode = function(){
      self.emit("SuccessfullyElementNodeSelected",{
        elementNode:_gridElement
      });
    }
      console.log('TreeView')
    if( this.followingFragment !== null ){

      if( _gridElement.loadedFollowingFragmentObject === null ){
        _gridElement.loadFollowingFragmentObject(function(_fragment){
          self.forceUpdate();
        });
      } else if( _gridElement.followingFragment !== _gridElement.loadedFollowingFragmentObject._id ){
        _gridElement.loadFollowingFragmentObject(function(_fragment){
          self.forceUpdate();
        });
      }
    } else {
      //
      // if( this.followingFragment !== _gridElement.loadedFollowingFragmentObject._id ){
      //     _gridElement.loadFollowingFragmentObject(function(_fragment){
      //       self.forceUpdate();
      //     });
      // }
    }

    return (
      <div className='grid-element'>
        <div className={"row" + (this.props.selectedGridElement === _gridElement? ' selected':'')} onClick={selectGridNode} >
          {indentBlocks}
          <div className='thumb'>
            <div className='box'>
              {thumbIcon}
            </div>
          </div>
          <div className="info" style={infoStyle}>
            <span className='behavior'>{_gridElement.behavior}</span>
            {/*<span className='id'>{_gridElement.getId()}</span>*/}
            <div className='foot-info'>
              { this.renderGridElementFootInfo(_gridElement)}
            </div>

            { _gridElement.followingFragment !== null ? <span className='attached-fragment'><i className='fa fa-chain fa-spin'/><span className='fragment'><i className='fa fa-html5'/>{_gridElement.loadedFollowingFragmentObject !== null ? _gridElement.loadedFollowingFragmentObject.title:this.followingFragment}</span></span>:''}

            <div className='options'>
              <li className='interface' title="Setting me" onClick={function(_e){self.clcikSetting(_e, _gridElement)}}>
                <i className='fa fa-cog'/>
              </li>
              <li className='interface' title="Clear inside" onClick={function(_e){self.clickEraser(_e, _gridElement)}}>
                <i className='fa fa-eraser'/>
              </li>
              <li className='interface' title="Remove me" onClick={function(_e){self.clickTrash(_e, _gridElement)}}>
                <i className='fa fa-trash'/>
              </li>
            </div>
          </div>
        </div>

        {_gridElement.childrenIteration(function(_child){
          return self.renderGridElement(_child, _depth+1)
        })}
      </div>
    )
  },

  renderGridHierarachy(){
    console.log(this.props.rootGridElement, this.selectedGridElement);
    return (
      <div className='grid-hierarachy'>
        { this.renderGridElement(this.props.rootGridElement, 0)}
      </div>
    )
  },

  renderBottomArea(){
    let renderItems = [];

    if( this.props.selectedGridElement === null ) return;

    let behavior = this.props.selectedGridElement.behavior;

    // renderItems.push(
    //   <li className='button text' onClick={this.copyRows}>
    //     <i className='fa fa-clipboard'/> Copy
    //   </li>
    // );
    //
    // renderItems.push(
    //   <li className='button text' onClick={this.pasteRows}>
    //     <i className='fa fa-clipboard'/> Copy children
    //   </li>
    // );
    //
    // renderItems.push(
    //   <li className='button text' onClick={this.pasteRows}>
    //     <i className='fa fa-pencil-square'/> Paste
    //   </li>
    // );

    if( behavior === 'grid' ){
      renderItems.push(
        <li className='button text' onClick={this.appendRow}>
          <i className='fa fa-plus-square-o'/> Append Row
        </li>
      );
    } else if( behavior === 'row' ){
      renderItems.push(
        <li className='button text' onClick={this.appendColumn}>
          <i className='fa fa-plus-square-o'/> Append Column
        </li>
      );
      renderItems.push(
        <li className='button text' onClick={this.appendBeforeNewRow}>
          <i className='fa fa-arrow-circle-o-right'/> Ins Row Before
        </li>
      );
      renderItems.push(
        <li className='button text' onClick={this.appendAfterNewRow}>
          <i className='fa fa-arrow-circle-o-left'/> Ins Row After
        </li>
      );
    } else if( behavior === 'column' ){
      renderItems.push(
        <li className='button text' onClick={this.appendBeforeNewColumn}>
          <i className='fa fa-arrow-circle-o-right'/> Ins Column Before
        </li>
      );
      renderItems.push(
        <li className='button text' onClick={this.appendAfterNewColumn}>
          <i className='fa fa-arrow-circle-o-left'/> Ins Column After
        </li>
      );
    } else if( behavior === 'layer' ){

    }


    return (
      <div className='bottom-area'>
        <ul className='navigator left-navigator'>
          {renderItems}
        </ul>
      </div>
    )
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


    return (
      <div className='top-area'>
        <div className='title'>
          Grid Tree Viewer
        </div>

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
        <i className='fa fa-align-left'/>
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
      <div className='GridTreeView' style={style}>
        {this.renderTopArea()}
        {this.props.folding? this.renderFoldingHolder():''}
        {this.props.folding? '':this.renderGridHierarachy()}
        {this.props.folding? '':this.renderBottomArea()}
      </div>
    )
  }
});
