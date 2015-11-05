import './OutlineButton.less';
import React from "react";

var OutlineButton = React.createClass({
    getDefaultProps(){
        return {
            onClick: null,
            disabled: false
        }
    },

    onClick(_e){
        if (this.props.disabled) return;

        if (typeof this.props.onClick === 'function') {
            this.props.onClick(_e);
        } else {
            // emit
        }
    },

    renderIcon(){
        if (this.props.icon !== undefined) {
            var iconclass = 'fa fa-' + this.props.icon;
            return (
                <div className='icon' style={{fontSize:this.props.iconSize||'inherit'}}>
                    <i className={iconclass}/>
                </div>
            )
        }

        return <span/>;
    },

    renderTitle(){
        if (this.props.title !== undefined) {
            return (
                <div className='title' style={{fontSize:this.props.titleSize||'inherit'}}>
                    {this.props.title}
                </div>
            )
        }

        return <span/>;
    },

    render() {
        var classes = [];
        classes.push('OutlineButton');
        classes.push('color-' + this.props.color);
        classes.push(this.props.size);
        if (this.props.disabled)
            classes.push('disabled');

        return (
            <div className={classes.join(' ')}>
                <button onClick={ this.onClick }>
                    { this.renderIcon() }
                    { this.renderTitle() }
                </button>
            </div>
        );
    }
});


export default OutlineButton;
