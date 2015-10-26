var Async = require('./lib/Async.js');
var React = require('react');
var _ = require('underscore');

var ToolFactory = function(_session, _toolsMap) {
  this.session = _session;
  this.toolsMap = _toolsMap;
  this.livingBirds = {};

  this.storedProps = {};
  this.storedStates = {};

};

// 특정 Tool 의 State를 보존한다.
ToolFactory.prototype.storeToolState = function(_toolKey, _state) {
  //if (_toolKey === 'ContextContentsNavigation') throw new Error('a');
  // 저장된 State가져오기
  var storedToolState = this.storedStates[_toolKey] || {};
  var state = _state || {};

  // 이전에 저장된 State와 이번에 저장하려는 State의 값이 같다면 저장 요청은 무시한다.
  var updateStateKeys = Object.keys(state);
  var changed = false;
  var key;
  for (var i = 0; i < updateStateKeys.length; i++) {
    key = updateStateKeys[i];

    if (state[key] !== storedToolState[key]) {
      changed = true;
      break;
    }
  }
  // 이전과 다른 State가 없다면 스킵
  if (!changed) return;



  // State Merge
  storedToolState = _.extend(storedToolState, state);

  this.storedStates[_toolKey] = storedToolState;

  if (this.livingBirds[_toolKey] === undefined) return;
  if (this.livingBirds[_toolKey]._owner === null) return;
  if (this.livingBirds[_toolKey]._owner._instance === null) return;


  // ToolBird의 Owner는 ToolNest일 것이다.
  // ToolNest는 ToolBird를 랜더링하기 위해 제공받은 ToolEgg를 호출하게 된다.
  // ToolEgg를 호출 하여 ToolBird Element를 얻는 후 StoredState 를 반영하므로
  // ToolNest에게 forceUpdate 메시지를 보낸다.
  this.livingBirds[_toolKey]._owner._instance.forceUpdate()
};


ToolFactory.prototype.addLivingBird = function(_toolKey, _bird) {
  this.livingBirds[_toolKey] = _bird;
};

ToolFactory.prototype.getToolEgg = function(_toolKey, _params, _givingEgg) {
  var self = this;

  var result = this.toolClassLoad(_toolKey, function(__toolClass, __toolConfig) {

    // ToolNest 에서 egg를 실행하여 Tool ReactElement를 얻는다.
    var egg = function(_props) {
      var props = _props || {};
      props = _.extend(props, self.storedProps[_toolKey]);

      props.ref = _toolKey;
      props.config = __toolConfig;
      props.params = _params;
      // tool property에 storedState를 입력 해 둔다.
      props.storedState = self.storedStates[_toolKey];

      var toolBird = React.createElement(__toolClass, props);

      self.addLivingBird(_toolKey, toolBird);

      return toolBird;
    };



    egg.toolKey = _toolKey;
    egg.toolTitle = self.toolsMap[_toolKey].title;
    egg.toolHelperText = self.toolsMap[_toolKey].toolHelperText;

    // param 에 title 이 입력되어 있다면 toolTitle의 값을 param title 을 사용한다.
    if (_params !== undefined && _params.title !== undefined) {
      egg.toolTitle = _params.title;
    }

    _givingEgg(egg);
  });
};

ToolFactory.prototype.toolClassLoad = function(_toolKey, _loadedCB) {

  var toolMap = this.toolsMap[_toolKey];

  /**
   * WaterFall 을 이용하여 비동기로드를 동기화한다.
   */
  Async.waterFall(toolMap, [function(__toolSpec, __cb) {
    try {
      if (typeof __toolSpec !== 'object') {
        throw new Error("Tool[" + _toolKey + "] Spec Object is not exists.");
      }

      if (typeof __toolSpec.jsxPath !== 'string') {
        throw new Error("Tool[" + _toolKey + "] JSXPath is not exists.");
      }

      loadTool(__toolSpec.jsxPath + ".jsx", function(___err, ___tool) {
        if (___err !== null) {
          throw new Error("Fail to load tool[" + _toolKey + "].");
        } else {
          __cb(__toolSpec, ___tool);
        }
      });
    } catch (e) {
      throw e;
    }

  }, function(__toolSpec, __tool, __cb) {

    // config 파일이 없다면 지나간다.
    if (typeof __toolSpec.configPath === 'undefined') {
      return __cb(__tool, null);
    }

    loadConfig(__toolSpec.configPath + ".json", function(___err, ___toolConfig) {
      if (___err !== null) {
        throw new Error("Fail to load tool[" + _toolKey + "]Config.");
      } else {

        __cb(__tool, ___toolConfig);
      }
    });
  }, function(__tool, __toolConfig) {

    _loadedCB(__tool, __toolConfig);
  }]);
};


function loadTool(toolPath, callback) {
  try {
    var toolBundle = require("bundle!./ui.workspace/tools/" + toolPath);
  } catch (e) {
    return callback(e);
  }
  toolBundle(function(page) {
    callback(null, page);
  })
}

function loadConfig(configName, callback) {
  try {
    var configBundle = require("bundle!../config/" + configName);
  } catch (e) {
    return callback(e);
  }
  configBundle(function(page) {
    callback(null, page);
  })
}

module.exports = ToolFactory;