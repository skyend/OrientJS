import './GridManager.less';
import React from 'react';
import BehaviorGrid from './GridManager/Grid.jsx';
import BehaviorRow from './GridManager/Row.jsx';
import BehaviorColumn from './GridManager/Column.jsx';
import BehaviorLayer from './GridManager/Layer.jsx';
import HorizonField from '../../partComponents/HorizonField.jsx';

let GridManager = React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      //settingMode:false
    };
  },

  getDefaultProps(){
    return {
      gridElementNode: null,
      selectedGridNode:null,
      width:'100%',
      height:'100%',
      left:0,
      top:0,
      showGridMap:true,
      step:25
    };
  },

  // for ElementSettingPanel
  // onThrowCatcherChangedValue(_e){
  //
  //
  //   if( _e.name === 'RectWidth' ){
  //     this.emit("ElementRectEdit", {
  //       targetId: this.props.gridElementNode.getId(),
  //       rect: {
  //         width: _e.data,
  //         height: this.refs['input-rect-height'].getValue()
  //       }
  //     });
  //   } else if ( _e.name === 'RectHeight' ){
  //     this.emit("ElementRectEdit", {
  //       targetId: this.props.gridElementNode.getId(),
  //       rect: {
  //         width: this.refs['input-rect-width'].getValue(),
  //         height: _e.data
  //       }
  //     });
  //   }
  // },


  clickBehavior(){
    console.log( this.props.gridElementNode );
    console.log( this.props.gridElementNode.getCurrentRectangle());
  },

  clcikSetting(_e){
    _e.stopPropagation();
    this.emit("OpenGridElementNodeSetting", {
      gridElementNode: this.props.gridElementNode
    });

    this.emit("SelectGridElementNode", {
      gridElementNode: this.props.gridElementNode
    });
  },

  clickEraser(_e){
    _e.stopPropagation();

    this.emit("ClearGridElement", {
      targetId: this.props.gridElementNode.getId()
    });
  },

  clickTrash(_e){
    _e.stopPropagation();


    this.emit("RemoveGridElement", {
      targetId: this.props.gridElementNode.getId()
    });
  },

  addLayer(_e){
    _e.stopPropagation();


    this.emit("AppendNewLayer", {
      targetId: this.props.gridElementNode.getId()
    });
  },

  selectMe(_e){
    _e.stopPropagation();


    this.emit("SelectGridElementNode", {
      gridElementNode: this.props.gridElementNode
    });
  },

  // renderSettingPanel(){
  //   let elementRect = this.props.gridElementNode.getCurrentRectangle();
  //
  //   return (
  //     <div className='setting-panel'>
  //       <HorizonField fieldName='RectWidth' title='Rect Width' theme="dark" enterable={true} type='input'
  //                     onChange={ this.widthChanged }
  //                     defaultValue={elementRect.width} height={30} ref='input-rect-width'
  //                     nameWidth={100}/>
  //
  //       <HorizonField fieldName='RectHeight' title='Rect Height' theme="dark" enterable={true} type='input'
  //                     onChange={ this.heightChanged }
  //                     defaultValue={elementRect.height} height={30} ref='input-rect-height'
  //                     nameWidth={100}/>
  //     </div>
  //   )
  // },

  renderLayer(){
    return (
      <BehaviorColumn selectedGridNode={this.props.selectedGridNode} elementNode={this.props.gridElementNode} width={this.props.width} height={this.props.height-20} minHeight={this.props.height-20} top={20}/>
    )
  },

  renderColumn(){
    return (
      <BehaviorColumn selectedGridNode={this.props.selectedGridNode} elementNode={this.props.gridElementNode} width={this.props.width} height={this.props.height-20} minHeight={this.props.height-20} top={20}/>
    )
  },

  renderRow(){
    return (
      <BehaviorRow selectedGridNode={this.props.selectedGridNode} elementNode={this.props.gridElementNode} width={this.props.width} height={this.props.height-20} minHeight={this.props.height-20} top={20}/>
    )
  },

  renderGrid(){
    return (
      <BehaviorGrid selectedGridNode={this.props.selectedGridNode} elementNode={this.props.gridElementNode} width={this.props.width} height={this.props.height-20} minHeight={this.props.height-20} top={20}/>
    )
  },

  renderByBehavior(){
    let gridBehavior = this.props.gridElementNode.behavior;
    this.props.gridElementNode.resetTemporaryDecrementRectSize();
    this.props.gridElementNode.temporaryDecrementRectSize = {
      width: 0,
      height: 20
    };


    if( gridBehavior === 'grid' ){
      return this.renderGrid();
    } else if ( gridBehavior === 'row' ){
      return this.renderRow();
    } else if ( gridBehavior === 'column'){
      return this.renderColumn();
    } else if ( gridBehavior === 'layer' ){
      return this.renderLayer();
    } else {
      throw new Error('invalid behavior');
    }
  },

  renderChildrenTabs(){
    let self = this;
    // if( !/^column|layer$/.test(this.props.gridElementNode.behavior)) return;
    // if( !this.props.gridElementNode.isLayerContainer() ) return;


    return (
      <ul className='children-tab'>
        {function(){
          if( !self.props.gridElementNode.isLayerContainer() ) return;
          return (
            <li onClick={self.addLayer}>
              <i className='fa fa-plus'/>
            </li>
          );
        }()}
        {this.props.gridElementNode.childrenIteration(function(_child){
          let classes = [];
          let gridName = _child.getName() || '';
          if( _child === self.props.selectedGridNode ){
            classes.push("selected")
          }

          let forward = function(_e){
            _e.stopPropagation();

            //self.props.gridElementNode.childBringToBackIndex(_child);

            self.emit("SelectGridElementNode", {
              gridElementNode: _child
            });


            self.forceUpdate();
          };

          return (
            <li className={classes.join(' ')} onClick={forward} draggable={true}>
              {_child.behavior[0].toUpperCase()}#{_child.getId()}{gridName !== ''? <span className='name'>{"@"+gridName}</span>:''}
            </li>
          );
        })}
      </ul>
    )
  },

  renderOptionBar(){
    let gridBehavior = this.props.gridElementNode.behavior;
    let gridName = this.props.gridElementNode.getName() || '';


    return (
      <div className='options-bar' onClick={this.selectMe}>
        <ul>
          <li onClick={this.clickBehavior}>
            <span>{gridBehavior.toUpperCase()}#{this.props.gridElementNode.getId()}{gridName !== ''? "@"+gridName:''}</span>
          </li>
          <li className='interface' title="Setting me" onClick={this.clcikSetting}>
            <i className='fa fa-cog'/>
          </li>
          <li className='interface' title="Clear inside" onClick={this.clickEraser}>
            <i className='fa fa-eraser'/>
          </li>
          <li className='interface' title="Remove me" onClick={this.clickTrash}>
            <i className='fa fa-trash'/>
          </li>
        </ul>
        { this.renderChildrenTabs() }
      </div>
    )
  },

  renderGridMap(){
    if( !this.props.showGridMap ) return;

    let gridLines = [];
    let horizonCount = this.props.height / this.props.step;
    let verticalCount = this.props.width / this.props.step;
    let style = {};

    for( let i = 1; i < horizonCount; i++ ){
      style = {
        width:'100%',
        height: 1,
        left:0,
        top:this.props.step*i
      };

      gridLines.push(
        <div className='line' style={style}/>
      )
    }

    for( let i = 1; i < verticalCount; i++ ){
      style = {
        width:1,
        height: '100%',
        left:this.props.step*i,
        top:0
      };

      gridLines.push(
        <div className='line' style={style}/>
      )
    }

    // top
    style = {
      left:0,
      top:0,
      width:'100%',
      height:1
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // bottom
    style = {
      left:0,
      top:this.props.height-1,
      width:'100%',
      height:1
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // left
    style = {
      left:0,
      top:0,
      width:1,
      height:'100%'
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // right
    style = {
      left:this.props.width-1,
      top:0,
      width:1,
      height:'100%'
    };

    gridLines.push(
      <div className='line outline' style={style}/>
    )

    // horizon center
    style = {
      left:this.props.width/2,
      top:0,
      width:1,
      height:'100%'
    };

    gridLines.push(
      <div className='line center' style={style}/>
    )

    // vertical center
    style = {
      left:0,
      top:this.props.height/2,
      width:'100%',
      height:1
    };

    gridLines.push(
      <div className='line center' style={style}/>
    )


    return (
      <div className='grid-map'>
        {gridLines}
      </div>
    );
  },

  render(){
    let classes = ['GridManager', this.props.gridElementNode.behavior];
    let style = {
      width:this.props.width,
      height:this.props.height,
      left:this.props.left,
      top:this.props.top
    };

    if( this.props.gridElementNode === this.props.selectedGridNode){
      classes.push('selected');
    }

    return (
      <div className={classes.join(' ')} style={style}>
        { this.renderOptionBar() }
        { this.renderByBehavior() }
        { this.renderGridMap() }
      </div>
    )
  }
});

export default GridManager;
