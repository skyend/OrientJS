var React = require('react');
import './ToolNest.less';

var ToolNest = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],
  getInitialState(){
    return {
      toolClass: null,
      toolProps: null
    }
  },

  getDefaultProps(){
    return {
      toolEgg: null
    };
  },

  applyToolBirdState(_toolStates){
    let tool = this.refs[Object.keys(this.refs)[0]];
    console.log("applyToolBirdState", tool);


    if( tool !== undefined ){
      tool.setState(_toolStates);
    } else {
      console.log(this, this.refs, _toolStates);
      console.log("tool undefiend");
    }
  },

  onThrowCatcherSaveState(_eventData){
    this.props.toolEgg.setState(_eventData.state);
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

  hatchTool(){
    let self = this;

    this.props.toolEgg({width: this.props.width, height: (this.props.height || '100%')}, this, function(_toolClass, _toolProps){
      self.setState({toolClass:_toolClass, toolProps:_toolProps});
    });
  },

  componentDidUpdate(_prevProps, _prevState){

    if( _prevProps.toolEgg !== this.props.toolEgg){
      console.log('change toolEgg');
      this.setState({toolClass:null, toolProps:null});
      this.hatchTool();
      return false;
    }
  },

  componentDidMount(){
    this.hatchTool();
  },
  //
  // componentWillUpdate(_nextProps, _nextState){
  //   console.log( arguments );
  // },

  renderToolEgg(){
    if( this.state.toolClass !== null ){

      let toolBird = React.createElement(this.state.toolClass, this.state.toolProps);
      this.props.toolEgg.factory.addLivingBird(this.props.toolEgg.toolKey, toolBird, this);
      return toolBird;
    } else {
      return <div className='tool-load-holder'>
        <i className="fa fa-spinner fa-pulse loading"/>
      </div>;
    }
    //return this.props.toolEgg({width: this.props.width, height: (this.props.height || '100%')}, this);
  },

  render(){
    console.log(this.props);
    return (
      <div className='tool-nest' style={{height:(this.props.height || '100%'), width:this.props.width}}>
        { this.renderToolEgg() }
      </div>
    )
  }
});


module.exports = ToolNest;
