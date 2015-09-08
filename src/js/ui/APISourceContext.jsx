var React = require('react');
require('./APISourceContext.less');

var APISourceContext = React.createClass({
  getInitialState(){
    return {
      mode:'json',
      nodeTypeData:null
    };
  },

  goingToContextStop(){
    this.closeElementNavigator();

    this.contextController.pause();
    //console.log('changed context state to stop!');
  },

  goingToContextRunning(){
    this.contextController.resume();


  },

  getContextType(){
    return this.props.contextType;
  },

  toggleModeJSON(){
    this.setState({mode:'json'});
  },

  toggleModeTable(){
    this.setState({mode:'table'});
  },


  componentDidUpdate(){
    console.log(this.state);
    if( this.props.runningState === this.props.contextController.running ) return;

    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  componentDidMount(){
    // contextController 연결
    this.contextController = this.props.contextController;
    this.contextController.attach(this);

    if( this.props.runningState ){
      this.goingToContextRunning();
    } else {
      this.goingToContextStop();
    }
  },

  renderLikeTable(){
    var nodeTypeData = this.state.nodeTypeData;
    return (
      <div>
        {JSON.stringify(nodeTypeData)}
      </div>
    )
  },

  renderLikeJSON(){
    var nodeTypeData = this.state.nodeTypeData;
    return (
      <div>
        {JSON.stringify(nodeTypeData)}
      </div>
    )
  },

  renderDataZone(){

    return (
      <div>
        { this[ 'renderLike' + this.state.mode.toUpperCase() ]() }
      </div>
    )
  },

  render(){
    var style = {
      display:'none',
      width: this.props.width,
      height: this.props.height
    };

    if( this.props.runningState ){
      style.display = 'block';
    }

    return (
      <div className='APISourceContext dark' style={style}>
        <div className='state-bar'>
          <div className='bar left'>
            <ul>
              <li> { this.props.contextController.nodeTypeId } </li>
            </ul>
          </div>
          <div className='bar right'>
            <ul>
              <li>
                {this.state.mode === 'json'? <input type='radio' name='mode' checked/> : <input type='radio' onClick={ this.toggleModeJSON } name='mode'/>}
                JSON
                {this.state.mode === 'table'? <input type='radio' name='mode' checked/> : <input type='radio' onClick={ this.toggleModeTable } name='mode'/>}
                Table
              </li>
            </ul>
          </div>
        </div>

        <div className='node-control'>

        </div>

        <div className='data-render-zone'>
          { this.state.nodeTypeData !== null ? this.renderDataZone():''}
        </div>
      </div>
    )
  }
});


module.exports = APISourceContext;
