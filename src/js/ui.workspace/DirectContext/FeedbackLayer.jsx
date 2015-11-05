import React from 'react';
import './FeedbackLayer.less';

var FeedbackLayer = React.createClass({


    render(){
        var style = {};
        style.left = this.props.left;
        style.top = this.props.top;
        style.width = this.props.width;
        style.height = this.props.height;

        return (
            <div className='FeedbackLayer' style={style}>
                <div className='element-node-tail'>
                    a
                </div>
            </div>
        )
    }
});

export default FeedbackLayer;
