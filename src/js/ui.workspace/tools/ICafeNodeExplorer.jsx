import React from "react";
import "./ICafeNodeExplorer.less";
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";


var ICafeNodeExplorer = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],

  getInitialState(){

    return {
      nodetypes:null,
      _selectedItems:{}
    };
  },

  add(){
    var self = this;
    this.emit("AddNodeType", {
      nodetypes: Object.keys(this.state._selectedItems).map(function(_key){ return self.state._selectedItems[_key];})
    });

    this.emit("Close");
  },

  cancel(){
    this.emit("Close");
  },

  toggleSelect(_nodetype){
    if( ! _nodetype.__select ){
      _nodetype.__select = true;

      this.state._selectedItems[_nodetype.nt_tid] = _nodetype;
    } else {
      _nodetype.__select = false;
      delete this.state._selectedItems[_nodetype.nt_tid];
    }

    this.forceUpdate();
  },

  toggleSub(_nodetype){

    if( ! _nodetype.__showSub ){
      _nodetype.__showSub = true;
    } else {
      _nodetype.__showSub = false;
    }

    this.forceUpdate();
  },

  componentDidMount(){
    this.emit("NeedICafeNodeTypes");
  },

  renderSelectedList(){
    var self = this;
    var keys = Object.keys( this.state._selectedItems || {});

    return (
      <div className='selected-list'>
        { keys.map(function(_key){
          return <span className='name'> {self.state._selectedItems[_key].nt_ntypenm.display} </span>
        })}
      </div>
    )
  },

  renderNodeType(_nodetype, _indentCount){
    var self = this;
    var idents = [];
    for(var i = 0; i < _indentCount; i++ ){
        idents.push(<span className='indent'/>);
    }

    return (
      <li className='nodetype' onClick={function(){self.toggleSelect(_nodetype)}}>
        {idents}
        { _nodetype.children !== undefined && _nodetype.children.length > 0 ?
          <span className='node-show-sub' onClick={function(_e){_e.stopPropagation(); self.toggleSub(_nodetype)}}>
            {_nodetype.__showSub? <i className='fa fa-minus-square-o'/>: <i className='fa fa-plus-square-o'/>}
          </span>:''}

        <span className='node-icon'>
        { _nodetype.icon !== '' ? <img src={'http://icedev.i-on.net/icon/'+_nodetype.icon }/>:
          <i className='fa fa-database'/> }
        </span>

        <span className='node-name'>
          { _nodetype.nt_ntypenm.display }
        </span>

        <span className='node-option'>
          <span className='select'>
            { _nodetype.__select? <i className='fa fa-check'/>:''}
          </span>
        </span>

        <span className='node-tid'>
          { _nodetype.nt_tid }
        </span>

      </li>
    )
  },

  renderNodeTypeList(_nodetype,_indent){
      //console.log(_nodetype);
      var self =this;

      return (
        <ul>
          { this.renderNodeType(_nodetype, _indent)}

          { _nodetype.children !== undefined && _nodetype.__showSub ? <li className='has-children'>
              {_nodetype.children.map( function(_child){ return self.renderNodeTypeList(_child, _indent + 1) } )}
            </li>:''}

        </ul>
      );
  },

  render(){
    var self =this;
    return (
      <div className='ICafeNodeExplorer'>
        <div className='options'>
          <div className='search-bar'>
            <input type='text' className='search-field'/>
          </div>
          { this.renderSelectedList() }
        </div>
        <div className='nodetype-list'>
          { this.state.nodetypes === null ?
            <i className="fa fa-spinner fa-pulse loading"/>:
              this.state.nodetypes.map(function(_child){ return self.renderNodeTypeList(_child, 0)} ) }
        </div>
        <div className='foot'>
          <GridBox placements={[
            [
              <OutlineButton color='white' title='Cancel' onClick={this.cancel}/>,
              <OutlineButton color='white' title='Add' onClick={this.add}/>,
            ]
          ]} width={200} height={40}/>
        </div>
      </div>
    )
  }
});

export default ICafeNodeExplorer;
