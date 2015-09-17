/**
 * ProjectNavigation.jsx
 *
 * 빌더 오른쪽의 프로젝트에 관한 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var MenuItem = {
    title: "",
    type: "button | input | select | ...",
    action: {}
};

(function () {
    var React = require("react");
    require('./FloatingMenuBox.less');

    var MenuItem = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],

        onClick(_e) {
            // 기본 이벤트 데이터 필드를 베이스로 eventData 객체를 구축한다.
            var eventData = this.props.addEventDataFields;

            this.emit(this.props.eventName, eventData, _e, "ReactMouseClick");
        },

        render() {

            return (
                <li className={this.props.type} onClick={this.onClick}>  {this.props.title} </li>
            );
        }
    });

    var FloatingMenuBox = React.createClass({
        mixins: [require('./reactMixin/EventDistributor.js')],

        getInitialState() {

            return {
                display: "off", // on , off
                x: 0,
                y: 0,
                memuItems: [],

                // Floating Menu 의 존재의 이유
                for: "",
                target: {}
            };
        },


        menuItemRender(_item) {

            if (typeof _item === "object") {
                return (<MenuItem ref={ _item.key }
                    title={_item.title}
                    type={_item.type}
                    eventName={_item.eventName}
                    addEventDataFields={ {for: this.state.for, target: this.state.target} }/>);

            } else if (_item === 'spliter') {
                return <hr/>
            }
        },

        componentDidMount() {
        },

        render() {
            var styles = {
                display: "none"
            };

            if (this.state.display === 'off') {
                styles.display = "none";
            } else if (this.state.display === "on") {
                styles.display = "block";
            }

            styles.left = this.state.x + "px";
            styles.top = this.state.y + "px";

            return (
                <div className='FloatingMenuBox black' style={styles}>
                    
                    <div className='body'>
                        <ul>
                     {this.state.memuItems.map(this.menuItemRender)}
                        </ul>
                    </div>
                </div>
            );
        }
    });

    module.exports = FloatingMenuBox;

})();
