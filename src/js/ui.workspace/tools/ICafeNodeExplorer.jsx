import React from "react";
import "./ICafeNodeExplorer.less";
import OutlineButton from '../partComponents/OutlineButton.jsx';
import GridBox from "../partComponents/GridBox.jsx";
import _ from 'underscore';

var ICafeNodeExplorer = React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js')],
  getDefaultProps () {
    return {
      params: {
        holdnodetypes: []
      }
    }
  },

  getInitialState () {

    return {
      message: '',
      nodetypes: null,
      _selectedItems: {}
    };
  },

  checkCreateAllResult () {
    var self = this;
    var existsFail = false;
    var remained = false;

    Object
      .keys(this.state._selectedItems)
      .map(function(_key) {
        var nodetype = self.state._selectedItems[_key];
        if (nodetype.isloaded === 1) {} else if (nodetype.isloaded === -1) {
          existsFail = true;
        } else {
          remained = true;
        }

      });

    if (!remained) {
      if (existsFail) {
        this.setState({
          stayForServer: false,
          message: "API Source를 등록하는중 오류가 발견되었습니다."
        });
        return;
      }

      console.log("ALL success");
      this.emit("UpdateAPISourceList");
      this.emit("Close");
    }
  },

  successApiSourceCreate (_nt_tid) {
    this.state._selectedItems[_nt_tid].isloaded = 1;
    this.forceUpdate();
    this.checkCreateAllResult();
  },

  failApiSourceCreate (_nt_tid) {
    this.state._selectedItems[_nt_tid].isloaded = -1;
    this.forceUpdate();
    this.checkCreateAllResult();
  },

  add () {
    if (this.state.stayForServer) 
      return;
    
    if (Object.keys(this.state._selectedItems).length < 1) {
      this.setState({
        message: "선택된 노드타입이 없습니다."
      });
      return;
    }

    var self = this;
    this.emit("AddNodeType", {
      nodetypes: Object
        .keys(this.state._selectedItems)
        .map(function(_key) {
          return self.state._selectedItems[_key];
        })
    });

    //this.emit("Close");
    this.setState({
      stayForServer: true
    });
  },

  cancel () {
    if (this.state.stayForServer) 
      return;
    
    this.emit("Close");
  },

  toggleSelect (_nodetype) {
    if (this.state.stayForServer) 
      return;
    
    if (!_nodetype.__select) {
      _nodetype.__select = true;

      this.state._selectedItems[_nodetype.nt_tid] = _nodetype;
    } else {
      _nodetype.__select = false;
      delete this.state._selectedItems[_nodetype.nt_tid];
    }

    this.forceUpdate();
  },

  toggleSub (_nodetype) {
    if (this.state.stayForServer) 
      return;
    
    if (!_nodetype.__showSub) {
      _nodetype.__showSub = true;
    } else {
      _nodetype.__showSub = false;
    }

    this.forceUpdate();
  },

  componentDidMount () {
    this.emit("NeedICafeNodeTypes");
  },

  renderSelectedItem (_nodetype) {

    if (this.state.stayForServer) {
      let isLoading = true;

      switch (_nodetype.isloaded) {
        case - 1:
          break;
        case 1:
          isLoading = false;
          break;
        default:
      }

      return <span className={'name'}>
        {_nodetype.nt_ntypenm.display}
        {isLoading
          ? <i className="fa fa-spinner fa-pulse loading"/>
          : ''}
      </span>;
    } else {
      return <span className='name'>
        {_nodetype.nt_ntypenm.display}
      </span>;
    }

  },

  renderSelectedList () {
    var self = this;
    var keys = Object.keys(this.state._selectedItems || {});

    return (
      <div className='selected-list'>
        {keys
          .map(function(_key) {
            return self.renderSelectedItem(self.state._selectedItems[_key]);
          })}
      </div>
    )
  },

  renderNodeType (_nodetype, _indentCount) {
    var self = this;
    var idents = [];
    for (var i = 0; i < _indentCount; i++) {
      idents.push(
        <span className='indent'/>
      );
    }
    var nt_tid = _nodetype.nt_tid;

    var hold = false;
    this
      .props
      .params
      .holdnodetypes
      .map(function(_nodetype) {
        if (_nodetype.nt_tid === nt_tid) 
          hold = true;
        }
      );

    return (
      <li className='nodetype' onClick={!hold
        ? function() {
          self.toggleSelect(_nodetype)
        }
        : ''}>
        {idents}
        {_nodetype.children !== undefined && _nodetype.children.length > 0
          ? <span className='node-show-sub' onClick={function(_e) {
              _e.stopPropagation();
              self.toggleSub(_nodetype)
            }}>
              {_nodetype.__showSub
                ? <i className='fa fa-minus-square-o'/>
                : <i className='fa fa-plus-square-o'/>}
            </span>
          : ''}

        <span className='node-icon'>
          {_nodetype.icon !== ''
            ? <img src={'http://icedev.i-on.net/icon/' + _nodetype.icon}/>
            : <i className='fa fa-database'/>}
        </span>

        <span className='node-name'>
          {_nodetype.nt_ntypenm.display}
        </span>

        <span className='node-option'>
          <span className='select'>
            {_nodetype.__select || hold
              ? <i className='fa fa-check'/>
              : ''}
          </span>
        </span>

        <span className='node-tid'>
          {_nodetype.nt_tid}
        </span>

      </li>
    )
  },

  renderNodeTypeList (_nodetype, _indent) {
    //console.log(_nodetype);
    var self = this;

    return (
      <ul>
        {this.renderNodeType(_nodetype, _indent)}

        {_nodetype.children !== undefined && _nodetype.__showSub
          ? <li className='has-children'>
              {_nodetype
                .children
                .map(function(_child) {
                  return self.renderNodeTypeList(_child, _indent + 1)
                })}
            </li>
          : ''}

      </ul>
    );
  },

  render () {

    var self = this;

    return (
      <div className='ICafeNodeExplorer'>
        <div className='options'>
          <div className='search-bar'>
            <input type='text' className='search-field'/>
          </div>
          {this.renderSelectedList()}
        </div>
        <div className='nodetype-list'>
          {this.state.nodetypes === null
            ? <i className="fa fa-spinner fa-pulse loading"/>
            : this
              .state
              .nodetypes
              .map(function(_child) {
                return self.renderNodeTypeList(_child, 0)
              })}
        </div>
        <div className='foot'>
          <span className='message-box'>{this.state.message}</span>
          <GridBox placements={[
            [
              < OutlineButton color = 'white' title = 'Cancel' onClick = {
                this.cancel
              } />, < OutlineButton color = 'white' title = 'Add selected Nodetypes' onClick = {
                this.add
              } />
            ]
          ]} width={300} height={40}/>
        </div>
      </div>
    )
  }
});

export default ICafeNodeExplorer;
