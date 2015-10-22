
var React = require("react");
require('./ElementNodeControl.less');
var HorizonFieldSet = require('../partComponents/HorizonFieldSet.jsx');

var ElementNodeControl = React.createClass({
    mixins: [
        require('../reactMixin/EventDistributor.js'),
        require('./mixins/WidthRuler.js')],

    getInitialState(){
        return {
          elementNode:null
        };
    },

    onThrowCatcherChangedValue( _eventData, _pass ){
      var elementNode = this.state.elementNode;
      var changedData = _eventData.data;

      if( _eventData.refPath[1] === 'RepeatControl'){
        switch( _eventData.refPath[0] ){
          case "RepeatN":
          if( changedData === '' ) changedData = undefined;
          elementNode.setControl('repeat-n', changedData);
        }
      }



      this.setState({elementNode:elementNode});
      elementNode.executeSnapshot();
    },


    renderEditParts(_elementNode){
      var repeatControlfields = [
        { "name": "RepeatN",  title:"반복횟수","initialValue": _elementNode.getControl("repeat-n") || '' , enterable:true, type:'input'}
      ];


      return (
        <div className='edit-parts'>
          <div className='part'>
            <HorizonFieldSet  title="Repeat" fields={repeatControlfields} theme={this.props.config.theme} nameWidth={130} ref='RepeatControl'/>
          </div>
        </div>
      );
    },

    render() {
        var rootClasses = ['ElementNodeControl', this.props.config.theme, this.getMySizeClass()];

        var elementNode = this.state.elementNode;

        return (
            <div className={rootClasses.join(' ')}>
                <div className='wrapper'>
                  <div className='body'>
                    { elementNode !== null ? this.renderEditParts(elementNode):"No focused." }
                  </div>
                  <div className="footer">


                  </div>
                </div>
            </div>
        );
    }
});

module.exports = ElementNodeControl;