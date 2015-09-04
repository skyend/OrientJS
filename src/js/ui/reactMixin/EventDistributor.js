/**
 * EventDistributor.js
 *
 * ReactElement간 이벤트 유통을 구현하여 주는 객체
 *
 * Author: Jinwoong Han<theskyend0@gmail.com>
 * Version: 1.1
 */

(function() {

  var _CATCHERPREFIX_ = "onThrowCatcher"; // 변경금지

  var EventDistributor = {

    /**
     * Emitter
     *
     * @Param _eventName
     * @Param _eventData
     * @Param _seedEvent
     * @Param _seedEventType
     *
     * 이벤트를 상위컴포넌트로 던지는 메소드
     *
     */
    emit: function(_eventName, _eventData, _seedEvent, _seedEventType) {
      var eventName = _eventName;
      var eventData = _eventData;

      // EventData가 입력되지 않았다면 빈 Object를 생성해 입력해둔다.
      if (typeof eventData === 'undefined' || eventData === null) {
        eventData = {};
      }

      // SeedEvent정보를 eventData 에 입력한다.
      eventData.seedEvent = _seedEvent;
      eventData.seedEventType = _seedEventType;


      // 자신에 구현된 eventTernelToParent 를 이용하여 상위로 던지기 위한 시도를 한다.
      this.__eventTernelToParent(eventName, eventData, this.__myRefByParent);
    },

    /**
     * __eventTernelToParent
     *
     * @Param _eventName
     * @Param _eventData
     * @Param _seedEvent
     * @Param _seedEventType
     *
     * 상위(Owner)에 구현된 __eventTernelFromChildren메소드에 접근하여
     * 이벤트를 전송한다.
     */
    __eventTernelToParent: function(_eventName, _eventData, _seedEvent, _seedEventType) {
      if (typeof this.__ownerInstance !== 'undefined') {
        if (typeof this.__ownerInstance.__eventTernelFromChildren === 'function') {

          if (typeof _eventData.refPath !== 'object') {
            _eventData.refPath = [];
          }
          _eventData.refPath.push(this.__myRefByParent || this.props.__keyName);

          if (typeof _eventData.path !== 'object') {
            _eventData.path = [];
          }
          _eventData.path.push(this);

          this.__ownerInstance.__eventTernelFromChildren(_eventName, _eventData);
        } else {
          console.warn("ThrowEvent 를 허락하지 않는 Component입니다. ThrowEvent를 허락하기 위해서 EventDistributor를 Mixin 하여 주세요.\n발생된 이벤트 [" + _eventName + "]는 소멸될 것입니다.");
        }
      } else {
        console.warn("ThrowEvent가 최상위로 도달 하였습니다. \n발생된 이벤트 [" + _eventName + "]를 Catch하지 않음으로 소멸될 것입니다. \n이벤트를 Catch하려면 [" + _CATCHERPREFIX_ + _eventName + "]메서드를 구현 해 주세요.", _eventData);
      }
    },

    /**
     * __eventTernelFromChildren
     * @Param _eventName
     * @Param _eventData
     *
     * 하위 컴포넌트의 __eventTernelToParent메소드를 이용해 자신에게 던지는 이벤트를 받아들인다.
     * 받아 들인후 자신에 구현된 __eventCatch 로 전달해 이벤트를 라우팅 하도록 한다.
     */
    __eventTernelFromChildren: function(_eventName, _eventData) {


      this.__eventCatch(_eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType);
    },

    /**
     * __eventCatch
     * @Param _eventName
     * @Param _eventData
     * @Param _seedEvent
     * @Param _seedEventType
     *
     * eventTernelFromChildren 를 통해 전달받는 이벤트를 자신에게 구현된 Catcher 들로 라우팅 한다.
     */
    __eventCatch: function(_eventName, _eventData, _seedEvent, _seedEventType) {
      var catcher = this["onThrowCatcher" + _eventName];


      if (typeof catcher === 'function') {
        // 처리할 수 있는 핸들러가 존재 하는 경우 지정된 핸들러를 호출하여 처리하도록 한다.
        // 처리 후 더 상위객체에도 처리를 전달 할 수 있도록 pass function 을 제공한다.
        var self = this;


        // Catcher Parameters
        // 1: EventData
        // 2: Pass callback function
        /*catcher(_eventData, function() {
          self.emit(_eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType);
        });*/

        catcher.apply(this, [_eventData, function() {
          self.emit(_eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType);
        }]);
      } else {
        // 처리할 수 있는 핸들러가 존재 하지 않는 경우 더 상위로 올려 보내기위해 다시 emit 한다.

        this.emit(_eventName, _eventData, _eventData.seedEvent, _eventData.seedEventType);
      }
    },

    /**
     * Mount 예정인 컴포넌트에 상위컴포넌트에 대한 정보를 자신에게 입력해둔다.
     */
    componentWillMount: function() {
      // 자신의 상위컴포넌트(Owner)를 얻는다.
      var ownerComponent = this._reactInternalInstance._currentElement._owner;

      // 자신의 상위 컴포넌트가 존재한다면(not null) 상위컴포넌트 객체의 _instance 를 얻어 저장한다.
      if (ownerComponent !== null) {
        var ownerInstance = ownerComponent._instance;

        this.__ownerInstance = ownerInstance;

        // 상위 컴포넌트로부터 부여받은 자신의 ref키를 얻는다.
        this.__myRefByParent = this._reactInternalInstance._currentElement.ref;

        // ref를 부여받지 않았다면 refKey에 따른 처리를 달리 하기 위해 ref입력을 장려한다.
        if (typeof this.__myRefByParent === 'undefined') {
          console.warn("ref 가 지정되지 않은 컴포넌트 입니다. 상위 컴포넌트로부터 합리적인 ref를 지정되도록 하여주세요.");
        }

      }
    },

    /**
     * Component의 최상위 Root가 마운트 되는 시점에 상위에서 하위로 내려가면서 모든 componentDidMountByRoot 이벤트를 발생시킨다.
     * componentDidMountByRoot 메소드가 구현된 컴포넌트에 한해서 발생시킨다.
     */
    componentDidMount: function() {
      // 자신의 상위컴포넌트(Owner)를 얻는다.
      var ownerComponent = this._reactInternalInstance._currentElement._owner;

      // 자신의 상위 Component 가 존재하지 않는경우
      // 자신이 최상위 RootComponent 로써 자신의 하위 컴포넌트에 componentDidMountByRoot이벤트를 발생시키는 메소드를 호출한다.
      if (ownerComponent === null) {
        this.__fireChildrenRootMounted();
      }
    },

    /**
     * __fireChildrenRootMounted
     * 자신의 하위 컴포넌트에 componentDidMountByRoot이벤트를 발생시키며
     * 하위컴포넌트에 fireChildrenRootMounted 메소드가 존재 하는경우 하위컴포넌트에게도 자신의 하위컴포넌트에 componentDidMountByRoot이벤트를 발생시키도록 한다.
     */
    __fireChildrenRootMounted: function() {
      var children = this.__getComponentChildren();

      if (children === null || children === undefined) return;

      var childKeys = Object.keys(children);
      for (var i = 0; i < childKeys.length; i++) {
        var childKey = childKeys[i];

        var childComponent = children[childKey];


        if (typeof childComponent._instance.__fireChildrenRootMounted === 'function') {
          childComponent._instance.__fireChildrenRootMounted();
        }

        if (typeof this.componentDidMountByRoot === 'function') {
          this.componentDidMountByRoot();
        }
      }
    },

    /**
     * __getComponentChildren
     * 자신의 하위컴포넌트들을 가져오는 메소드
     */
    __getComponentChildren: function() {

      return this._reactInternalInstance._renderedComponent._renderedComponent._renderedChildren;
    },


    /**
         * Interface componentDidMountByRoot
         *
         * 최상위 Root컴포넌트가 마운트 되는 시점에 어떤 처리를 하고싶다면 아래의 메소드를 구현한다.
         *
         *
         componentDidMountByRoot: function(){
         // processing something...
      }
         */

    /**
     * manualBindForNotReactClass
     * ReactClass 가 아닌 객체가 ReactElement 의 이벤트를 듣고자 할 때 이 메소드를 호출하여 자신에게 바인딩 한다.
     * @Param _target : ReactClass가 아닌 ReactElement의 이벤트를 듣고자 하는 객체
     * @Param _childElement : 이벤트를 듣고자 하는 Mount된 ReactElement
     */
    manualBindForNotReactClass: function(_target, _childElement) {
      _childElement.__ownerInstance = _target;

      _target.__eventTernelFromChildren = this.__eventTernelFromChildren;
      _target.__eventTernelToParent = this.__eventTernelToParent;
      _target.__eventCatch = this.__eventCatch;
      _target.emit = this.emit;
    }

  };

  module.exports = EventDistributor;

})();