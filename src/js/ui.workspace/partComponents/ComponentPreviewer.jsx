/**
 * ComponentPreviewer (react)
 * 컴포넌트 미리보기
 *
 * Requires: ComponentPreviewer.less, IFrameStage.jsx
 */

var React = require("react");
require('./ComponentPreviewer.less');
var IFrameStage = require('./IFrameStage.jsx');

var ComponentPreviewer = React.createClass({
  getInitialState(){
    return {}
  },

  getIframeWindow(){
    return this.refs['render-stage'].getIframeInnerWindow();
  },

  displayComponent(_componentSource, _componentSourceType, _CSS){

    this.setState({
      componentSource: _componentSource,
      componentSourceType: _componentSourceType,
      componentCSS: _CSS
    });
  },

  renderComponent(){

    if (typeof this.state.componentSource === 'object') {
      if (typeof this.state.componentSourceType === 'undefined') throw new Error("Need a componentSourceType.");
    }

    var ComponentSource = this.state.componentSource;

    switch (this.state.componentSourceType) {
      case "reactClass":
        return React.createElement(ComponentSource);
    }

  },

  componentDidUpdate(_prevState, _prevProps){
    var invisibleRenderedComponent = this.refs['invisible-prerender-box'].getDOMNode();

    var renderStage = this.refs['render-stage'];

    renderStage.writeContentsToBody(invisibleRenderedComponent.innerHTML, this.state.componentCSS);
    /**
     컴포넌트 위치 및 크기 최적조정
     */
    /*
     var renderedComponent = this.refs['rendered-component'];

     if( typeof renderedComponent !== 'object' ) return;

     var wDom = this.refs['component-wrapper'].getDOMNode();
     var wrapperWidth = wDom.offsetWidth;
     var wrapperHeight = wDom.offsetHeight;

     var rCDom = renderedComponent.getDOMNode();
     var rCWidth = rCDom.offsetWidth;
     var rCHeight = rCDom.offsetHeight;

     var wRatio = rCWidth / wrapperWidth;
     var hRatio = rCHeight / wrapperHeight;

     var biggerRatioTo;
     var delegateRatio;
     if( wRatio < hRatio ){
     biggerRatioTo = "h";
     delegateRatio = hRatio;
     }else{
     biggerRatioTo = "w";
     delegateRatio = wRatio;
     }

     if( delegateRatio > 1 ){

     }

     var tobeRatio = delegateRatio
     console.log(biggerRatioTo, wRatio, hRatio, delegateRatio);
     */
  },

  render() {
    var classes = [];
    classes.push('ComponentPreviewer');
    classes.push('theme-'+(this.props.color||'defualt'));
    classes.push(this.props.size);

    return (
      <div className={ classes.join(' ') } style={ { width: this.props.width, height: this.props.height } }>
        <div className='render-area'>

          <IFrameStage ref='render-stage' src='about:blank' width={this.props.width} color={this.props.color}
                       height={this.props.height}/>

          <div className="component-view-wrap">

          </div>

          <div className='invisible-prerender-box' ref='invisible-prerender-box'>
            { this.renderComponent() }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ComponentPreviewer;
