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
            availableComponentPackageMeta : {}
          }
        },

        mouseOverListItem( _componentKey, _packageKey){

          this.emit('IMustPreviewComponent', {
            componentKey:_componentKey
          });
        },

        mouseDownTo(_componentKey, _packageKey){
            app.ui.occupyGlobalDrag(this, true);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();

            var holderHTML = "<div class='componentDragHolder'></div>";
            app.ui.holdingElementWhileDrag(holderHTML);

            this.willDeployComponentKey = _componentKey;
        },

        renderComponentMeta( _componentMeta, _packageKey ){
          var self = this;

          return (
            <li onMouseOver={ function(){ self.mouseOverListItem(_componentMeta.key, _packageKey)} } onMouseDown={ function(){ self.mouseDownTo(_componentMeta.key, _packageKey) }}>
              <i className='fa fa-cube'></i> { _componentMeta.name }
            </li>
          )
        },

        renderPackageMeta( _packageKey ){
          var self = this;
          var packageMeta = this.state.availableComponentPackageMeta[_packageKey];

          return (
            <div className='package'>
              <label> <i className='fa fa-gift'></i> {packageMeta.name} </label>
              <ul>
                {packageMeta.components.map( function(__component){return self.renderComponentMeta(__component, _packageKey)} ) }
              </ul>
            </div>
          );


        },

        onGlobalDragStartFromUI(_e){
            this.emit("BeginDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey
            });
        },

        onGlobalDragFromUI(_e){
            this.emit("DragDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey
            });
        },

        onGlobalDragStopFromUI(_e){
            this.emit("DropDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey
            });

            this.willDeployComponentKey = undefined;
        },

        componentDidMount(){
            this.refs['ComponentPreviewer'].displayComponent( InputBoxWithSelector, "reactClass");

            this.emit('NeedStateComponentPackageMeta');
        },

        componentDidUpdate( _prevProps, _prevState){

            if( typeof this.state.previewComponent === 'object' ){

                this.refs['ComponentPreviewer'].displayComponent( this.state.previewComponent.class , 'reactClass', this.state.previewComponent.CSS );
            }
        },

        render() {
            var wide = false;
            var rootClasses = ['ComponentPalette', 'black', this.getMySizeClass()];
            console.log( this.state );
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
                                  {Object.keys(this.state.availableComponentPackageMeta).map(this.renderPackageMeta)}
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
