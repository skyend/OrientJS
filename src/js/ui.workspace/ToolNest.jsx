var React = require('react');

var ToolNest = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      toolEgg: null
    };
  },

  applyToolBirdState(_toolStates){
    let tool = this.refs[Object.keys(this.refs)[0]];

    tool.setState(_toolStates);
  },

  componentWillUnmount(){
    this.props.toolEgg.factory.removeNest(this.props.toolEgg.toolKey, this);
  },

  componentDidUpdate(){
    this.props.toolEgg.factory.updateLivingBirds(this.props.toolEgg.toolKey);
  },

  componentDidMount(){
    this.props.toolEgg.factory.updateLivingBirds(this.props.toolEgg.toolKey);
  },

  renderToolEgg(){
    return this.props.toolEgg({width: this.props.width, height: (this.props.height || '100%')}, this);
  },


  render(){

    return (
      <div className='tool-nest' style={{height:(this.props.height || '100%'), width:this.props.width}}>
        { this.renderToolEgg() }
      </div>
    )
  }
});


module.exports = ToolNest;
