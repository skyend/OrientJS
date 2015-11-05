var React = require('react');
require('./ElementNodeDropSupporter.less');

var SelectionRect = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  enterFore(){
    this.emit("SelectPosition", {
      "position": "fore",
      "targetElementNode": this.props.elementNode
    });
  },

  enterBack(){
    this.emit("SelectPosition", {
      "position": "back",
      "targetElementNode": this.props.elementNode
    });
  },

  entereLeft(){
    this.emit("SelectPosition", {
      "position": "left",
      "targetElementNode": this.props.elementNode
    });
  },

  enterRight(){
    this.emit("SelectPosition", {
      "position": "right",
      "targetElementNode": this.props.elementNode
    });
  },

  render(){
    return (
      <svg xmlns="http://www.w3.org/2000/svg" style={{width:50, height:50}} version="1.1"
           viewBox="0.0 0.0 88.0 88.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10">
        <g className='' clip-path="url(#p.0)">
          <path className='selection append-fore' d="m24.0 24.0l40.0 0l0 20.0l-40.0 0z"
                onMouseEnter={this.enterFore}/>
          <path className='selection append-left' xmlns="http://www.w3.org/2000/svg"
                d="m88.0 0l-24.0 24.0l-40.0 0l0 40.0l-24.0 24.0l0 -88.0z" fill-rule="nonzero"
                onMouseEnter={this.enterLeft}/>
          <path className='selection append-right' xmlns="http://www.w3.org/2000/svg"
                d="m88.0 0l-24.0 24.0l0 40.0l-40.0 0l-24.0 24.0l88.0 0z" fill-rule="nonzero"
                onMouseEnter={this.enterRight}/>
          <path className='selection append-back' d="m24.0 44.0l40.0 0l0 20.0l-40.0 0z"
                onMouseEnter={this.enterBack}/>
        </g>
      </svg>
    );
  }
});


var ElementNodeDropSupporter = React.createClass({
  mixins: [require('./reactMixin/EventDistributor.js')],

  getInitialState(){

    return {
      elementNode: null,
      left: 0,
      top: 0
    };
  },

  onThrowCatcherSelectPosition(_eventData, _pass){
    console.log(_eventData);
  },

  collectParents(_elementNode){
    var parents = [];
    var currentElementNode = _elementNode;

    while (currentElementNode.getParent() !== null) {

      currentElementNode = currentElementNode.getParent();
      parents.push(currentElementNode.getParent());
    }

    return parents;
  },

  renderDropBox(_elementNode){
    if (_elementNode === null || _elementNode === undefined) return;

    var elementNodeTree = this.collectParents(_elementNode);
    console.log(elementNodeTree);

    return <SelectionRect elementNode={_elementNode}/>
  },

  render(){
    return (
      <div className='ElementNodeDropSupporter' style={{left:this.state.left, top:this.state.top}}>
        { this.renderDropBox(this.state.elementNode)}
      </div>
    )
  }
});


module.exports = ElementNodeDropSupporter;
