
var React = require("react");
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

    componentDidUpdate(){
        console.log('tree navi updated', this.state.runningContext);
    },

    renderElementNode( _elementNode ){
      return (
        <li>


        </li>
      );
    },

    renderTreeWrapper(){
      if( this.state.runningContext === null ) return <div/>;
      var runningContext = this.state.runningContext;
      var elementNode;// = runningContext.

      if( runningContext.contextType === 'document' ){
        elementNode = runningContext.document.rootElementNode;
      }


      return (
        <div className='tree-wrapper'>
          <div className='context-info'>
            <span className='context-type'>{runningContext.contextType}</span>
            <span className='context-name'>{runningContext.contextName}</span>
          </div>
          <ul>
            <li>
              <label className='element-node'><span>Root</span></label>
              { elementNode !== null ? this.renderElementNode( elementNode ): <div/> }
            </li>
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
