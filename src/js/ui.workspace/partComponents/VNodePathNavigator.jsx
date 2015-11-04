import './VNodePathNavigator.less';
import React from "react";

var VNodePathNavigator = React.createClass({

  renderVNodePathItem (_vnode) {

    var classElement;
    if (typeof _vnode.classes === 'string') {
      classElement = <span className='class'>
        {_vnode.classes}
      </span>
    }

    return (
      <li>
        <span className='tag'>{_vnode.name}</span>
        {classElement}
      </li>
    )
  },

  render () {
    let style = {
      height: this.props.height
    };

    return (
      <div className='VNodePathNavigator theme-default' style={style}>
        <ul>
          {this
            .props
            .vnodePathArray
            .map(this.renderVNodePathItem)}
        </ul>
      </div>
    )
  }
});

export default VNodePathNavigator;
