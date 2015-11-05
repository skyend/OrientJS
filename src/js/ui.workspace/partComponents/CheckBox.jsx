import React from "react";
import "./CheckBox.less";

var CheckBox = React.createClass({
    getDefaultProps(){
        return {
            value: false,
        }
    },

    getInitialState(){
        return {
            value: this.props.value
        }
    },

    toggle(){
        var nextValue = !this.state.value;
        this.setState({value: nextValue});

        if (typeof this.props.onToggle === 'function') {
            if (this.props.onToggle(nextValue) === false) {
                this.setState({value: !nextValue});
            }
        }
    },

    render(){
        return <div className='CheckBox' onClick={this.toggle}>
            { this.state.value ? <i className='fa fa-check'/> : ''}
        </div>
    }
})

export default CheckBox;
