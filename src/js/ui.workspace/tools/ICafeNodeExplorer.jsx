import React from "react";
import "./ICafeNodeExplorer.less";

var ICafeNodeExplorer = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      nodetypes:[]
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

      return (
        <ul>
          { this.renderNodeType(_nodetype)}
          <li className='has-children'>
            <ul>
              <li className='nodetype'>
                <span className='node-name'>
                  notice
                </span>
                <span className='node-option'>
                  <input type='checkbox'/>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      );
  },

  render(){
    console.log()
    return (
      <div className='ICafeNodeExplorer'>
        <div className='options'>

        </div>
        <div className='nodetype-list'>
          { this.state.nodetypes.map(this.renderNodeTypeList)}
        </div>
        <div className='foot'>

        </div>
      </div>
    )
  }
});

export default ICafeNodeExplorer;
