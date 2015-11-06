import "./APISourcePalette.less"
import React from 'react';
import _ from 'underscore';

let Request = React.createClass({
  mixins: [ require('../reactMixin/EventDistributor.js') ],

  getDefaultProps(){
    return {
      request:null,
      name:'',
      nodeTypeData:null
    }
  },

  getInitialState(){
    return {
      showItemTree:false,
      sourceData:null
    }
  },

  click(){
    let nextValue = !this.state.showItemTree;
    this.setState({showItemTree: nextValue });

    if( nextValue && this.state.sourceData === null ){
      this.emit("NeedRequestResult", {
        request: this.props.request,
        nodeTypeData: this.props.nodeTypeData
      });
    }
  },

  renderSourceDataTree(){
    if( this.state.sourceData === null ){
      return (
        <div className='loading'>
          <i className="fa fa-spinner fa-pulse"/> Source Loading...
        </div>
      )
    }

    return (
      <div>

      </div>
    );
  },

  renderBindingItemTree(){


    return (
      <div className='binding-item-tree'>
        { this.renderSourceDataTree() }
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
          <small> {this.state.sourceData !== null? <i className="fa fa-inbox"/>:''}</small>
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
      source: null,
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
    let nextValue = !this.state.active;
    this.setState({active: nextValue});

    if( nextValue && this.state.nodeTypeData === null ){
      this.emit("NeedNodeTypeData", {
        nodeTypeNID: this.props.source.nid
      });
    }
  },

  renderRequest(_name, _request){
    return (
      <Request request={_request} name={_name} nodeTypeData={this.state.nodeTypeData}/>
    );
  },

  renderRequests(){
    let self = this;
    if( this.state.nodeTypeData === null ){
      return <div className='loading'>
        <i className="fa fa-spinner fa-pulse"/> Node type Loading...
      </div>
    }

    let requestElements = [];

    let requestKeys = Object.keys(this.props.source.requests || {});

    // source 의 request
    if( requestKeys.length > 0 ){
      requestKeys.map(function (_requestKey) {
        requestElements.push( self.renderRequest(_requestKey, self.props.source.requests[_requestKey]) );
      });
    }

    // interface 의 request
    if( (this.props.source.interfaces || 0).length > 0){
      if( this.props.interfaces !== null ){
        this.props.source.interfaces.map(function(_interfaceId){

          let index = _.findIndex(self.props.interfaces, function(_interface){
            return _interface._id === _interfaceId;
          });

          let interfaceObj = self.props.interfaces[index];

          Object.keys(interfaceObj.requests || {}).map(function(_key){
            let request = interfaceObj.requests[_key];

            requestElements.push( self.renderRequest(_key, request) );
          });
        });
      }
    }


    if (requestElements.length > 0) {
      return requestElements;
    } else {
      return "Has not requests";
    }
  },

  render(){
    let self = this;
    let iconElement;
    if (this.props.source.icon !== '') {

      iconElement = <img src={this.props.iceHost + "/icon/"+ this.props.source.icon}/>;
    } else {

      iconElement = <i className='fa fa-database'/>;
    }

    return (
      <li>
        <div className={'source-title ' + ( this.state.active? 'active':'')} onClick={this.click}>
          <span>{iconElement} { this.props.source.title }</span>
          <small> {this.state.nodeTypeData !== null? <i className="fa fa-inbox"/>:''}</small>
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
    this.emit("UpdateAPISourceList");
    this.emit("UpdateAPIInterfaceList");
  },

  renderAPISource(_apiSource){

    return (
      <APISourceItem source={_apiSource} iceHost={this.state.iceHost} interfaces={this.state.apiinterfaceList}/>
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
