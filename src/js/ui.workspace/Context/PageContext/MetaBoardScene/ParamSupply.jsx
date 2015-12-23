import React from 'react';
import HorizonField from '../../../partComponents/HorizonField.jsx';
import _ from 'underscore';
import ApiSourceRequest from './ParamSupply/ApiSourceRequest.jsx';

let ParamSupply = React.createClass({
  mixins:[require('../../../reactMixin/EventDistributor.js')],
  getDefaultProps(){
    return {
      ns:undefined,
      method:undefined,
      paramApiSource: undefined,
      resolveText:undefined,
      apiSourceId: undefined,
      requestId: undefined,

      apiSourceList:null,
      apiInterfaceList:null
    };
  },

  onThrowCatcherChangedValue(_e){
    let fieldName = _e.name;
    let value = _e.data;

    if( fieldName === 'method' ){
      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'single',
        name: 'method',
        value: value
      });
    } else if ( fieldName === 'resolveText' ){
      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'single',
        name: 'resolveText',
        value: value
      });
    } else if ( fieldName === 'apiSourceId' ){
      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'single',
        name: 'apiSourceId',
        value: value
      });
    } else if ( fieldName === 'apiSourceId' ){
      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'single',
        name: 'apiSourceId',
        value: value
      });
    } else if ( fieldName === 'requestId' ){
      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'single',
        name: 'requestId',
        value: value
      });
    } else if ( /^field_.+$/.test(fieldName) ){
      let req_fieldName = fieldName.replace(/^field_(.+)$/,'$1');

      this.emit("MetaChangedParamSupply", {
        ns: this.props.ns,
        type: 'fields',
        name: req_fieldName,
        value: value
      });
    }
  },

  renderAPIRequestFields(){
    return <ApiSourceRequest apiSourceId={this.props.apiSourceId} requestId={this.props.requestId} fields={this.props.req_fields} apiSourceList={this.props.apiSourceList} apiInterfaceList={this.props.apiInterfaceList}/>;
  },

  renderFieldsByMethod(){
    if( this.props.method === 'request'){
      return this.renderAPIRequestFields();
    } else if ( this.props.method === 'resolve-text') {
      return <HorizonField fieldName='resolveText' theme="dark" title='Resolvable Text' type='input' enterable={true} defaultValue={this.props.resolveText} nameWidth={150}/>
    }

    return '';
  },

  render(){
    let options = [{
      value:'',
      title:"선택안됨"
    },{
      value:'request',
      title:"API Request"
    },{
      value:'resolve-text',
      title:"Resolvable text"
    }];

    console.log( this.props );
    return (
      <div>
        <h2>
          Parameter Supply Rule
        </h2>
        <div className='padding-area'>
          <HorizonField fieldName='ns' theme="dark" title='Param Namespace' type='input' enterable={false} defaultValue={this.props.ns} nameWidth={150}/>
          <HorizonField fieldName='method' theme="dark" title='Supply Method' type='select' options={options} enterable={true} defaultValue={this.props.method} nameWidth={150}/>
        </div>
        <div className='padding-area'>
          {this.renderFieldsByMethod()}
        </div>
      </div>
    )
  }
});

export default ParamSupply;
