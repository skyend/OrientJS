import React from 'react';
import CheckBox from '../../partComponents/CheckBox.jsx';
import ICafeResultTable from '../../partComponents/ICafeResultTable.jsx';
import './Request.less';

var Request = React.createClass({
  mixins: [require('../../reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      open:false
    }
  },

  getDefaultProps(){
    return {
      request: null,
      nodeTypeData: null
    }
  },

  toggle(){
    this.setState({open: !this.state.open});
  },

  renderBody(){
    if( !this.state.open ) return '';

    return (
      <div className='body'>
        <div className='section'>
          <div className='title'>
            CRUD
          </div>
          <div className='data'>
          A
          </div>
        </div>

        <div className='section'>
          <div className='title'>
            Header
          </div>
          <div className='data'>
          A
          </div>
        </div>

        <div className='section'>
          <div className='title'>
            Fields
          </div>
          <div className='data'>
A
          </div>
        </div>
      </div>
    )
  },

  render(){
    var self = this;

    return (
      <div className="Request">
        <div className='head'>
          <button className='folder button' onClick={this.toggle}>
            { this.state.open? <i className='fa fa-angle-right'/>:<i className='fa fa-angle-down'/>}
          </button>
          <div className='headline'>
            <span className='title'>
              { this.props.request.name }
            </span>
          </div>
          <div className='right-zone'>
            <button className='button'>
              <i className='fa fa-trash'/>
            </button>
            <button className='button'>
              <i className='fa fa-refresh fa-spin'/> Execute For Test
            </button>
          </div>
        </div>

        { this.renderBody() }

      </div>
    );
  }
});

export default Request;
