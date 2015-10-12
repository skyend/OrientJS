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

  renderJSONIndentBox( _count ){
    var list = [];
    for(var i = 0; i < _count; i++ ){
      list.push(<div className='indent-box'/>);
    }

    return list;
  },

  renderJSONNode(_jsonNode, _key, _depth){
    var self = this;
    var nodeType;
    if( typeof _jsonNode === 'object' ){
      if( _jsonNode === undefined ){
        nodeType = 'undefined';
      } else if ( _jsonNode.length !== undefined ){
        nodeType = 'array';
      } else {
        nodeType = 'hashmap';
      }
    } else if ( typeof _jsonNode === 'number' ){
      nodeType = 'number';
    } else if ( typeof _jsonNode === 'string' ){
      nodeType = 'string';
    } else if ( typeof _jsonNode === 'boolean' ){
      nodeType = 'boolean';
    }

    switch( nodeType ){
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        var jsonNode = _jsonNode;
        if( nodeType === 'boolean' ) jsonNode = jsonNode? "true":"false";

        return (
          <div className='node-display'>
            {this.renderJSONIndentBox(_depth)}
            <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
              <div className='key'>{_key}</div>
              <div className='node'>
                <div className={nodeType}>{jsonNode}</div>
              </div>
            </div>
          </div>

        );
      case "array":

        return (
          <div className='multi-wrapper'>
            <div className='node-display'>
              {this.renderJSONIndentBox(_depth)}
              <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
                <div className='key'>{_key}</div>
                <div className='node'>
                  [
                </div>
              </div>
            </div>

            <ul className='child-list array'>
              { _jsonNode.map(function(__node, __i){
                return (
                  <li>
                      {self.renderJSONNode(__node, __i, _depth + 1)}
                  </li>
                );
              })}
            </ul>

            <div className='node-display'>
              {this.renderJSONIndentBox(_depth)}
              <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
                <div className='node'>
                  {"],"}
                </div>
              </div>
            </div>
          </div>
        )
      case "hashmap":
        return (
          <div className='multi-wrapper'>
            <div className='node-display'>
              {this.renderJSONIndentBox(_depth)}
              <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
                <div className='key'>{_key}</div>
                <div className='node'>
                  {"{"}
                </div>
              </div>
            </div>

            <ul className='child-list map'>
              { Object.keys(_jsonNode).map(function(__key){
                return (
                  <li>
                      {self.renderJSONNode(_jsonNode[__key], __key,  _depth + 1)}
                  </li>
                );
              })}
            </ul>

            <div className='node-display'>
              {this.renderJSONIndentBox(_depth)}
              <div className='content' style={{width:(this.props.width - 20 - 20 * _depth)}}>
                <div className='node'>
                  {"},"}
                </div>
              </div>
            </div>
          </div>
        )
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
      <div className='json-renderer'>
        {this.renderJSONNode(nodeTypeData,'root', 0)}
      </div>
    )
  },

  renderDataZone(){

    return (
      <div className='node-wrapper'>
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

        <div className='node-render-zone'>
          { this.state.nodeTypeData !== null ? this.renderDataZone():''}
        </div>
      </div>
    )
  }
});


module.exports = APISourceContext;
