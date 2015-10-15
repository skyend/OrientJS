import React from "react";
import "./ICafeNodeExplorer.less";

var ICafeNodeExplorer = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      nodetypes:null
    };
  },

  componentDidMount(){
    this.emit("NeedICafeNodeTypes");
  },

  renderNodeType(_nodetype){
    return (
      <li className='nodetype'>
        <span className='node-name'>
          { _nodetype.nt_ntypenm.display }
        </span>
        <span className='node-option'>
          <input type='checkbox'/>
        </span>
      </li>
    )
  },

  renderNodeTypeList(_nodetype){
      //console.log(_nodetype);
      return (
        <ul>
          { this.renderNodeType(_nodetype)}

          { _nodetype.children !== undefined ? <li className='has-children'>
              {_nodetype.children.map( this.renderNodeTypeList )}
            </li>:''}

        </ul>
      );
  },

  render(){

    return (
      <div className='ICafeNodeExplorer'>
        <div className='options'>

        </div>
        <div className='nodetype-list'>
          { this.state.nodetypes === null ? <i className="fa fa-spinner fa-pulse loading"/>:this.state.nodetypes.map(this.renderNodeTypeList) }
        </div>
        <div className='foot'>

        </div>
      </div>
    )
  }
});

export default ICafeNodeExplorer;
