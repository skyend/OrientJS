/**
 * BuilderNavigation.jsx
 *
 * 빌더 상단의 메뉴를 표시하는 클래스
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {

   var NotificationSystem = require('react-notification-system');
   require("./NotificationSystem.less");

   var React = require("react");

   var NotificationMessage = React.createClass({
        _notificationSystem: null,

        /*
         {
            type: "simple-message" | 
            title:
            message:
            level:
         }
        */
        notify: function( _notifyObject ) {

            if( _notifyObject.type === 'simple-message' ){
               this._notificationSystem.addNotification({
                  title: _notifyObject.title,
                  message: _notifyObject.message,
                  level: _notifyObject.level,
                  autoDismiss : 10,
               });
            }

        },

        componentDidMount: function() {
            this._notificationSystem = this.refs.notificationSystem;
        },

        render: function() {
            return (
                <div id="noti-message" className="NotificationWrapper steel-gray">
                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        }
    });

    module.exports = NotificationMessage;

})();
