import React from 'react';
import './ToggleColumns.less';
/*

    let columns = [
      { element     : <div> A </div>,
        title       : "A",
        icon        : "cog",
        defaultFold : false,
        width:'30%'}
    ];
*/
export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getDefaultProps(){
    return {
      columns:[],
      columnColor:"#fff",
      columnHoverColor:"#eee",
      width:"100%"
    }
  },

  renderColumns(){

  },


  render(){


    return (
      <div className='ToggleColumns'>
        { this.renderColumns() }
      </div>
    );
  }
});
