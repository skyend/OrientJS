/**
 * PanelTools.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {
    var React = require("react");
    require('./CSSMenu.less');

    var CSSMenu = React.createClass({
        itemValue(_value){
            return (
                <option value={_value}>{_value}</option>
            )
        },
        itemFilter(_item) {
            if (_item.type == 'select') {
                return (
                    <li>
                        <div>{_item.title}</div>
                        <select>
                            {_item.value.map(this.itemValue)}
                        </select>
                    </li>
                )
            } else if (_item.type == 'text') {
                return (
                    <li>
                        <div>{_item.title}</div>
                        <input type="text"></input>
                    </li>
                )
            }
        },

        renderItems(_group){
            return (
                <div className="item">
                    <div className="title">{_group.title}</div>
                    <ul className="inventory">
                        {_group.items.map(this.itemFilter)}
                    </ul>
                </div>
            )
        },

        render() {
            return (
                <div className='CSSMenu white'>
                    {this.props.config.items.map(this.renderItems)}
                </div>
            );
        }
    });
    module.exports = CSSMenu;
})();
