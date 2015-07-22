/**
 * EventDistributor.js
 *
 * ReactElement간 이벤트 유통을 구현하여 주는 객체
 *
 * Requires(js)  :
 * Requires(css) :
 */

(function () {

    var EventDistributor = {
        emit : function( _eventName, _eventData, _seedEvent, _seedEventType ){
            var eventName = _eventName;
            var eventData = _eventData;
            eventData.seedEvent = _seedEvent;
            eventData.seedEventType = _seedEventType;

            if( typeof this.props.onThrow === 'function' ){
                this.props.onThrow( eventName, eventData );

            } else {
                console.warn("이벤트를 청취하는 자가 없습니다. 발생된 이벤트 ["+eventName+"]는 소멸될 것입니다.", eventData);
            }
        },

        eventCatch : function( _eventName, _eventData, _seedEvent, _seedEventType ){
            var catcher = this["onThrowCatcher"+ _eventName];

            if( typeof catcher === 'function' ){
                catcher(_eventData)
            } else {
                this.emit( _eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType );
            }
        },

        /**
         * 자신이 마운트되면 자신에게 참조된 요소들에게 onThrow 를 입력한다.
         * 구성된 요소들 중 ref 가 지정된 요소에 대해 onThrow 를 입력한다.
         */
        componentDidMount : function(){
            var refKeys = Object.keys(this.refs);
            var self = this;

            for(var i = 0; i < refKeys.length; i++ ){
                var refKey = refKeys[i];

                this.refs[refKey].props.onThrow = function(){
                    self.eventCatch.apply(self, arguments);
                };
            }
        }
    };

    module.exports = EventDistributor;

})();