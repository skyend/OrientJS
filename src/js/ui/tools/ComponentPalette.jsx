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
            availableComponentPackageMeta : []
          }
        },

        mouseOverListItem( _componentKey, _packageKey){

          this.emit('IMustPreviewComponent', {
            componentKey:_componentKey,
            packageKey: _packageKey
          });
        },

        mouseDownTo(_componentKey, _packageKey){
            app.ui.occupyGlobalDrag(this, true);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();

            var holderHTML = "<div class='componentDragHolder' style='pointer-events:none;' ></div>";
            app.ui.holdingElementWhileDrag(holderHTML);

            this.willDeployComponentKey = _componentKey;
            this.willDeployPackageKey = _packageKey;
        },



        onGlobalDragStartFromUI(_e){
            this.emit("BeginDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey,
                packageKey : this.willDeployPackageKey
            });
        },

        onGlobalDragFromUI(_e){
            this.emit("DragDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey,
                packageKey : this.willDeployPackageKey
            });
        },

        onGlobalDragStopFromUI(_e){
            this.emit("DropDeployComponent", {
                absoluteX: _e.clientX,
                absoluteY: _e.clientY,
                componentKey : this.willDeployComponentKey,
                packageKey : this.willDeployPackageKey
            });

            this.willDeployComponentKey = undefined;
            this.willDeployPackageKey = undefined;
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

        renderComponentMeta( _componentMeta, _packageKey ){
          var self = this;

          return (
            <li onMouseOver={ function(){ self.mouseOverListItem(_componentMeta.key, _packageKey)} } onMouseDown={ function(){ self.mouseDownTo(_componentMeta.key, _packageKey) }}>
              <i className='fa fa-cube'></i> { _componentMeta.name }
            </li>
          )
        },

        renderPackageMeta( _packageMeta ){
          var self = this;

          return (
            <li className='package'>
              <label> <i className='fa fa-gift'></i> {_packageMeta.name} </label>
              <ul>
                { _packageMeta.components.map( function(__component){return self.renderComponentMeta(__component, _packageMeta.key)} ) }
              </ul>
            </li>
          );


        },

        render() {
            var wide = false;
            var rootClasses = ['ComponentPalette', 'theme-scott-mc-carthy', this.getMySizeClass()];

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
                            <div className='package-list-area'>
                                <ul className='package-list'>
                                  {this.state.availableComponentPackageMeta.map(this.renderPackageMeta)}
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
