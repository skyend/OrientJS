
(function(){
    require('./PanelContainer.less');
    var React = require("react");

    var R = React.createClass({
        onMouseDownToHeader(){
            console.log('click');
        },

        render: function () {
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
                            { this.props.panel }
                        </div>
                    </div>
                </div>
            )
        }
    });

    module.exports = R;

})();
