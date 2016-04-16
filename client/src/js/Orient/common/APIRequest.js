import HTTPRequest from './HTTPRequest';



const REGEXP_APISOURCE_MEAN = /^\[([\w\d-_]+)\](.+)$/;

class APIRequest {
  constructor(_env) {
    this.env = _env;
  }

  request(_apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {
    APIRequest.RequestAPI(this.env, _apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride);
  }

  static RequestAPI(_env, _apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {

    // apiSource 의 class 확인
    // http 와 https class 는 직접 요청 처리 그 외 class는 env 를 통해 실행.
    // http 와 https 는 //로 시작하거나 /로 시작해야 함
    let sourceMatches = _apiSourceDesc.match(REGEXP_APISOURCE_MEAN);
    if (sourceMatches === null) throw new Error(`잘못된 APISource(${_apiSourceDesc}) 지정 입니다.`);

    let sourceType = sourceMatches[1],
      sourceTarget = sourceMatches[2];


    if (/^https?$/.test(sourceType)) {
      HTTPRequest.request(_methodOverride || 'get', sourceTarget, _paramObject, function(_err, _res) {
        if (_err !== null) return _callback(_err, null);


        _callback(null, _res.body || _res.text, _res.statusCode);
      }, _enctype);
    } else {
      // apisource JSON을 로드한다.
      // env 의 APISOurce Factory에 접근한다.
      // JSON을 APISource로 빌드한다.
      if (!_requestId) throw new Error(`APISource(${_apiSourceTarget})에 대응하는 RequestID를 찾을 수 없습니다. 구성을 확인 해 주세요.`);
      if (!_env) throw new Error('Error: Couldn\'n APISource Request. Required the Environment.');

      _env.apiSourceFactory.getInstanceWithRemote(sourceType, sourceTarget, function(_apiSource) {

        _apiSource.executeRequest(_requestId, _paramObject, {}, function(_err, _retrievedObject, _statusCode) {
          if (_err !== null) return _callback(_err, null);

          _callback(null, _retrievedObject, _statusCode);
        }, _enctype);
      })

    }
  }
}

export default APIRequest;