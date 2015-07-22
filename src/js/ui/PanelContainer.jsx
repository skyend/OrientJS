
(function(){
    require('./PanelContainer.less');
    var React = require("react");

    var R = React.createClass({
        mixins:[ require('./reactMixin/EventDistributor.js') ],
        getInitialState(){
            return {  }
        },
        onMouseDownToHeader(){


            // GlobalDrag 자원 획득( 획득한 자원은 반드시 반환하고 상태를 종료 해주어야 한다.)
            app.ui.occupyGlobalDrag(this);
            app.ui.enableGlobalDrag();
            app.ui.toMouseDawn();
        },

        onGlobalDragStartFromUI(_e){
            //console.log('panelContainer drag start');
        },

        onGlobalDragFromUI(_e){
            if( typeof this.prevMouseY !== 'undefined' ){
                var selfDom = this.getDOMNode();
                var ymoveStep = this.prevMouseY - _e.clientY;
                selfDom.style.height = ( parseInt( selfDom.offsetHeight ) + ymoveStep ) + 'px';

                this.props.resizeMe();

            } else {
                this.prevMouseY = _e.clientY;
            }

            this.prevMouseY = _e.clientY;
        },

        onGlobalDragStopFromUI(_e){
            //console.log('panelContainer drag stop');

            /* Global Drag 자원 반환 */
            app.ui.disableGlobalDrag();
            app.ui.returnOccupyMouseDown();

            this.emit('StoppedDrag', {}, _e, "MouseEvent");
        },

        render: function () {

            var panel;
            if( typeof this.props.panel !== 'undefined' ){
                panel = this.props.panel;
            }

            return (
                <div className='PanelContainer night-dark'>
                    <div className='part-header' onMouseDown={this.onMouseDownToHeader}>
                        <div className='block-area'>
                            <ul>
                                <li>{this.props.panelTitle}</li>
                            </ul>

                        </div>
                        <div className='block-area right'>
                            <ul>
                                <li className='button'> <i className='fa fa-minus'></i> </li>
                            </ul>
                        </div>
                    </div>
                    <div className='part-body'>
                        <div className='react-container'>
                            { panel }
                        </div>
                    </div>
                </div>
            )
        }
    });

    module.exports = R;

})();
