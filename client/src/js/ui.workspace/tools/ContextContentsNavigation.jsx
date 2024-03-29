var React = require("react");

require('./ContextContentsNavigation.less');

var ContextContentsNavigation = React.createClass({
  mixins: [
    require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getDefaultProps(){
    return {
      elementNode: null,
      runningContext: null
    };
  },


  getInitialState(){
    return {
      elementNode: null,
      runningContext: null,
      unfolded:{}
    };
  },

  clickElementNode(_elementNode){
    this.emit("SelectElementNode", {
      elementNode: _elementNode
    });
  },

  toggleElementChildren(_e, _id){
    _e.stopPropagation();

    if( this.state.unfolded[_id] !== true ){
      this.state.unfolded[_id] = true;
    } else {
      this.state.unfolded[_id] = false;
    }

    this.emit('SaveState',{state: {unfolded: this.state.unfolded}});
  },

  menterElementNode(_elementNode){

    // Strign 타입이면서 내용이 없는 String일 경우 바운딩박스를 구하지 못한다.
    // 그러므로 하이라이트도 불가능하므로 함수 탈출
    if (_elementNode.getType() === 'string') {
      if (!/..*/.test(_elementNode.getText())) {
        return;
      }
    }

    this.emit("MouseEnterElementNode", {
      elementNode: _elementNode
    });
  },

  mleaveElementNode(_elementNode){
    this.emit("MouseLeaveElementNode", {
      elementNode: _elementNode
    });
  },

  componentDidUpdate(){
    //console.log('tree navi updated', this.state.runningContext);
  },

  renderElementVisibility(_elementNode, _indentBlocks, _hasChildren){
    let self = this;
    let ghost = '';
    let type = _elementNode.getType();
    let repeatNumber = 0;

    if (_elementNode.isGhost) {
      ghost = 'ghost';
    } else {
      repeatNumber = _elementNode.getControlWithResolve('repeat-n');
    }

    if( !_hasChildren ) _indentBlocks.push(<div className='indent-block'/>);

    return (
      <div>
        { _indentBlocks }
        { _hasChildren? <i className={'folder fa fa-caret-' + (this.state.unfolded[_elementNode.getId()]? 'down':'right')} onClick={function(_e){ self.toggleElementChildren(_e,_elementNode.getId())}}/>:''}

        <label className={'visibility '+ ghost}>
            <span className='tag-name'>
              { type !== 'string'? _elementNode.getTagName():'text'}
            </span>
          { type !== 'string'? (_elementNode.getAttribute('id') !== undefined ? (
            <span className='en-element-id'>
              {_elementNode.getAttribute('id')}
            </span>) : ''):''
          }
            <span className='en-type'>
              {type}
            </span>
            {/*<span className='en-id'>
              {_elementNode.id}
            </span>*/}
          { type !== 'string'? (_elementNode.attributes.class !== undefined ? (
            <span className='en-class'>
              {_elementNode.attributes.class}
            </span>
          ) : ''):'' }

        </label>
          <span className='element-runes'>
            { repeatNumber > 0 ? <span> <i className='fa fa-retweet'/> +{repeatNumber} </span> : ''}
          </span>
      </div>
    );
  },

  renderEmptyInfo(_elementNode, _indentBlocks){
    var refType = _elementNode.getRefferenceType();
    var refTarget = _elementNode.getRefferenceTarget();

    return (
      <div>
        { _indentBlocks }

        <label className='empty-type-info'>
          <i className='fa fa-arrow-right'/>
          <span className='ref-type'>{ refType }</span>
          <i className='fa fa-link'/>
          <span className='ref-target'>{ refTarget }</span>
        </label>

      </div>
    )
  },

  renderElementNodeChildren(_children, _depth){
    var self = this;

    return (
      <ul>
        { _children.map(function (__en) {
          return self.renderElementNode(__en, _depth);
        }) }
      </ul>
    );
  },

  renderElementNode(_elementNode, _depth){

    let self = this;
    let indentBlocks = [];
    let type = _elementNode.getType();

    for (let i = 0; i < _depth; i++) {
      indentBlocks.push(<div className='indent-block'/>);
    }

    let selectedClass = '';
    if (this.props.selectedElementNode === _elementNode) {
      selectedClass = 'focused';
    }

    let isEmptyType = false;
    if (type === 'empty') isEmptyType = true;

    let hasChildren = false;

    if( /^(html|grid)$/.test(type)){
      if (_elementNode.children.length > 0) hasChildren = true;
    }

    return (
      <li>
        <div className={'element-node ' + selectedClass}
             onClick={function(){self.clickElementNode(_elementNode)}}
             onMouseEnter={function(){self.menterElementNode(_elementNode)}}
             onMouseLeave={function(){self.mleaveElementNode(_elementNode)}}>
          { this.renderElementVisibility(_elementNode, indentBlocks, hasChildren) }
          { isEmptyType ? this.renderEmptyInfo(_elementNode, indentBlocks) : '' }
        </div>


        { hasChildren && this.state.unfolded[_elementNode.getId()] ? this.renderElementNodeChildren(_elementNode.children, _depth + 1) : '' }
      </li>
    );
  },

  renderElementNodePool(_elementNodes){
    var self = this;
    // 탭으로 구현하기
    return (
      <div>
        <label> ElementNodes </label>
        { _elementNodes.map(function (__elementNode) {
          return (
            <div>
              <label> ID: {__elementNode.getId() } </label>
              <ul>
                {self.renderElementNode(__elementNode, 0)}
              </ul>
            </div>
          )
        })}
      </div>
    )
  },

  renderTreeWrapper(){

    if (this.props.runningContext === null) return <div/>;
    var runningContext = this.props.runningContext;
    var elementNode;
    var elementNodes;

    //console.log(runningContext);
    if (runningContext.contextType === 'document') {
      elementNode = runningContext.contextController.subject.rootElementNode;
      elementNodes = runningContext.contextController.subject.elementNodes;
    }


    return (
      <div className='tree-wrapper'>
        {/*<div className='context-info'>
          <span className='context-type'>{runningContext.contextType}</span>
          <span className='context-name'>{runningContext.contextName}</span>
        </div>*/}

        <ul>
          { elementNode !== null ? this.renderElementNode(elementNode, 0) : <div/> }
        </ul>
      </div>
    );
  },

  render() {
    var rootClasses = ['ContextContentsNavigation', this.props.config.theme, this.getMySizeClass()];


    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          <div className='body'>
            <ul className='tree-tab'>
              <li className='selected'>
                <span>Main Tree</span>
              </li>
              <li>
                <span>Sub Tree #22</span>
              </li>
              <li>
                <span>Sub Tree #37</span>
              </li>
            </ul>

            { this.renderTreeWrapper() }

          </div>
          <div className="footer">


          </div>
        </div>
      </div>
    );
  }
});

module.exports = ContextContentsNavigation;
