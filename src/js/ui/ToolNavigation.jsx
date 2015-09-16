import './ToolNavigation.less';
import React from 'react';
import EventDistributor from './reactMixin/EventDistributor.js';
import ToolNest from './ToolNest.jsx';

var  ToolNavigation = React.createClass({
  mixins:[EventDistributor],


  getInitialState(){
    return {
        toolEgg: null,
        show:this.props.initialShow || false,
        prevShow:true
    };
  },

  toggleShow(){
    this.setState({show:!this.state.show});
  },

  componentDidUpdate(){
    if( this.state.prevShow !== this.state.show ){
      this.emit("Resized");
    }

    this.state.prevShow = this.state.show;
  },

  renderToolNest(){
    if( this.state.toolEgg === null ) return '';

    return (
      <ToolNest toolEgg={this.state.toolEgg}/>
    );
  },

  renderToolGroupItem(_item){
    var self = this;

    function requestAttachTool(){
      self.emit("RequestAttachTool", {
        "toolKey": _item.equipToolKey,
        "where":self.__myRefByParent
      });
    }

    var classes = [];
    if( this.state.toolEgg !== null ){
      if( this.state.toolEgg.toolKey === _item.equipToolKey ){
        classes.push('opend');
      }
    }


    return (
      <li className={classes.join(' ')} onClick={requestAttachTool}>
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

    var height = 310;
    if( this.state.toolEgg === null ){
      height = 27;
    }

    styles['width'] = '100%';
    styles['height'] = height;

    if( this.state.show ){
      styles['display'] = 'block';
    } else {
      styles['display'] = 'none';
      styles['height'] = 0;
    }

    return (
      <div className={classes.join(' ')} style={{}} style={styles}>
        <div className='navigator'>
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
