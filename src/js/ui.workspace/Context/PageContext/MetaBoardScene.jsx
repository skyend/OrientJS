import React from 'react';
import './MetaBoardScene.less';
import HorizonField from '../../partComponents/HorizonField.jsx';
import _ from 'underscore';
import ParamSupply from './MetaBoardScene/ParamSupply.jsx';


export default React.createClass({
  mixins:[require('../../reactMixin/EventDistributor.js')],
  getDefaultProps(){
    return {
      page:null
    };
  },

  getInitialState(){
    return {
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

  componentWillMount(){
    let self = this;
    this.props.page.getSupplyNSList(function(_nsSet){
      self.setState({needNSSet:_nsSet});
    });
  },

  renderFragmentParam(_ns){
    let paramSupply = this.props.page.getParamSupply(_ns);

    return <ParamSupply ns={_ns} method={paramSupply.method} apiSourceId={paramSupply.apiSourceId} requestId={paramSupply.requestId} req_fields={paramSupply.fields || []} apiSourceList={this.state.apisourceList} apiInterfaceList={this.state.apiInterfaceList}/>
  },

  renderFragmentParamSupplyRules(){
    let self = this;
    if( (this.state.needNSSet === null || this.state.apisourceList === null ) || this.state.apiInterfaceList === null ){
      return <i className='fa fa-refresh fa-spin'/>;
    } else {
      let returnElements = [];

       this.state.needNSSet.forEach(function(_value){
         returnElements.push( self.renderFragmentParam(_value));
       });

      return returnElements;
    }
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
          <i className='fa-asterisk fa'/> Fragment Parameter Supply Rule
        </h1>
        <div className='padding-area'>
          {this.renderFragmentParamSupplyRules()}
        </div>
      </div>
    );
  }
});
