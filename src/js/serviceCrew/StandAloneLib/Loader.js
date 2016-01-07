import request from 'superagent';

class ServiceResourceLoader {
  static loadConfig(_complete) {
    request.get('./config/config.json')
      .end(function(_err, _result) {
        //  console.log(_err, _result);
        if (_err !== null) throw new Error('Fail load a config.');
        _complete(_result.body);
      });
  }

  static loadFragment(_name, _complete) {
    request.get('./fragments/' + _name + '.html')
      .end(function(_err, _result) {
        //  console.log(_err, _result);
        if (_err !== null) throw new Error('Fail load a fragment [' + _name + ']');
        _complete(_result.text);
      });
  }

  static loadSharedElementNode(_name, _complete) {
    request.get('./fragments/shared/' + _name + '.html')
      .end(function(_err, _result) {
        // console.log(_err, _result);
        if (_err !== null) throw new Error('Fail load a shared [' + _name + ']');
        _complete(_result.text);
      });
  }

  static loadAPISource(_name, _complete) {
    request.get('./apisources/' + _name + '.json')
      .end(function(_err, _result) {
        // console.log(_err, _result);
        if (_err !== null) throw new Error('Fail load a apisource [' + _name + ']');
        _complete(_result.body);
      });
  }
}

export default ServiceResourceLoader;