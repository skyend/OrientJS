/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

var NotificationSystem = require('react-notification-system');
require("./PushMessage.less");

(function () {
    var React = require("react");
    var PushMessage = React.createClass({
        _notificationSystem: null,

        _addNotification: function(event) {
            event.preventDefault();
            this._notificationSystem.addNotification({
                message: '푸시메시지 테스트 중',
                level: 'success'
            });
        },

        componentDidMount: function() {
            this._notificationSystem = this.refs.notificationSystem;
        },

        render: function() {
            return (
                <div id="push-message">
                    <button onClick={this._addNotification}>PushMessageTest</button>
                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        }
    });

    module.exports = PushMessage;

})();


