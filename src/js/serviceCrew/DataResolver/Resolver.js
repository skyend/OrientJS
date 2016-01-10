import ObjectExplorer from '../../util/ObjectExplorer.js';


/**
  데이터가 존재하는 곳에 데이터 리졸버가 존재한다.
*/


class Resolver {
  constructor() {

    this.dataSpace = {};
  }

  setNS(_ns, _data) {
    this.dataSpace[_ns] = _data;
  }

  getNS(_ns) {
    return this.dataSpace[_ns];
  }

  resolve(_matter) {
    return this.interpret2(_matter);
  }

  interpret2(_matter) {
    let solved = _matter;
    let that = this;

    /*
      ${*....} // NS
      ${http-param:....} // HTTP
      ${cookie:.....} // Cookie
    */
    solved = _matter.replace(/\$\{(\*|[\w-]+:)([^\{^\}^\(^\)]*)\}/g, function(_matched, _intentKey, _description) {
      if (_intentKey === '*') {
        return that.resolveWithNS(_description);
      } else if (_intentKey === 'http-param:') {
        return that.resolveWithHttpParam(_description);
      } else if (_intentKey === 'cookie:') {
        return that.resolveWithCookie(_description);
      }
    });

    /*
      %{....}
    */
    solved = solved.replace(/%\{([^\{^\}]+)\}/g, function(_matched, _formularString) {

    });

    return solved;
  }

  resolveWithNS(_description) {

  }

  resolveWithHttpParam(_description) {

  }

  resolveWithCookie(_description) {

  }



  interpret(_text) {
    var self = this;





    // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
    // 객체를 보존하여 반환하도록 한다.
    if (/^\$\{.*?\}$/.test(_text)) {
      let matched = _text.match(/(\${(.*?)})/);
      console.log("ARGS", arguments);
      let signString = matched[2];

      return this.valueResolve(signString);
    } else {
      let valuesResolved = _text.replace(/\${(.*?)}(?:(\.[a-z]+))?/g, function(_matched, _signString, _optionString) {
        let rsvResult = self.valueResolve(_signString);
        console.log("ARGS", arguments);
        // ${...}.optionString 과 같은 형식을 사용 하였을 때 유효한 옵션이면 옵션처리 결과를 반환하며
        // 유효하지 않은 옵션은 signString의 리졸브 결과와 optionString형식으로 입력된 문자열을 살려서 반환한다.
        // 추후에 함수 형식도 지원
        switch (_optionString) {
          case ".count":
            return rsvResult.length;
        }
        if (_optionString !== undefined)
          return rsvResult + (_optionString || '');
        else
          return rsvResult;
      });

      return valuesResolved.replace(/(\%\((.*?)\))/g, function(_matched, _matched2, _formularString) {

        return self.processingFormularBlock(_formularString);
      });
    }
  }

  valueResolve(_sign) {
    let self = this;

    if (/^(\*?)([^:^*]*)$/.test(_sign)) {
      let matched = _sign.match(/^(\*?)(.*)$/);
      let firstMark = matched[1];
      let refValue = matched[2];
      console.log(firstMark);

      if (firstMark === '*') {

        let splited = refValue.split(/\//);
        let ns = splited.shift();
        let detail = splited.length > 0 ? splited.join('/') : undefined;

        let param = self.getNS(ns);
        if (param === undefined) {
          return '`Error: No Param NS: ' + ns + '`';
        }
        //console.log(detail, param, splited, _refValue);
        ///css/contents-retrieve-by-name/custom?serviceId=56755571b88a6c2ffd90e8e9
        if (detail !== undefined) {
          return ObjectExplorer.getValueByKeyPath(param, detail) || '`Error: No Param ' + detail + ' in ' + ns + '`';
        } else {
          return param;
        }
      }

      return '`Error: Interpret Error`';
    } else if (/^\w+:.*$/.test(_sign)) {
      let matches = _sign.match(/^(\w+):(.*)$/);
      let kind = matches[1];
      let target = matches[2];

      if (kind === 'script') {
        let url = this.contextController.serviceManager.getScriptURLByName(target);

        return url;
      } else if (kind === 'style') {
        let url = this.contextController.serviceManager.getStyleURLByName(target);

        return url;
      } else if (kind === 'image') {
        let url = this.contextController.serviceManager.getImageURLByName(target);

        return url;
      } else if (kind === 'static') {
        let url = this.contextController.serviceManager.getImageStaticByName(target);

        return url;
      }
    }
    return '`Error: Interpret Syntax Error`';
  }



  processingFormularBlock(_blockString) {
    let formularResult;

    try {
      formularResult = eval(_blockString);
    } catch (_e) {
      formularResult = false;
    }

    return formularResult;
  }

}

export default Resolver;