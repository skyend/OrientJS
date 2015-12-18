import React from 'react';
import './MetaBoardScene.less';
import HorizonField from '../../partComponents/HorizonField.jsx';
import _ from 'underscore';

let ApiSourceRequest = React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      page:null,
      apiSourceList:null,
      apiInterfaceList:null
    };
  },


  componentDidMount(){

  },

  renderFields(_field){
    return <HorizonField fieldName={'field_'+_field.name} theme="dark" title={"Field "+_field.name} type='input' enterable={true} defaultValue={this.props.param['field_'+_field.name]} nameWidth={150}/>
  },

  renderRequest(_selectedApiSource){
    if( this.props.param.requestName === '' || this.props.param.requestName === undefined ){
      return '';
    }
    let request = _selectedApiSource.requests[this.props.param.requestName];

    //console.log( _selectedApiSource, this.props.param.requestName, _selectedApiSource.requests[this.props.param.requestName] );
    if( request === undefined ) return "Reqeust가 없음";

    return (
      <div className='padding-area'>
        {request.fieldList.map(this.renderFields)}
      </div>
    );
  },

  renderApiSource(){
    console.log("APISOurceRequest 상태", this.props);
    if( this.props.apiSourceList === null ) return <i className='fa fa-spinner fa-pulse'/>;
    if( this.props.apiInterfaceList === null ) return <i className='fa fa-spinner fa-pulse'/>;



    let options = this.props.apiSourceList.map(function(_apiSource){
      return {
        value: _apiSource.id,
        title: _apiSource.title + " ("+_apiSource.nt_tid+")"
      };
    });

    options.unshift({
      value:'',
      title:"선택안됨"
    });


    let renderElements = [];
    console.log("PAram", this.props.param);
    renderElements.push(<HorizonField fieldName='apiSourceId' theme="dark" title='API Source' type='select' options={options} enterable={true} defaultValue={this.props.param.apiSourceId} nameWidth={150}/>);

    if( this.props.param.apiSourceId !== '' && this.props.param.apiSourceId !== undefined ){
      let selectedApiSourceIndex = _.findIndex(this.props.apiSourceList, { id: this.props.param.apiSourceId});
      let selectedApiSource = this.props.apiSourceList[selectedApiSourceIndex];

      let requestOptions = selectedApiSource.requestsList.map(function(_request){
        return {
          value: _request.name,
          title:_request.name
        }
      });

      requestOptions.unshift({
        value:"",
        title:"선택안됨"
      });

      renderElements.push(<HorizonField fieldName='requestName' theme="dark" title='Request' type='select' options={requestOptions} enterable={true} defaultValue={this.props.param.requestName} nameWidth={150}/>);
      renderElements.push(this.renderRequest(selectedApiSource));
    }

    return renderElements;
  },

  render(){
    return (
      <div>
        { this.renderApiSource() }
      </div>
    )
  }
});

let ParamSupply = React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],

  onThrowCatcherChangedValue(_e){
    let fieldName = _e.name;
    let value = _e.data;

    this.props.param[fieldName] = value;

    this.emit("UpdatedParamSupply");
  },

  renderAPIRequestFields(){
    return <ApiSourceRequest param={this.props.param} apiSourceList={this.props.apiSourceList} apiInterfaceList={this.props.apiInterfaceList}/>;
  },

  renderFieldsByMethod(){
    if( this.props.param.method === 'request'){

      return this.renderAPIRequestFields();
    } else if ( this.props.param.method === 'resolve-text') {
      return <HorizonField fieldName='text' theme="dark" title='Resolvable Text' type='input' enterable={true} defaultValue={this.props.param.text} nameWidth={150}/>
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
          <HorizonField fieldName='ns' theme="dark" title='Param Namespace' type='input' enterable={true} defaultValue={this.props.param.ns} nameWidth={150}/>
          <HorizonField fieldName='method' theme="dark" title='Supply Method' type='select' options={options} enterable={true} defaultValue={this.props.param.method} nameWidth={150}/>
          { this.renderFieldsByMethod() }
        </div>
      </div>
    )
  }
});


export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      page:null,
      apisourceList:null,
      apiInterfaceList:null
    }
  },

  addFragmentParamSupply(){
    this.emit("AddFragmentParamSupply");
  },


  onThrowCatcherChangedValue(_e){
    let fieldName = _e.name;
    let value = _e.data;

    if( fieldName === 'access_point' ){
      this.emit("ModifyAccessPoint", {
        value:value
      });
    } else {

    }
  },

  componentDidMount(){
    this.emit("NeedICEHost");
    this.emit("NeedAPISourceList");
    this.emit("NeedAPIInterfaceList");
  },

  renderFragmentParam(_paramSupplyObject){
    return <ParamSupply param={_paramSupplyObject} apiSourceList={this.state.apisourceList} apiInterfaceList={this.state.apiInterfaceList}/>
  },

  renderFragmentParamSupplyRules(){
    console.log(this.props.page.paramSupplies);
    return this.props.page.paramSupplies.map(this.renderFragmentParam);
  },

  render(){
    console.log(this.state);
    return (
      <div className='MetaBoardScene'>
        <h1> <i className='fa-road fa'/> Access Rule </h1>
        <div className='padding-area'>
          <HorizonField fieldName='access_point' theme="dark" title='Access Point' type='input' enterable={true} defaultValue={this.props.page.accessPoint} onChange={this.changeAccessID} nameWidth={150}/>
        </div>
        <h1>
          <i className='fa-asterisk fa'/>
          Fragment Parameter Supply Rule
          <span onClick={this.addFragmentParamSupply} className='button-interface'>+</span>
        </h1>
        <div className='padding-area'>
          {this.renderFragmentParamSupplyRules()}
        </div>
      </div>
    );
  }
});
