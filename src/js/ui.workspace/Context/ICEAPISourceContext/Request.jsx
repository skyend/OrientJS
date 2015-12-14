import React from 'react';
import CheckBox from '../../partComponents/CheckBox.jsx';
import ICafeResultTable from '../../partComponents/ICafeResultTable.jsx';
import './Request.less';

var Request = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      request: null,
      nodeTypeData: null
    }
  },

  render(){
    var self = this;

    return (
      <div className="Request">
        <div className='head'>
          <button className='folder button'>
            <i className='fa fa-angle-right'/>
          </button>
          { this.props.request.toString() }
        </div>
      </div>
    );
  }
});

export default Request;
