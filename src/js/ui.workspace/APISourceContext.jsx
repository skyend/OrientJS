import React from 'react';
import _ from 'underscore';
import CheckBox from './partComponents/CheckBox.jsx';
import ICafeResultTable from './partComponents/ICafeResultTable.jsx';

require('./APISourceContext.less');


var Request = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      request:null,
      nodeTypeData: null,
      isInterface: false,
      isImplemented: false
    }
  },

  getInitialState(){
    return {
      showDataPreviewer:false,
      interfaces:[],
      fold:true
    }
  },

  interfaceCheck(){
    if( this.props.interface !== undefined ){

      return true;
    }

    return false;
  },

  toggleFold(){
    this.setState({fold:!this.state.fold});
  },

  deleteRequest(_e, _force){
    if( this.interfaceCheck() ) return;

    if( _force != true ){
      var self = this;

      this.emit("RequestAttachTool", {
        "toolKey": "ConfirmBox",
        "where":"ModalWindow",
        "params":{
          "title":"요청 제거",
          "confirm-message": "[ "+this.props.request.name+" ] 요청을 제거 하시겠습니까?",
          "positive-action": function(){
            self.deleteRequest(_e, true);
          }
        }
      });

      return;
    }

    this.emit("DeleteRequest", {
      request: this.props.request
    });
  },



  testRequest(){
    let self = this;
    this.setState({loadingData:true, fold:false});

    //this.setState({showDataPreviewer:true, loadingData: false});
    console.log( this.getFields() );

    this.props.contextController.executeRequestTest( this.props.request, this.getFields(),this.getHeaders(), function(_result){
      console.log( _result);

      self.setState({icafeResult: _result, showDataPreviewer:true, loadingData:false});
    });
  },

  testRequestWithChain(){
    this.setState({loadingDataWithChain:true, fold:false});

    //this.setState({showDataPreviewer:true, loadingDataWithChain: false});
  },

  getHeaders(){
    return [];
  },

  getFields(){

    var fields = [];
    for(let i = 0; i < this.props.request.fieldList.length; i++ ){
      fields.push( this.props.request.fieldList[i]);
    }

    if( this.props.request.fieldFillFromNodeType ){
      if( this.props.nodeTypeData === null ) throw new Error("노드타입데이터가 로드되지 않았습니다.");

      let self = this;

      let propertyTypes = Object.keys(this.props.nodeTypeData.propertytype).map(function(_key){
        var pt = self.props.nodeTypeData.propertytype[_key];

        switch(pt.pid){
          case "created":
          case "changed":
          case "owner":
          case "modifier":
          return false;
        }

        self.props.nodeTypeData.propertytype[_key].name = pt.pid;

        fields.push( self.props.nodeTypeData.propertytype[_key] );
      });
    }

    return fields;
  },

  changeURLPattern(){
    if( this.interfaceCheck() ) return;

    this.props.request.customUrlPattern = this.refs['url-pattern'].getDOMNode().value;

    this.updateEmit();
  },

  changeCRUD(){
    if( this.interfaceCheck() ) return;

    var value = this.refs['crud-selector'].getDOMNode().value;

    this.props.request.crud = value;

    this.updateEmit();
  },

  changeMethod(){
    if( this.interfaceCheck() ) return;

    var value = this.refs['method-selector'].getDOMNode().value;

    this.props.request.method = value;

    this.updateEmit();
  },

  addNewField(){
    if( this.interfaceCheck() ) return;

    this.props.request.fieldList.push({
      name:'',
      value:'',
      testValue:''
    });

    this.updateEmit();
  },

  deleteField(_fieldIndex){
    var newFieldList = [];
    this.props.request.fieldList.map(function(_field, _i){
      if( _i != _fieldIndex ){
        newFieldList.push(_field);
      }
    });

    this.props.request.fieldList = newFieldList;

    this.updateEmit();
  },

  deleteHeader(_headerIndex){
    var newHeaderList = [];
    this.props.request.headerList.map(function(_header, _i){
      if( _i != _headerIndex ){
        newHeaderList.push(_header);
      }
    });

    this.props.request.headerList = newHeaderList;

    this.updateEmit();
  },

  changeFieldName(_index, _e){
    if( this.interfaceCheck() ) return;

    this.props.request.fieldList[_index].name = _e.target.value;

    this.updateEmit();
  },

  changeFieldValue(_index, _e){
    if( this.interfaceCheck() ) return;

    this.props.request.fieldList[_index].value = _e.target.value;

    this.updateEmit();
  },

  changeFieldTestValue(_fieldName, _e){
    let value = _e.target.value;

    this.updateInterfacePlaceholders(this.props.request.name,{
      target:'testField',
      name: _fieldName,
      value:value
    });

    console.log(_fieldName);

    // this.props.request.fieldList[_index].testValue = _e.target.value;
    // console.log('here', this);
    //this.updateEmit();
  },

  // changeTestValueOfField(_fieldName, _value){
  //   //this.props.request.fieldTestValues[_fieldName] = _value;
  //
  //   this.updateInterfacePlaceholders(this.props.request.name,{
  //     target:'testField',
  //     name: _fieldName,
  //     value:_value
  //   });
  //
  //   this.updateEmit();
  // },

  addNewHeader(){
    if( this.interfaceCheck() ) return;

    this.props.request.headerList.push({
      name:'',
      value:'',
      testValue:''
    });

    this.updateEmit();
  },

  changeHeaderName(_index, _e){
    if( this.interfaceCheck() ) return;

    this.props.request.headerList[_index].name = _e.target.value;

    this.updateEmit();
  },

  changeHeaderValue(_index, _e){
    if( this.interfaceCheck() ) return;

    this.props.request.headerList[_index].value = _e.target.value;

    this.updateEmit();
  },

  changeHeaderTestValue(_index, _e){
    this.props.request.headerList[_index].testValue = _e.target.value;

    this.updateEmit();
  },



  fillFromPropertytypesToggle(_value){
    if( this.interfaceCheck() ) return false;

    this.props.request.fieldFillFromNodeType = _value;

    this.updateEmit();
  },

  updateInterfacePlaceholders(_requestName, _object){
    this.emit("UpdatedRequestPlaceholder",{
      requestName: _requestName,
      object:_object
    });
  },

  updateEmit(){

    this.emit("UpdatedRequest",{
      request: this.props.request,
      isInterface: this.props.isImplemented
    });
  },

  renderWithCheckEditable( _buttonElement ){
    if( this.props.isImplemented ) return '';

    return _buttonElement;
  },

  renderDataZone(){
    if( !this.state.showDataPreviewer ){
      return <div className='data-render-zone'/>
    }

    return <div className='data-render-zone open'>
      <ICafeResultTable result={this.state.icafeResult} propertytypes={ this.props.nodeTypeData.propertytype}/>
    </div>;
  },

  renderFillFieldsFromNodeType(){
    if( this.props.request.fieldFillFromNodeType !== true ) return '';
    if( this.props.nodeTypeData === null ) return '';

    let self = this;

    let propertyTypes = Object.keys(this.props.nodeTypeData.propertytype).map(function(_key){
      return self.props.nodeTypeData.propertytype[_key];
    });

    propertyTypes = propertyTypes.filter(function(_pt){
      switch(_pt.pid){
        case "created":
        case "changed":
        case "owner":
        case "modifier":
        return false;
      }

      return true;
    });


    var testFieldPlaceHolders = this.props.contextController.getRequestTestFieldPlaceholder( this.props.request.name );

    return propertyTypes.map( function(_pt, _i){

      return <div className='field'>
        <input placeholder="Field name (a-z,_,-)" value={_pt.pid}/>
        <i className='fa fa-long-arrow-right'/>
        <input placeholder="Field value or resolver" value={"${"+_pt.pid+"}"}/>
        <i className='fa fa-ellipsis-v'/>
        <input placeholder="Test value" value={testFieldPlaceHolders[_pt.pid]} onChange={function(_e){  self.changeFieldTestValue(_pt.pid,_e); }}/>
      </div>
    })
  },

  renderURLPatternInput(){
    let contextController = this.props.contextController;

    if( this.props.request.crud !== "*" ){
      let urlPattern = contextController.serviceManager.iceHost +
        "/api/"+
        (contextController.nodeTypeId !== undefined? contextController.nodeTypeId:"{tid}") +
        "/" +
        this.props.request.crud +
        ".json";

        return <input value={urlPattern} disabled/>
    } else {
      let customUrlPattern = this.props.request.customUrlPattern || '';

      return <input defaultValue={customUrlPattern} onChange={this.changeURLPattern} ref='url-pattern'/>
    }


  },

  renderRows(){
    if( this.state.fold ) return '';
    let self = this;
    let testFieldPlaceHolders;

    if( !this.props.isInterface ) testFieldPlaceHolders = this.props.contextController.getRequestTestFieldPlaceholder( this.props.request.name );

    return [<div className='row'>
      <label> URL Pattern </label>
      <div className='request-pattern'>
        {this.renderURLPatternInput()}
      </div>
      {this.renderWithCheckEditable(<select onChange={this.changeCRUD} value={this.props.request.crud.toUpperCase()} ref='crud-selector'>
        { this.props.crudOptions }
      </select>)}

    </div>,
    <div className='row'>
      <label> Method </label>
      <select onChange={this.changeMethod} value={this.props.request.method} ref='method-selector'>
        <option value='get'>GET</option>
        <option value='post'>POST</option>
        <option value='put'>PUT</option>
        <option value='delete'>DELETE</option>
      </select>
    </div>,
    <div className='row'>
      <label> Headers </label>
      <div className='request-field-set'>
        <div className='configs'>
          <div className='config'>
            {this.renderWithCheckEditable(<button onClick={this.addNewHeader}> Header <i className='fa fa-plus'/> </button>)}
          </div>
        </div>
        { this.props.request.headerList.map( function(_header, _i){

          return <div className='field'>
            <input placeholder="Header name (a-z,_,-)" value={_header.name} onChange={function(_e){ self.changeHeaderName(_i,_e); }}/>
            <i className='fa fa-long-arrow-right'/>
            <input placeholder="Header value or resolver" value={_header.value} onChange={function(_e){ self.changeHeaderValue(_i,_e); }}/>
            <i className='fa fa-ellipsis-v'/>
            <input placeholder="Test value" value={_header.testValue} onChange={function(_e){ self.changeHeaderTestValue(_i,_e); }}/>
            { self.renderWithCheckEditable(<button onClick={function(){self.deleteHeader(_i)}}>Delete</button>) }
          </div>
        })}

      </div>


    </div>,
    <div className='row'>
      <label> Fields </label>
      <div className='request-field-set'>
        <div className='configs'>
          <div className='config'>
            <div className='title'>
              Fill From Nodetype properties
            </div>
            <CheckBox value={this.props.request.fieldFillFromNodeType||false} onToggle={this.fillFromPropertytypesToggle}/>
          </div>
          <div className='config'>
            {this.renderWithCheckEditable(<button onClick={this.addNewField}> Field <i className='fa fa-plus'/> </button>)}
          </div>
        </div>
        { this.renderFillFieldsFromNodeType() }
        { this.props.request.fieldList.map( function(_field, _i){
          return <div className='field'>
            <input placeholder="Field name (a-z,_,-)" value={_field.name} onChange={function(_e){ self.changeFieldName(_i,_e); }}/>
            <i className='fa fa-long-arrow-right'/>
            <input placeholder="Field value or resolver" value={_field.value} onChange={function(_e){ self.changeFieldValue(_i,_e); }}/>

            {self.props.isInterface? '':[<i className='fa fa-ellipsis-v'/>,<input placeholder="Test value" value={testFieldPlaceHolders[_field.name]} onChange={function(_e){ self.changeFieldTestValue(_field.name,_e); }}/>]}
            {self.renderWithCheckEditable(<button onClick={function(){self.deleteField(_i)}}>Delete</button>)}
          </div>
        })}

      </div>


    </div>,
    <div className='row'>
      <label> Chains </label>
      {self.renderWithCheckEditable(<button> new Chain </button>)}
    </div>,

    <div className='row'>
      { this.renderDataZone() }
    </div>];
  },

  render(){
    var self = this;
    this.isFromInterface = false;

    if( this.props.interface !== undefined )
      this.isFromInterface = true;

    return <div className={'request '+ (this.isFromInterface? "smaller from-interface":'')}>
      <div className='row'>
        <button onClick={this.toggleFold} className=''> { this.state.fold? <i className='fa fa-chevron-down'/>:<i className='fa fa-chevron-up'/>} </button>
        <div className='request-name'>
          { this.props.request.name}
        </div>
        { this.isFromInterface? <div className='interface-name'>
          <i className='fa fa-plug'/> { this.props.interface.title }
        </div>:''}

        {this.renderWithCheckEditable(<button onClick={this.deleteRequest}> Delete </button>)}
        <button onClick={this.testRequest}> <i className={'fa fa-refresh '+ (this.state.loadingData? "fa-spin":'')}/> Test </button>
        <button onClick={this.testRequestWithChain}> <i className={'fa fa-refresh '+ (this.state.loadingDataWithChain? "fa-spin":'')}/> Test With Chain</button>

      </div>
      { this.renderRows()}
    </div>
  }
});

var APISourceContext = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getInitialState(){
    return {
      mode:'json',
      showInterfaceAdder: false,
      nodeTypeData:null,
      apiInterfaceList:[],
      followInterfaces:[]
    };
  },

  goingToContextStop(){

    this.contextController.pause();
    //console.log('changed context state to stop!');
  },

  goingToContextRunning(){
    this.contextController.resume();
    if( this.props.contextType === 'apiSource')
      this.contextController.needFollowInterfacesState();
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

    this.contextController.needFollowInterfacesState();

    this.setState({showInterfaceAdder: !this.state.showInterfaceAdder});
  },

  createRequest(_e){
    let name = this.refs['request-name'].getDOMNode().value;
    let crud = this.refs['crud-selector'].getDOMNode().value;

    if( name === '' ) {
      this.emit('NoticeMessage', {
        title:"요청 추가 실패",
        message:"요청 이름을 입력해주세요.",
        level : "error"
      });
      return;
    }

    if( crud === '' ){
        this.emit('NoticeMessage', {
          title:"요청 추가 실패",
          message:"부적절한 CRUD",
          level : "error"
        });
        return;
    }

    if( this.props.contextController.existsRequest(name) ){
        this.emit('NoticeMessage', {
          title:"요청 추가 실패",
          message:"동일한 요청이름이 존재합니다.",
          level : "error"
        });
        return;
    }

    this.props.contextController.addRequest(name, crud);

    this.forceUpdate();
  },

  onThrowCatcherUpdatedRequest(_eventData){
    if( _eventData.isImplemented ) return; // implemented 의 request 는 저장할 수 없다.

    this.props.contextController.updateRequest(_eventData.request);

    this.forceUpdate();
  },

  onThrowCatcherUpdatedRequestPlaceholder(_eventData){
    var requestName = _eventData.requestName;
    var object = _eventData.object;



    switch (object.target) {
      case "testField":
        this.props.contextController.setRequestTestFieldPlaceholder(requestName, object.name, object.value);
        break;
      default:

    }

    // this.props.contextController.changedContent();

    this.forceUpdate();
  },

  onThrowCatcherDeleteRequest(_eventData){
    this.props.contextController.deleteRequest(_eventData.request);

    this.forceUpdate();
  },


  save(){
    this.props.contextController.save();
  },


  componentDidUpdate(){
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

  feedSaveStateChange(){
    this.emit("ChangedSaveState");
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

  renderCRUDList(){
    if( this.props.contextType === 'apiSource'){
      return [this.state.nodeTypeData === null ? <option value=''>loading....</option>: this.state.nodeTypeData.crud.map(function(_crud){
          return <option value={_crud.type}>{_crud.name}</option>
        }),
        <option value="LIST">Default List</option>,
        <option value="READ">Default READ</option>,
        <option value="*">CRUD Free</option>]

    } else {
      return [
        <option value="CREATE">Create</option>,
        <option value="READ">READ</option>,
        <option value="RETRIEVE">READ</option>,
        <option value="LIST">List</option>,
        <option value="DELETE">Delete</option>,
        <option value="UPDATE">Update</option>,
        <option value="*">CRUD Free</option>
      ]
    }
  },

  renderCRUDPicker(){
    return <select ref='crud-selector'>
      { this.renderCRUDList()}
    </select>;
  },

  renderRequestEditor(){
    var self =this;

    if( this.props.contextType === 'apiSource' ){
      if( this.state.nodeTypeData === null ){
        return <div className='loading'>
          <i className="fa fa-spinner fa-pulse loading"/>
          <div className='loading-text'>
            Nodetype Data Loading...
          </div>
        </div>
      }
    }

    return [
      <div className='new-form'>

        <span className='field-name'>
          Request Name
        </span>
        <input ref='request-name'/>
        <span className='field-name'>
          Main CRUD
        </span>
        { this.renderCRUDPicker() }

        <button onClick={this.createRequest}>
          <i className='fa fa-plus'/> Add Request
        </button>
      </div> ,
      <div className='request-list'>
          { this.state.followInterfaces.map(function(_interface){
            return Object.keys(_interface.requests||{}).map(function(_requestKey){
                var request = _interface.requests[_requestKey];

                return <Request request={request} interface={_interface} contextController={self.props.contextController} crudOptions={self.renderCRUDList()} nodeTypeData={self.state.nodeTypeData||{}} isImplemented={true}/>
            });
          })}
      </div> ,
      <div className='request-list'>
      { this.props.contextController.requestsList.map(function(_request){

        return <Request request={_request} contextController={self.props.contextController} crudOptions={self.renderCRUDList()} nodeTypeData={self.state.nodeTypeData} isInterface={self.props.contextType === 'apiInterface'}/>
      })}

    </div>];
  },

  renderInterfaceAdder(){
    var self = this;
    return [<select onClick={function(_e){ _e.stopPropagation() }} ref='interface-selector'>
      { this.state.apiInterfaceList.map(function(_apiInterface){
        return <option value={_apiInterface._id}> {_apiInterface.title} </option>
      })}
    </select>,
    <button onClick={function(_e){ _e.stopPropagation(); self.addInterface(self.refs['interface-selector'].getDOMNode().value); }}>
      <i className='fa fa-plus'/>
    </button>,
    <button>
      <i className='fa fa-times'/>
    </button>];
  },

  renderNodeTypeDetail(){
    var self = this;

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
              // console.log(_crud);
              // var api_useable = false;
              // if( _crud.executor === 'FUNCTION' ){
              //   api_useable = true;
              // }
              //
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
              { this.state.showInterfaceAdder? this.renderInterfaceAdder():<i className='fa fa-plus'/>}
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
