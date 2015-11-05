require('./ElementPathNavigator.less');
var React = require("react");

var ElementPathNavigator = React.createClass({


    render() {

        return (
            <div className='ElementPathNavigator theme-default' style={{height:this.props.height}}>
                <ul>

                </ul>
            </div>
        )
    }
});


module.exports = ElementPathNavigator;
