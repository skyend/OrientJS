let React = require('react');
import './APISourceMappingHelper.less';

export default React.createClass({
  mixins: [ require('../reactMixin/EventDistributor.js') ],

  componentDidMount(){
    this.emit("ExtendDisplay",{
      width:350,
      height: 600
    })
  },

  render(){
    console.log('APISourceMappingHelper',this.state, this.props);
    return (
      <div className='APISourceMappingHelper'>
        <div className='top'>
          <input />
        </div>
        <div className='source-palette'>


        </div>
      </div>
    )
  }
});
