import './ToolNavigation.less';
import React from 'react';
import EventDistributor from './reactMixin/EventDistributor.js';
import ToolNest from './ToolNest.jsx';

var  ToolNavigation = React.createClass({
  mixins:[EventDistributor],

  propTypes:{
    position:React.PropTypes.string, // left, top, bottom, right
    theme:React.PropTypes.string, // dark
    defaultToolSize:React.PropTypes.integer,
    maxSize:React.PropTypes.integer,
    initialShow:React.PropTypes.boolean
  },

  getDefaultProps(){
    return {
      position:'bottom', // left, top, bottom, right
      theme:'dark', // dark
      defaultToolSize:300,
      maxSize:500,
      initialShow:false
    };
  },

  getInitialState(){
    return {
        toolSize:this.props.defaultToolSize,
        toolEgg: null,
        show:this.props.initialShow || false,
    };
  },

  mouseDownNavi(){
    this.mouseDown = true;
  },

  mouseUpNavi(){
    this.mouseDown = false;
  },

  mouseMoveOver(){
    if( this.state.toolEgg === null ) return;

    if( this.mouseDown ){
      app.ui.occupyGlobalDrag(this, true);
      app.ui.enableGlobalDrag();
      app.ui.toMouseDawn();


      this.mouseDown = false;
    }
  },

  onGlobalDragStartFromUI(_e) {
    //console.log('start drag');

  },

  onGlobalDragFromUI(_e) {

    var changedSize;
    if( this.naviType === 'vertical' ){
      changedSize = this.state.toolSize - _e.movementY;
    } else if( this.naviType === 'horizontal' ){
      changedSize = this.state.toolSize - _e.movementX;
    }

    if( changedSize < 100 ) changedSize = 100;
    if( changedSize > this.props.maxSize ) changedSize = this.props.maxSize;

    this.setState({toolSize:changedSize});
  },

  onGlobalDragStopFromUI(_e) {
    //console.log('stop drag');
  },


  toggleShow(){
    this.setState({show:!this.state.show});
  },

  clickNaviToolItem(_item){
    if( this.state.toolEgg !== null ){
      if( this.state.toolEgg.toolKey === _item.equipToolKey ){
        this.setState({toolEgg:null});
        return;
      }
    }

    //requestAttachTool
    this.emit("RequestAttachTool", {
      "toolKey": _item.equipToolKey,
      "where":this.__myRefByParent
    });
  },

  componentDidUpdate(){
    this.emit("Resized");
  },

  componentDidMount(){
    switch(this.props.position){
      case "left":
      case "right":
      this.naviType = 'horizontal';
      break;
      case "top":
      case "bottom":
      this.naviType = 'vertical';
      break;
    }
  },

  renderToolNest(){
    if( this.state.toolEgg === null ) return '';

    return (
      <ToolNest toolEgg={this.state.toolEgg}/>
    );
  },

  renderToolGroupItem(_item){
    var self = this;

    function closure(){
      self.clickNaviToolItem(_item);
    }

    var classes = [];
    if( this.state.toolEgg !== null ){
      if( this.state.toolEgg.toolKey === _item.equipToolKey ){
        classes.push('opend');
      }
    }


    return (
      <li className={classes.join(' ')} onClick={closure}>
        { this.props.showIcon? <i className={'fa fa-'+_item.icon}/>:'' }
        <span> </span>
        { this.props.showTitle? _item.title:'' }
      </li>
    );
  },

  renderToolGroup(_group){
    return (
      <li className='group'>
        <ul className='group-items'>
          { _group.menuItems.map( this.renderToolGroupItem) }
        </ul>
      </li>
    );
  },
  renderToolGroupNavigation(){
    return (
      <ul className='tool-groups'>
        { this.props.config.menuGroups.map(this.renderToolGroup) }

        <li className='single right' onClick={this.toggleShow}>
          <i className='fa fa-times'/>
        </li>
      </ul>
    );
  },

  render(){
    var classes = [];
    var styles = {};

    classes.push('ToolNavigation');
    classes.push('pos-'+this.props.position);
    classes.push(this.props.theme);

    var toolSize = this.state.toolSize;
    if( this.state.toolEgg === null ){
      toolSize = 27;
    }

    if( this.naviType === 'vertical' ){
      styles['width'] = '100%';
      styles['height'] = toolSize;
    } else if( this.naviType === 'horizontal' ){
      styles['width'] = toolSize;
      styles['height'] = '100%';
    }


    if( this.state.show ){
      styles['display'] = 'block';
    } else {
      styles['display'] = 'none';
      styles['height'] = 0;
    }

    return (
      <div className={classes.join(' ')} style={{}} style={styles}>
        <div className='navigator' onMouseMove={this.mouseMoveOver} onMouseDown={this.mouseDownNavi} onMouseUp={this.mouseUpNavi}>
          { this.renderToolGroupNavigation() }
        </div>

        <div className='tool-zone'>
          { this.renderToolNest() }
        </div>
      </div>
    )
  }
});

export default ToolNavigation;
