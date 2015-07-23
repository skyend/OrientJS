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
                console.warn("더 이상 이벤트를 청취하는 자가 없습니다. 발생된 이벤트 ["+eventName+"]는 소멸될 것입니다.", eventData);
            }
        },

        eventCatch : function( _eventName, _eventData, _seedEvent, _seedEventType, _refKey ){
            var catcher = this["onThrowCatcher"+ _eventName];

            if( typeof _eventData.refPath !== 'object' ){
                _eventData.refPath = [];
            }

            _eventData.refPath.push(_refKey);

            if( typeof catcher === 'function' ){
                // 처리할 수 있는 핸들러가 존재 하는 경우 지정된 핸들러를 호출하여 처리하도록 한다.
                // 처리 후 더 상위객체에도 처리를 전달 할 수 있도록 pass function 을 제공한다.
                var self = this;


                // Catcher Parameters
                // 1: EventData
                // 2: Pass callback function
                catcher(_eventData, function(){
                    self.emit( _eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType, _refKey );
                });
            } else {
                // 처리할 수 있는 핸들러가 존재 하지 않는 경우 더 상위로 올려 보내기위해 다시 emit 한다.

                this.emit( _eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType, _refKey );
            }
        },

        /**
         * 자신이 마운트되면 자신에게 참조된 요소들에게 onThrow 를 입력한다.
         * 구성된 요소들 중 ref 가 지정된 요소에 대해 onThrow 를 입력한다.
         */
        componentWillMount  : function(){
            var refKeys = Object.keys(this.refs);

            for(var i = 0; i < refKeys.length; i++ ){
                var refKey = refKeys[i];

                this.refs[refKey].props.onThrow = this.getOnThrow(refKey);
            }
        },

        getOnThrow: function( _refKey){
            var self = this;

            return function() {
                var argArr = [];

                argArr[0] = arguments[0]; // EventName
                argArr[1] = arguments[1]; // EventData
                argArr[2] = arguments[2]; // SeedEvent
                argArr[3] = arguments[3]; // SeedEventType
                argArr[4] = _refKey;      // EventEmitter refName

                self.eventCatch.apply(self, argArr);
            }
        }
    };

    module.exports = EventDistributor;

})();