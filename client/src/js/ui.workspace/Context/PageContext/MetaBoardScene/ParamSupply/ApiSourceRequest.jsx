import React from 'react';
import HorizonField from '../../../../partComponents/HorizonField.jsx';
import _ from 'underscore';

let ApiSourceRequest = React.createClass({
  mixins:[require('../../../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      page:null,
      apiSourceId: '',
      requestId: '',
      fields:null,

      apiSourceList:null,
      apiInterfaceList:null,
    };
  },

  getInitialState(){
    return {
      needNSSet:null
    }
  },

  componentDidMount(){

  },

  renderFields(_field){
    let fieldIndex = _.findIndex(this.props.fields, {name:_field.key});
    let fieldValue = '';
    if( fieldIndex !== -1 ){
      fieldValue = this.props.fields[fieldIndex].value;
    } else {
      fieldValue = '';
    }

    return <HorizonField fieldName={'field_'+_field.key} theme="dark" title={"Field "+_field.key} type='input' enterable={true} defaultValue={fieldValue} nameWidth={150}/>
  },

  renderRequest(_selectedApiSource){

    if( this.props.requestId === '' || this.props.requestId === undefined ){
      return '';
    }

    let apiSourceIndex = _.findIndex(this.props.apiSourceList, {_id:this.props.apiSourceId});
    let apiSource = this.props.apiSourceList[apiSourceIndex];

    let requestIndex = _.findIndex(apiSource.requests, {id:this.props.requestId});
    let request = apiSource.requests[requestIndex];

    //console.log( _selectedApiSource, this.props.param.requestName, _selectedApiSource.requests[this.props.param.requestName] );
    if( request === undefined ) return "Reqeust가 없음";
    console.log(this.props.fields);

    return (
      <div className='padding-area'>
        {request.fields.map(this.renderFields)}
      </div>
    );
  },

  renderApiSource(){
    console.log("APISOurceRequest 상태", this.props);
    if( this.props.apiSourceList === null ) return <i className='fa fa-spinner fa-pulse'/>;
    if( this.props.apiInterfaceList === null ) return <i className='fa fa-spinner fa-pulse'/>;



    let options = this.props.apiSourceList.map(function(_apiSource){
      return {
        value: _apiSource._id,
        title: _apiSource.title + " ("+_apiSource.nt_tid+")"
      };
    });

    options.unshift({
      value:'',
      title:"선택안됨"
    });


    let renderElements = [];

    renderElements.push(<HorizonField fieldName='apiSourceId' theme="dark" title='API Source' type='select' options={options} enterable={true} defaultValue={this.props.apiSourceId} nameWidth={150}/>);

    if( this.props.apiSourceId !== '' && this.props.apiSourceId !== undefined ){
      let selectedApiSourceIndex = _.findIndex(this.props.apiSourceList, { _id: this.props.apiSourceId});
      let selectedApiSource = this.props.apiSourceList[selectedApiSourceIndex];

      let requestOptions = [];
      if(selectedApiSource.requests !== undefined){
        requestOptions.push({
          value:"",
          title:"선택안됨"
        });

        selectedApiSource.requests.map(function(_request){
          requestOptions.push({
            value: _request.id,
            title:_request.name
          });
        });


      } else {

        requestOptions.push({
          value:"",
          title:"사용 가능한 요청 없음"
        });
      }

      console.log(this.props.requestId);
      renderElements.push(<HorizonField fieldName='requestId' theme="dark" title='Request' type='select' options={requestOptions} enterable={true} defaultValue={this.props.requestId} nameWidth={150}/>);
      console.log("AAAAA", this.props.requestId);

      if( this.props.requestId !== ''){
        renderElements.push(this.renderRequest(selectedApiSource));
      }
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

export default ApiSourceRequest;
