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
      naviSize:27,
      maxSize:500,
      fontSize:12,
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
      app.ui.startGlobalDrag();

      this.mouseDown = false;
    }
  },

  onGlobalDragStartFromUI(_e) {
    //console.log('start drag');

  },

  onGlobalDragFromUI(_e) {

    var changedSize;
    if( this.naviType === 'vertical' ){
      var moveY = _e.movementY;
      if( this.props.position === 'top' ){
        moveY *= -1;
      }
      changedSize = this.state.toolSize - moveY;
    } else if( this.naviType === 'horizontal' ){
      var moveX = _e.movementX;
      if( this.props.position === 'left' ){
        moveX *= -1;
      }

      changedSize = this.state.toolSize - moveX
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
    // switch(this.props.position){
    //   case "left":
    //   case "right":
    //   this.naviType = 'horizontal';
    //   break;
    //   case "top":
    //   case "bottom":
    //   this.naviType = 'vertical';
    //   break;
    // }
  },

  componentWillMount(){
    console.log(this.props);

    switch(this.props.position){
      case "left":
      case "right":
      console.log('heere');
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
    var closeableElement;
    if( this.props.closeable ){
      closeableElement = (
        <li className='single right' onClick={this.toggleShow}>
          <i className='fa fa-times'/>
        </li>
      );
    }
    return (
      <ul className='tool-groups'>
        { this.props.config.menuGroups.map(this.renderToolGroup) }
        {closeableElement}
      </ul>
    );
  },

  render(){
    var classes = [];
    var styles = {};
    var navigatorStyle = {};
    var toolZoneStyle = {};

    classes.push('ToolNavigation');
    classes.push('pos-'+this.props.position);
    classes.push(this.props.theme);

    var toolSize = this.state.toolSize;
    if( this.state.toolEgg === null ){
      toolSize = this.props.naviSize;
    }

    if( this.naviType === 'vertical' ){
      
      styles['height'] = toolSize;
      // positioning
      styles['left'] = this.state.left;
      styles['right'] = this.state.right;
      if( styles['top'] === undefined && styles['bottom'] === undefined ) styles['width'] = '100%';

      navigatorStyle['height'] = this.props.naviSize;

      toolZoneStyle[this.props.position === 'bottom'? 'top':'bottom'] = this.props.naviSize;
    } else if( this.naviType === 'horizontal' ){
      styles['width'] = toolSize;

      // positioning
      styles['top'] = this.state.top;
      styles['bottom'] = this.state.bottom;

      if( styles['top'] === undefined && styles['bottom'] === undefined ) styles['height'] = '100%';

      navigatorStyle['width'] = this.props.naviSize;

      toolZoneStyle[this.props.position] = this.props.naviSize;
    }

    navigatorStyle['fontSize'] = this.props.fontSize;


    if( this.state.show ){
      styles['display'] = 'block';
    } else {
      styles['display'] = 'none';
      styles['height'] = 0;
    }




    var resizebar;
    if( this.state.toolEgg !== null ){
      resizebar = <div className='resize-bar' onMouseMove={this.mouseMoveOver} onMouseDown={this.mouseDownNavi} onMouseUp={this.mouseUpNavi}/>;
    }

    return (
      <div className={classes.join(' ')} style={styles}>
        <div className='navigator' style={navigatorStyle}>
          { this.renderToolGroupNavigation() }
        </div>

        <div className='tool-zone' style={toolZoneStyle}>
          { this.renderToolNest() }
        </div>
        { resizebar }
      </div>
    )
  }
});

export default ToolNavigation;
