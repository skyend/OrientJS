import React from 'react';

export default React.createClass({
  getDefaultProps(){
    return {
      width:'auto',
      height:'auto',
      error:null,
      packageKey:undefined,
      componentKey:undefined,
      maybe:undefined
    };
  },

  renderMaybe(){
    let style = {
      color:"#6492CF"
    };

    return (
      <div style={style}>
        Maybe : {this.props.maybe}
      </div>
    )
  },

  render(){
    let style = {
      display:'inline-block',
      backgroundColor:'#333',
      color:'#eee',
      width:this.props.width,
      height:this.props.height,
      padding:10,
      boxSIzing:'border-box',
      h1:{
        fontSize:20,
        color:'#EC6F5A'
      },
      error:{
        color:"#EC6F5A"
      }
    };

    return (
      <div className="ReactComponentErrorBox" style={style}>
        <h1 style={style.h1}>
          Component Rendering Error
        </h1>
        <div>
          Component : {this.props.packageKey}.{this.props.componentKey}
        </div>
        <div style={style.error}>
          Error : {this.props.error.toString()}
        </div>
        { this.props.maybe !== undefined ? this.renderMaybe():'' }
      </div>
    )
  }
});
