import React from 'react';
import './APISourceMappingHelper.less';

export default React.createClass({
  mixins: [ require('../reactMixin/EventDistributor.js') ],

  componentDidMount(){
    this.emit("ExtendDisplay",{
      width:350,
      height: 600
    })
  },

  render(){
    
    return (
      <div className='APISourceMappingHelper'>
        <div className='top'>

        </div>
        <div className='source-palette'>


        </div>
      </div>
    )
  }
});
