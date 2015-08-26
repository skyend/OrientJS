/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    require('./Modal.less');
    var React = require("react");
    var Modal = React.createClass({
        getInitialState() {
            return {
                Modal: <div/>,
                equipTool: null
            }
        },

        equipTool(_toolClass, _toolConfig, _toolKey, _storedToolState) {

            if (typeof _toolClass === 'function') {

                this.setState({
                    equipTool: {class: _toolClass, config: _toolConfig, toolKey: _toolKey, storedToolState: _storedToolState}
                });

            } else {
                this.setState({
                    equipTool: undefined
                });

                this.emit("NoticeMessage", {
                    title: "From PanelNavigation",
                    message: "Could't equip tool",
                    level: "error"
                });
            }

        },

        renderEquipTool(){
            if (this.state.equipTool === null) return;
            return (
                React.createElement(this.state.equipTool.class, {config: this.state.config, ref: this.state.equipTool.toolKey})
            );
        },

        show(){
            var selfDom = this.getDOMNode();
            selfDom.style.pointerEvents = 'auto';
            selfDom.style.opacity = 1;

        },

        hide(){
            var selfDom = this.getDOMNode();
            selfDom.style.pointerEvents = 'none';
            selfDom.style.opacity = 0;
        },

        onClose(){
            this.setState({equipTool: null});
        },
        handleFileSelectDrop(evt){
            console.log('drop');
            evt.stopPropagation();
            evt.preventDefault();
        },
        handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        },
        componentDidUpdate(){
            console.log('didUpdate');
            if (this.state.equipTool !== null) {
                this.show();
                var ui_modal = document.getElementById('ui-modal');
                ui_modal.addEventListener('drop', this.handleFileSelectDrop, false);
                ui_modal.addEventListener('dragover', this.handleDragOver, false);
                this.refs[this.state.equipTool.toolKey].setState({storedToolState: this.state.equipTool.storedToolState});

            } else {
                this.hide();
            }
        },
        render: function () {
            return (
                <div id="ui-modal">
                    <div className="modal">
                        <div className="modalHeader">
                            <i className="close fa fa-times" onClick={ this.onClose }></i>
                        </div>
                        <div className="modalBody">
                            {this.renderEquipTool()}
                        </div>
                    </div>
                </div>
            )
        }
    });

    module.exports = Modal;

})();
