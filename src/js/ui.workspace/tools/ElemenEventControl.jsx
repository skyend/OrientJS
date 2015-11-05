var React = require("react");
require('./ElemenEventControl.less');

var ElemenEventControl = React.createClass({
  mixins: [
    require('../reactMixin/EventDistributor.js'),
    require('./mixins/WidthRuler.js')],

  getInitialState(){
    return {
      elementNode: null
    };
  },


  renderEditParts(_elementNode){

    var isEmptyType = false;

    if (_elementNode.getType() === 'empty') isEmptyType = true;

    return (
      <div className='edit-parts'>
        <ElementProfile elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme}
                        ref='ElementProfile'/>

        <HTMLDOMSpec elementNode={_elementNode} width={this.props.width} theme={this.props.config.theme}
                     ref='HTMLDOMSpec'/>

        {isEmptyType ? <EmptyTypeElementNode elementNode={_elementNode} width={this.props.width}
                                             theme={this.props.config.theme} ref='EmptyTypeElementNode'/> : ''}
      </div>
    );
  },

  render() {
    var rootClasses = ['ElemenEventControl', this.props.config.theme, this.getMySizeClass()];

    var elementNode = this.state.elementNode;

    return (
      <div className={rootClasses.join(' ')}>
        <div className='wrapper'>
          <div className='body'>

          </div>
          <div className="footer">


          </div>
        </div>
      </div>
    );
  }
});

module.exports = ElemenEventControl;
