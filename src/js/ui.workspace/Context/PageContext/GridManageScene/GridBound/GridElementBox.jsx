import React from 'react';
import './GridElementBox.less';

export default React.createClass({
  mixins:[require('../../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      gridElement:null
    };
  },

  render(){
    let style;


    return (
      <div className='GridBound' style={style}>


      </div>
    )
  }
});
