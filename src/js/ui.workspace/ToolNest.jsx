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
    console.log("apply ToolBirdState", _toolStates);

    let tool = this.refs[this.props.toolEgg.toolKey];

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
    console.log("Call hatchTool");
    this.props.toolEgg({width: this.props.width, height: (this.props.height || '100%')}, this, function(_toolClass, _toolProps){
      console.log('Hatched tool');
      self.setState({toolClass:_toolClass, toolProps:_toolProps});
      self.applyToolBirdState(self.props.toolEgg.factory.getStoredState(self.props.toolEgg.toolKey));
      self.props.toolEgg.updateState();
    });
  },

  componentDidUpdate(_prevProps, _prevState){

    if( _prevProps.toolEgg !== this.props.toolEgg){
      console.log('change toolEgg');
      this.setState({toolClass:null, toolProps:null});
      this.hatchTool();
    }
  },

  componentDidMount(){
    console.log('did mount');
    this.hatchTool();
  },
  //
  // componentWillUpdate(_nextProps, _nextState){
  //   console.log( arguments );
  // },

  renderToolEgg(){
    if( this.state.toolClass !== null ){
      let props = this.state.toolProps;
      props.ref = this.props.toolEgg.toolKey;

      let storedState = this.props.toolEgg.factory.getStoredState(this.props.toolEgg.toolKey);
      props._storedState = storedState;
      
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
    console.log(this.props, 'call toolNest render ');
    return (
      <div className='tool-nest' style={{height:(this.props.height || '100%'), width:this.props.width}}>
        { this.renderToolEgg() }
      </div>
    )
  }
});


module.exports = ToolNest;
