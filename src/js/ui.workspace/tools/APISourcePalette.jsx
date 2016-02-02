import "./APISourcePalette.less"
import React from 'react';
import _ from 'underscore';
//import APISource from '../../serviceCrew/APISource.js';

let Request = React.createClass({
  mixins: [ require('../reactMixin/EventDistributor.js') ],

  getDefaultProps(){
    return {
      request:null,
      name:'',
      nodeTypeData:null,
      apiSource:null
    }
  },

  getInitialState(){
    return {
      showItemTree:false,
      dataFrame:null
    }
  },

  useRequest(_e){
    _e.stopPropagation();
    console.log(this.props.request, this.props.apiSource);

    this.emit("RequestAttachTool", {
      "toolKey": "APISourceMappingHelper",
      "where": "SubWindow",
      "attachOptions":{
        "allowDuplicate":true
      },
      "params":{
        request: this.props.request,
        apiSource: this.props.apiSource
      }
    });
  },

  click(){
    let self = this;
    let nextValue = !this.state.showItemTree;
    this.setState({showItemTree: nextValue });
  },

  onDragStart(_e, _path){

    let dragEvent = _e.nativeEvent;
    dragEvent.dataTransfer.setData("text/plain", "${*"+(this.props.apiSource.nt_tid+"-"+this.props.request.name)+_path+"}");
  },

  componentDidUpdate(){
    let self = this;
    if( this.state.showItemTree && this.state.dataFrame === null ){
      this.props.apiSource.executeTestRequestAsDataFrame(this.props.request.id, function(_result){
        console.log(_result);
        self.setState({dataFrame: _result});
      });
    }
  },


  renderDataFrameUnit(_key, _object, _parentPath, _depth){
    let self = this;
    let type = typeof _object;
    let indentArray = _.range(_depth);

    switch(type){
      case "boolean":
      case "string":
      case "number":
        return <li className={type}>
          <div className='item' draggable={true} onDragStart={function(_e){self.onDragStart(_e, (_parentPath+"/"+_key));}}>
            { indentArray.map(function(_, _i){
              if( _i == _depth-1 ){
                return <span className='indent guide'/>;
              }
              return <span className='indent'/>;
            })}
            <span className='key'>{_key}</span>
            <span className='value'>
              <span className='wrapper' title={_object}>
                {_object}
              </span>
            </span>
          </div>
        </li>;

      case "object":
        let typeDetail = typeof _object.length === 'number'? "array":"object";
        return (
          <li className={typeDetail}>
            <div className='item' draggable={true} onDragStart={function(_e){self.onDragStart(_e, (_parentPath+"/"+_key));}}>
              { indentArray.map(function(_, _i){
                if( _i == _depth-1 ){
                  return <span className='indent guide'/>;
                }
                return <span className='indent'/>;
              })}
              <span className='key'>{_key}</span>
              <span className='value'> </span>
            </div>
            <ul>
              {Object.keys(_object).map(function(__key) {


                return self.renderDataFrameUnit(__key, _object[__key], _parentPath+'/'+_key, _depth+1)
              })}
            </ul>
          </li>
        )
    }
  },

  renderDataFrame(){
    let self = this;
    if( this.state.dataFrame === null ){
      return (
        <div className='loading'>
          <i className="fa fa-spinner fa-pulse"/> Loading Data frame...
        </div>
      )
    }

    return Object.keys(this.state.dataFrame).map(function(_key) {
      return self.renderDataFrameUnit(_key, self.state.dataFrame[_key], '', 0);
    });
  },

  renderBindingItemTree(){


    return (
      <div className='data-frame'>
        <ul>
          { this.renderDataFrame() }
        </ul>
      </div>
    )
  },

  render(){
    let headClasses = ['head'];
    if(this.state.showItemTree) headClasses.push('active');

    return (
      <div className='request'>
        <div className={headClasses.join(' ')} onClick={this.click}>
          {this.props.name}
          <small> {this.state.dataFrame !== null? <i className="fa fa-inbox"/>:''}</small>


        </div>
        { this.state.showItemTree? this.renderBindingItemTree():''}
      </div>
    )
  }
});

let APISourceItem = React.createClass({
  mixins: [ require('../reactMixin/EventDistributor.js') ],


  getDefaultProps(){
    return {
      apiSource: null,
      interfaces: null
    }
  },

  getInitialState(){
    return {
      active: false,
      nodeTypeData: null
    }
  },

  click(){
    let self = this;
    let nextValue = !this.state.active;
    this.setState({active: nextValue});

    // if( nextValue && !this.props.apiSource.hasNodeTypeData ){
    //   console.log(this.props.apiSource);
    //   this.props.apiSource.prepareNodeTypeData(function(_result){
    //     if( _result ){
    //       self.forceUpdate();
    //     }
    //   });
    // }
  },

  componentDidUpdate(){
    let self = this;
    if( this.state.active && this.props.apiSource.nodeTypeMeta === null ){
      console.log(this.props.apiSource);

      this.props.apiSource.prepareNodeTypeMeta(function(_result){
        self.forceUpdate();
      });
    }
  },

  renderRequest(_request){
    return (
      <Request request={_request} name={_request.name} apiSource={this.props.apiSource}/>
    );
  },

  renderRequests(){
    let self = this;

    if( this.props.apiSource.nodeTypeMeta === null ){
      return <div className='loading'>
        <i className="fa fa-spinner fa-pulse"/> Node type Loading...
      </div>
    }

    let requestElements = [];



    requestElements = this.props.apiSource.requests.map(function(_req){
      return self.renderRequest(_req);
    });


    if (requestElements.length > 0) {
      return requestElements;
    } else {
      return "Has not requests";
    }
  },

  render(){
    let self = this;
    let iconElement;
    if (this.props.apiSource.icon !== '') {
      
      iconElement = <img src={this.props.iceHost + "/icon/"+ this.props.apiSource.icon}/>;
    } else {

      iconElement = <i className='fa fa-database'/>;
    }

    return (
      <li>
        <div className={'source-title ' + ( this.state.active? 'active':'')} onClick={this.click}>
          <span>{iconElement} { this.props.apiSource.title }</span>
          <small> {this.props.apiSource.hasNodeTypeData? <i className="fa fa-inbox"/>:''}</small>
        </div>
        { this.state.active ? (<div className='source-requests-display'>{this.renderRequests()}</div>) : '' }
      </li>
    );
  }
});


export default React.createClass({
  mixins: [
    require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){

    return {};
  },

  getInitialState(){

    return {
      apisourceList: [],
      apiinterfaceList: []
    };
  },

  componentDidMount(){
    this.emit("NeedICEHost");
    this.emit("NeedAPISourceObjectList");
    this.emit("NeedAPIInterfaceList");
  },

  renderAPISource(_apiSource){
    return (
      <APISourceItem apiSource={_apiSource} iceHost={this.state.iceHost} interfaces={this.state.apiinterfaceList}/>
    );
  },

  renderAPISources(){
    return (
      <div className='api-source-list-wrapper'>
        <ul>
          { this.state.apisourceList.map(this.renderAPISource)}
        </ul>
      </div>
    );
  },

  render(){
    let classes = [];
    classes.push('APISourcePalette');
    console.log(this.state);
    return (
      <div className={classes.join(' ')}>
        { this.renderAPISources() }
      </div>
    )
  }
});
