var Async = require('./lib/Async.js');
var React = require('react');
var _ = require('underscore');

var ToolFactory = function(_session, _toolsMap) {
  this.session = _session;
  this.toolsMap = _toolsMap;
  this.livingBirds = {};

  this.storedProps = {};
  this.storedState = {};

};

ToolFactory.prototype.storeToolState = function(_toolKey, _state) {
  var toolState = this.storedState[_toolKey] || {};

  // State Merge
  toolState = _.extend(toolState, _state);

  this.storedState[_toolKey] = toolState;

  if (this.livingBirds[_toolKey] === undefined) return;
  if (this.livingBirds[_toolKey]._owner === null) return;
  if (this.livingBirds[_toolKey]._owner._instance === null) return;


  this.livingBirds[_toolKey]._owner._instance.forceUpdate()
};


ToolFactory.prototype.addLivingBird = function(_toolKey, _bird) {
  this.livingBirds[_toolKey] = _bird;
};

ToolFactory.prototype.getToolEgg = function(_toolKey, _givingEgg) {
  var self = this;

  var result = this.toolClassLoad(_toolKey, function(__toolClass, __toolConfig) {


    var egg = function(_props) {
      var props = _props || {};
      props = _.extend(props, self.storedProps[_toolKey]);

      props.ref = _toolKey;
      props.config = __toolConfig;
      props.storedState = self.storedState[_toolKey];

      var toolBird = React.createElement(__toolClass, props);

      self.addLivingBird(_toolKey, toolBird);

      console.log('toolBird', toolBird);
      return toolBird;
    };

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
    var toolBundle = require("bundle!./ui/tools/" + toolPath);
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