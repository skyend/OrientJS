(function () {
    require('./VNodePathNavigator.less');
    var React = require("react");

    var VNodePathNavigator = React.createClass({


        renderVNodePathItem(_vnode){

            var classElement;
            if (typeof _vnode.classes === 'string') {
                classElement = <span className='class'> {_vnode.classes} </span>
            }


            return (
                <li>
                    <span className='tag'>{_vnode.name}</span>
                    { classElement }
                </li>
            )
        },

        render() {

            return (
                <div className='VNodePathNavigator theme-default' style={{height:this.props.height}}>
                    <ul>
                        { this.props.vnodePathArray.map(this.renderVNodePathItem) }
                    </ul>
                </div>
            )
        }
    });


    module.exports = VNodePathNavigator;

})();
