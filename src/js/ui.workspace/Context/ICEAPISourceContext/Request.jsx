import React from 'react';
import CheckBox from '../../partComponents/CheckBox.jsx';
import ICafeResultTable from '../../partComponents/ICafeResultTable.jsx';
import './Request.less';

var Request = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      request: null,
      nodeTypeData: null,
      isInterface: false,

      contextController:null
    }
  },

  render(){
    var self = this;

    return (
      <div className={'request '+ (this.isInheritance? "smaller from-interface":'')}>

      </div>
    );
  }
});

export default Request;
