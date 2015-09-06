
var React = require("react");
var ElementNode = require('../../serviceCrew/ElementNode.js');

require('./ContextContentsNavigation.less');

var ContextContentsNavigation = React.createClass({
    mixins: [
        require('../reactMixin/EventDistributor.js'),
        require('./mixins/WidthRuler.js')],

    getInitialState(){
        return {
          elementNode:null,
          runningContext:null
        };
    },

    clickElementNode( _elementNode ){
      this.emit("SelectElementNode",{
        elementNode: _elementNode
      });
    },

    menterElementNode( _elementNode ){

      // Strign 타입이면서 내용이 없는 String일 경우 바운딩박스를 구하지 못한다.
      // 그러므로 하이라이트도 불가능하므로 함수 탈출
      if( _elementNode.getType() === 'string' ){
        if(! /..*/.test(_elementNode.getText()) ){
          return;
        }
      }

      this.emit("MouseEnterElementNode",{
        elementNode: _elementNode
      });
    },

    mleaveElementNode( _elementNode ){
      this.emit("MouseLeaveElementNode",{
        elementNode: _elementNode
      });
    },

    componentDidUpdate(){
        //console.log('tree navi updated', this.state.runningContext);
    },

    renderElementVisibility(_elementNode, _indentBlocks){
      var ghost = '';
      if( _elementNode.isGhost ){
        ghost = 'ghost';
      }

      return (
        <div>
          { _indentBlocks }
          <label className={'visibility '+ ghost} >
            <span className='tag-name'>
              {_elementNode.getTagName()}
            </span>
            { _elementNode.attributes.id !== undefined ? (
            <span className='en-element-id'>
              {_elementNode.attributes.id}
            </span>) : ''
            }
            <span className='en-type'>
              {_elementNode.getType()}
            </span>
            <span className='en-id'>
              {_elementNode.id}
            </span>
            { _elementNode.attributes.class !== undefined ? (
            <span className='en-class'>
              {_elementNode.attributes.class}
            </span>
          ) : '' }
          </label>
        </div>
      );
    },

    renderEmptyInfo(_elementNode, _indentBlocks){
      var refType =  _elementNode.getRefferenceType();
      var refTarget =_elementNode.getRefferenceTarget();

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
          { _children.map( function(__en){ return self.renderElementNode(__en, _depth); } ) }
        </ul>
      );
    },

    renderElementNode( _elementNode, _depth ){

      var self = this;
      var indentBlocks = [];
      for( var i = 0; i < _depth; i++ ){
        indentBlocks.push(<div className='indent-block'/>);
      }

      var selectedClass = '';
      if( this.state.selectedElementNode === _elementNode ){
        selectedClass = 'focused';
      }

      var isEmptyType = false;
      if( _elementNode.getType() === 'empty' ) isEmptyType = true;

      var hasChildren = false;
      if( _elementNode.children.length > 0 ) hasChildren = true;

      return (
        <li>
          <div className={'element-node ' + selectedClass} onClick={function(){self.clickElementNode(_elementNode)}}
                                                            onMouseEnter={function(){self.menterElementNode(_elementNode)}}
                                                            onMouseLeave={function(){self.mleaveElementNode(_elementNode)}} >
            { this.renderElementVisibility(_elementNode, indentBlocks) }
            { isEmptyType ? this.renderEmptyInfo(_elementNode,indentBlocks): '' }
          </div>


          { hasChildren ? this.renderElementNodeChildren(_elementNode.children, _depth + 1): '' }
        </li>
      );
    },

    renderElementNodePool( _elementNodes ){
      var self = this;
      return (
        <div>
          <label> ElementNodes </label>
          { _elementNodes.map(function(__elementNode){
            return (
              <div>
                <label> ID: {__elementNode.getId() } </label>
                <ul>
                  {self.renderElementNode( __elementNode,0 )}
                </ul>
              </div>
            )
          })}
        </div>
      )
    },

    renderTreeWrapper(){

      if( this.state.runningContext === null ) return <div/>;
      var runningContext = this.state.runningContext;
      var elementNode;
      var elementNodes;

      //console.log(runningContext);
      if( runningContext.contextType === 'document' ){
        elementNode = runningContext.contextController.document.rootElementNode;
        elementNodes = runningContext.contextController.document.elementNodes;
      }


      return (
        <div className='tree-wrapper'>
          <div className='context-info'>
            <span className='context-type'>{runningContext.contextType}</span>
            <span className='context-name'>{runningContext.contextName}</span>
          </div>
          <ul>
            { elementNode instanceof ElementNode ? this.renderElementNode( elementNode,0 ): <div/> }
          </ul>
          { this.renderElementNodePool(elementNodes) }
        </div>
      );
    },

    render() {
        var rootClasses = ['ContextContentsNavigation', this.props.config.theme, this.getMySizeClass()];




        return (
            <div className={rootClasses.join(' ')}>
                <div className='wrapper'>
                  <div className='body'>

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
