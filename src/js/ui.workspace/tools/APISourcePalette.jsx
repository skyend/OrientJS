import "./APISourcePalette.less"
import React from 'react';



let APISourceItem = React.createClass({

  getDefaultProps(){
    return {
      source:null
    }
  },

  getInitialState(){
    return {
      active:false
    }
  },

  click(){
    this.setState({active:!this.state.active});
  },

  renderRequest(_name, _request){

    return(
      <div className='request'>
        {_request.name}
      </div>
    );
  },

  renderRequests(){

    let requestKeys = Object.keys( this.props.source.requests || {});
    let self = this;
    if( requestKeys.length > 0 ){
      return requestKeys.map( function(_requestKey ){
        return self.renderRequest(_requestKey, self.props.source.requests[_requestKey]);
      });
    } else {
      return "Has not requests";
    }
  },

  render(){

    let self = this;
    let iconElement;
    if( this.props.source.icon !== '' ){

      iconElement = <img src={this.props.iceHost + "/icon/"+ this.props.source.icon}/>;
    } else {

      iconElement = <i className='fa fa-database'/>;
    }

    return (
      <li>
        <div className={'source-title ' + ( this.state.active? 'active':'')} onClick={this.click}>
          <span>{iconElement} { this.props.source.title }</span>
        </div>
        { this.state.active? (<div className='source-requests-display'>{this.renderRequests()}</div>):'' }
      </li>
    );
  }
});



export default React.createClass({
  mixins: [
      require('../reactMixin/EventDistributor.js'),
      require('./mixins/WidthRuler.js')],
  getDefaultProps(){

    return { };
  },

  getInitialState(){

    return {
      apisourceList: [],
      apiinterfaceList:[]
    };
  },

  componentDidMount(){
    this.emit("NeedICEHost");
    this.emit("UpdateAPISourceList");
    this.emit("UpdateAPIInterfaceList");
  },

  renderAPISource(_apiSource){

    return (
      <APISourceItem source={_apiSource} iceHost={this.state.iceHost}/>
    );
  },

  renderAPISources(){
    return (
      <div className='api-source-list-wrapper'>
        <ul>
          { this.state.apisourceList.map( this.renderAPISource )}
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
