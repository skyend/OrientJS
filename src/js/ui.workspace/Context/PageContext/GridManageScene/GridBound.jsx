import React from 'react';
import './GridBound.less';

export default React.createClass({
  getDefaultProps(){
    return {
      width:0,
      height:0,
      left:0,
      top:0
    };
  },

  render(){
    let style = {
      width: this.props.width,
      height: this.props.height,
      left: this.props.left,
      top: this.props.top
    };

    return (
      <div className='GridBound' style={style}>

      </div>
    )
  }
});
