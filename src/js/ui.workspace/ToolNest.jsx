var React = require('react');

var ToolNest = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getDefaultProps(){
    return {
      toolEgg:null
    };
  },

  renderToolEgg(){
    var bird = this.props.toolEgg({width:this.props.width,height:(this.props.height || '100%')});

    this.bird = bird;

    return bird;
  },

  applyToolBirdState(){
    // storedToolState 가 있으면 반영한다.
    var refKeys = Object.keys(this.refs);

    var birdInstance = this.refs[refKeys[0]];

    if( typeof birdInstance.props.storedState === 'object' ){
      birdInstance.setState(birdInstance.props.storedState);
    }
  },

  componentDidUpdate(){
    this.applyToolBirdState();
  },

  componentDidMount(){
    this.applyToolBirdState();
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
