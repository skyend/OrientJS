import React from 'react';
import _ from 'underscore';
require('./APISourceContext.less');

var APISourceContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      mode:'json',
      showInterfaceAdder: false,
      nodeTypeData:null,
      apiInterfaceList:null
    };
  },

  goingToContextStop(){
    this.closeElementNavigator();

    this.contextController.pause();
    //console.log('changed context state to stop!');
  },

  goingToContextRunning(){
    this.contextController.resume();

  },

  getContextType(){
    return this.props.contextType;
  },

  toggleInterfaceAdder(){
    this.setState({showInterfaceAdder: !this.state.showInterfaceAdder});
  },

  addInterface( _interfaceId){

    if( !this.props.contextController.addInterface(_interfaceId) ){
      this.emit('NoticeMessage',{
        title:"인터페이스 추가 실패",
        message:"해당 인터페이스를 이미 따르고 있으므로 추가 하실 수 없습니다.",
        level : "error"
      });
    }

    this.setState({showInterfaceAdder: !this.state.showInterfaceAdder});
  },




  componentDidUpdate(){
    console.log(this.state);
    if( this.props.runningState === this.props.contextController.running ) return;

    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){
    var self =this;
    // contextController 연결
    this.contextController = this.props.contextController;
    this.contextController.attach(this);

    if( this.props.contextType === 'apiSource' ){
      this.contextController.getNodetypeData(function(_result){
        self.setState({nodeTypeData: _result});
      });

      this.emit("NeedAPIInterfaceList");
    }

    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  // renderJSONIndentBox( _count ){
  //   var list = [];
  //   for(var i = 0; i < _count; i++ ){
  //     list.push(<div className='indent-box'/>);
  //   }
  //
  //   return list;
  // },
  //
  // renderJSONNode(_jsonNode, _key, _depth){
  //   var self = this;
  //   var nodeType;
  //   if( typeof _jsonNode === 'object' ){
  //     if( _jsonNode === undefined ){
  //       nodeType = 'undefined';
  //     } else if ( _jsonNode.length !== undefined ){
  //       nodeType = 'array';
  //     } else {
  //       nodeType = 'hashmap';
  //     }
  //   } else if ( typeof _jsonNode === 'number' ){
  //     nodeType = 'number';
  //   } else if ( typeof _jsonNode === 'string' ){
  //     nodeType = 'string';
  //   } else if ( typeof _jsonNode === 'boolean' ){
  //     nodeType = 'boolean';
  //   }
  //
  //   switch( nodeType ){
  //     case "boolean":
  //     case "number":
  //     case "string":
  //     case "undefined":
  //       var jsonNode = _jsonNode;
  //       if( nodeType === 'boolean' ) jsonNode = jsonNode? "true":"false";
  //
  //       return (
  //         <div className='node-display'>
  //           {this.renderJSONIndentBox(_depth)}
  //           <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
  //             <div className='key'>{_key}</div>
  //             <div className='node'>
  //               <div className={nodeType}>{jsonNode}</div>
  //             </div>
  //           </div>
  //         </div>
  //
  //       );
  //     case "array":
  //
  //       return (
  //         <div className='multi-wrapper'>
  //           <div className='node-display'>
  //             {this.renderJSONIndentBox(_depth)}
  //             <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
  //               <div className='key'>{_key}</div>
  //               <div className='node'>
  //                 [
  //               </div>
  //             </div>
  //           </div>
  //
  //           <ul className='child-list array'>
  //             { _jsonNode.map(function(__node, __i){
  //               return (
  //                 <li>
  //                     {self.renderJSONNode(__node, __i, _depth + 1)}
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //
  //           <div className='node-display'>
  //             {this.renderJSONIndentBox(_depth)}
  //             <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
  //               <div className='node'>
  //                 {"],"}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     case "hashmap":
  //       return (
  //         <div className='multi-wrapper'>
  //           <div className='node-display'>
  //             {this.renderJSONIndentBox(_depth)}
  //             <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
  //               <div className='key'>{_key}</div>
  //               <div className='node'>
  //                 {"{"}
  //               </div>
  //             </div>
  //           </div>
  //
  //           <ul className='child-list map'>
  //             { Object.keys(_jsonNode).map(function(__key){
  //               return (
  //                 <li>
  //                     {self.renderJSONNode(_jsonNode[__key], __key,  _depth + 1)}
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //
  //           <div className='node-display'>
  //             {this.renderJSONIndentBox(_depth)}
  //             <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
  //               <div className='node'>
  //                 {"},"}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //   }
  //
  // },
  //
  // renderLikeTable(){
  //   var nodeTypeData = this.state.nodeTypeData;
  //   return (
  //     <div>
  //       {JSON.stringify(nodeTypeData)}
  //     </div>
  //   )
  // },
  //
  // renderLikeJSON(){
  //   var nodeTypeData = this.state.nodeTypeData;
  //   return (
  //     <div className='json-renderer'>
  //       {this.renderJSONNode(nodeTypeData,'root', 0)}
  //     </div>
  //   )
  // },
  //
  // renderDataZone(){
  //
  //   return (
  //     <div className='node-wrapper'>
  //       { this[ 'renderLike' + this.state.mode.toUpperCase() ]() }
  //     </div>
  //   )
  // },

  renderRequestEditor(){
    return [
      <div className='new-form'>

        <span className='field-name'>
          Request Name
        </span>
        <input />
        <span className='field-name'>
          Main CRUD
        </span>
        <select>
          {this.state.nodeTypeData === null ? <option>loading....</option>: this.state.nodeTypeData.crud.map(function(_crud){
            return <option value={_crud.type}>{_crud.name}</option>
          })}
        </select>

        <button>
          <i className='fa fa-plus'/> Add Request
        </button>
      </div>
    , <div className='request-list'>
        list

      </div>]
  },

  renderInterfaceAdder(){
    var self = this;
    return [<select onClick={function(_e){ _e.stopPropagation() }} ref='interface-selector'>
      { this.state.apiInterfaceList.map(function(_apiInterface){
        return <option value={_apiInterface._id}> {_apiInterface.title} </option>
      })}
    </select>,
    <button onClick={function(_e){ _e.stopPropagation(); self.addInterface(self.refs['interface-selector'].getDOMNode().value); }}>+</button>];
  },

  renderNodeTypeDetail(){
    var self = this;
    console.log( this.state.nodeTypeData);
    return (
      <table className='nodetype-list'>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>Parent Nodetype</span>
          </td>
          <td className='item-description'>
            <span className='block-merge'>
              {function(){
                  var items = [];
                  if( this.state.nodeTypeData.tree.display !== undefined ){
                    items.push(<span className='block display-field'>{this.state.nodeTypeData.tree.display}</span>);
                  }
                  if( this.state.nodeTypeData.tree.value !== undefined ){
                    items.push(<span className='block value-field'>{this.state.nodeTypeData.tree.value}</span>);
                  }
                  if( this.state.nodeTypeData.tree.nid !== undefined ){
                    items.push(<span className='block nid-field'>{this.state.nodeTypeData.tree.nid}</span>);
                  }
                  return items;
              }.apply(this)}
            </span>
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>Properties</span>
          </td>
          <td className='item-description'>
            {Object.keys(this.state.nodeTypeData.propertytype).map(function(_key){
              var property = self.state.nodeTypeData.propertytype[_key];

              return <span className='block-merge'>
                <span className='block display-field'>{property.name}</span>
                <span className='block value-field'>{property.pid}</span>
                <span className='block type-field'>{property.valuetype}</span>
              </span>;

            })}
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>CRUD</span>
          </td>
          <td className='item-description'>
            {this.state.nodeTypeData.crud.map(function(_crud){

              return <span className='block-merge' title={"/api/"+self.props.contextController.nodeTypeId+"/"+ _crud.type+".json"}>
                <span className='block display-field'>{_crud.name}</span>
                <span className='block type-field'>{_crud.type}</span>
                <span className='block value-field'>{_crud.extractor}</span>
              </span>;

            })}
          </td>
        </tr>

        <tr className='item'>
          <td className='item-title' width='150px'>
            <span className='title'>API Interface</span>
          </td>
          <td className='item-description'>

            {this.props.contextController.followedInterfaceList.map( function(_apiInterfaceId ){
              if( self.state.apiInterfaceList === null ){
                return  <span className='block-merge'>
                      <i className="fa fa-spinner fa-pulse loading"/>
                  </span>
              }

              var matchInterfaceIndex = _.findIndex(self.state.apiInterfaceList, function(_apiInterface){
                return _apiInterface._id === _apiInterfaceId;
              });

              let title;

              if( matchInterfaceIndex > -1 ){
                title = self.state.apiInterfaceList[matchInterfaceIndex].title;
              } else {
                title = "유효하지 않은 인터페이스";
              }

              return   <span className='block-merge'>
                  <span className='block display-field'>
                    <i className='fa fa-plug'/>
                    {title}
                  </span>
                </span>
            })}

            <span className={'block display-field plus-button '+(this.state.showInterfaceAdder? 'select-box-width-plus':'')} onClick={this.toggleInterfaceAdder}>
              { this.state.showInterfaceAdder? this.renderInterfaceAdder():'+'}
            </span>
          </td>
        </tr>
      </table>
    )
  },

  renderNodeTypeSpecInfo(){
    return <div className='nodetype-spec-info'>
      <h1>
        { this.props.contextController.iconURL !== undefined ? <img src={this.props.contextController.iconURL}/>:<i className='fa fa-database'/>}
        {this.props.contextController.title}
        <small className='tid'>
           {this.props.contextController.nodeTypeId}
        </small>
        <small className='nid'>
           {this.props.contextController.nid}
        </small>
      </h1>
      <div className='detail'>
        { this.state.nodeTypeData === null ?
          <i className="fa fa-spinner fa-pulse loading"/> : this.renderNodeTypeDetail() }
      </div>
    </div>;
  },

  renderInterfaceInfo(){
    return <div className='interface-info'>
      <h1>
        <i className='fa fa-plug'/>
        {this.props.contextController.title}
      </h1>
    </div>;
  },

  render(){
    var style = {
      display:'none',
      width: this.props.width,
      height: this.props.height
    };

    if( this.props.runningState ){
      style.display = 'block';
    }

    return (

      <div className='APISourceContext dark' style={style}>
        { this.props.contextType === 'apiSource' ? this.renderNodeTypeSpecInfo():this.renderInterfaceInfo() }

        <div className='requests-editor'>
          { this.renderRequestEditor() }
        </div>

        <div className='node-render-zone' style={{display:'none'}}>
          { this.state.nodeTypeData !== null ? 'this.renderDataZone()':''}
        </div>
      </div>
    )
  }
});


module.exports = APISourceContext;
