import React from 'react';
import _ from 'underscore';

import HorizonField from '../partComponents/HorizonField.jsx';
import AverageColumns from '../partComponents/AverageColumns.jsx';

require('./CSSContext.less');

export default React.createClass({
  mixins: [require('../reactMixin/EventDistributor.js'), require("./ContextAdaptor.js")],


  onThrowCatcherChangedValue(_e){
    let name = _e.name;
    if( name === 'code') {
      this.props.contextController.modifyCode(_e.data);
    }

    this.forceUpdate();
  },

  renderCodeCanvas(){
    return (
      <HorizonField fieldName='code' title='Component Stylesheet' theme="dark" enterable={true} type={'ace'}
                    ref={'css-field'}
                    defaultValue={this.props.contextController.subject.css} height='100%' lang='css'
                    editorId={'css-editor-'+this.props.contextController.subject.id}
                    nameWidth={0}/>
    );
  },

  render(){
    let columns = [
      {name:'Write Code', icon:'code', defaultFold:false, element:this.renderCodeCanvas()},
      {name:'Graphical', icon:'paint-brush', defaultFold:true, element:<div>Graphical</div>}
    ];

    return (
      <div className='ComponentContext' style={this.getRootBaseStyle()}>
        <AverageColumns columns={columns} width={ this.props.width} height={this.props.height}/>


      </div>
    );
  }
});
