(function () {
    var React = require("react");
    require('./ComponentPalette.less');

    var BasicButton = require('../partComponents/BasicButton.jsx');
    var InputBoxWithSelector = require('../partComponents/InputBoxWithSelector.jsx');
    var ComponentPreviewer = require('../partComponents/ComponentPreviewer.jsx');

    var ComponentPalette = React.createClass({
        mixins: [
            require('../reactMixin/EventDistributor.js'),
            require('./mixins/WidthRuler.js')],

        getInitialState(){
          return {
            availabelComponentList : []
          }
        },

        mouseOverListItem( _key){

          this.emit('IMustPreviewComponent', {
            componentKey:_key
          });
        },

        mouseDownTo(_key){
            app.ui.occupyGlobalDrag(this, true);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();
        },

        listItemRender( _componentKey){
          var self = this;
          return (
            <li onMouseOver={ function(){ self.mouseOverListItem(_componentKey)} } onMouseDown={ function(){ self.mouseDownTo(_componentKey) }}>
              { _componentKey}
            </li>
          )
        },

        onGlobalDragStartFromUI(_e){

        },

        onGlobalDragFromUI(_e){

        },

        onGlobalDragStopFromUI(_e){

        },

        componentDidMount(){
            this.refs['ComponentPreviewer'].displayComponent( InputBoxWithSelector, "reactClass");

            this.emit('UpdateComponentListToMe');
        },

        componentDidUpdate( _prevProps, _prevState){

            if( typeof this.state.previewComponent === 'object' ){

                this.refs['ComponentPreviewer'].displayComponent( this.state.previewComponent.class , 'reactClass', this.state.previewComponent.CSS );
            }
        },

        render() {
            var wide = false;
            var rootClasses = ['ComponentPalette', 'black', this.getMySizeClass()];

            return (
                <div className={rootClasses.join(' ')}>
                    <div className='wrapper'>
                        <div className='head'>
                            ComponentPalette
                        </div>
                        <div className='body'>
                            <div className='previewer-area'>
                                <ComponentPreviewer width="100%" height="100%" ref="ComponentPreviewer"/>
                            </div>
                            <div className='list-area'>
                                <ul>
                                  {this.state.availabelComponentList.map(this.listItemRender)}
                                </ul>
                            </div>
                        </div>
                        <div className='foot'>

                        </div>
                    </div>
                </div>
            );
        }
    });

    module.exports = ComponentPalette;
})();
