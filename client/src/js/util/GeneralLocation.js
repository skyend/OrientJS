class GeneralLocation {

  static getHashbangParam(_key, _window) {
    let hash_params = GeneralLocation.parseHashbangParams(_window);
    let scannedElements = [];

    let param_pair;
    for (let i = 0; i < hash_params.length; i++) {
      param_pair = hash_params[i];

      if (param_pair[0] === _key) {
        scannedElements.push(param_pair[1]);
      }
    }

    if (scannedElements.length === 0) {
      // isn't
      return null;
    } else if (scannedElements.length === 1) {
      // Single
      return scannedElements[0];
    } else {
      // Multi
      return scannedElements;
    }
  }

  static parseHashbangParams(_window) {
    let targetWindow = _window || window;

    let hashtag = targetWindow.location.hash;
    if (!hashtag.match(/^\#!/)) {
      console.warn('Location Hash was not format as Hashbang.');
      return [];
    }

    let hashbang = hashtag.replace(/^\#!/, '');

    let hash_params = [];
    let splitedParamPair = hashbang.split('&');
    let pair;
    for (let i = 0; i < splitedParamPair.length; i++) {
      pair = splitedParamPair[i];

      let splitedParamComponents = pair.split('=');

      if (splitedParamComponents[0])
        hash_params.push([decodeURIComponent(splitedParamComponents[0]), decodeURIComponent(splitedParamComponents[1] || '')]);
    }

    return hash_params;
  }

  static setHashbangParams(_hashbangParamArray, _window) {
    let targetWindow = _window || window;

    let hashbangString = '#!';
    let paramComponents = [];

    let param;
    for (let i = 0; i < _hashbangParamArray.length; i++) {
      param = _hashbangParamArray[i];

      paramComponents.push(`${encodeURIComponent(param[0])}=${encodeURIComponent(param[1])}`);
    }

    hashbangString += paramComponents.join('&');

    targetWindow.location.href = hashbangString;
  }

  static overwriteHashbangParams(_newHashbangParamArray, _window) {
    let hashParams = GeneralLocation.parseHashbangParams(_window);

    let paramsArray = [];

    let detectedOld = false,
      oldParam, newParam;
    for (let i = 0; i < hashParams.length; i++) {
      detectedOld = false;
      oldParam = hashParams[i];

      for (let j = 0; j < _newHashbangParamArray.length; j++) {
        newParam = _newHashbangParamArray[j];
        if (oldParam[0] === newParam[0]) {
          detectedOld = true;
          paramsArray.push(newParam);
          break;
        }
      }


      if (!detectedOld) {
        paramsArray.push(oldParam);
      }
    }


    GeneralLocation.setHashbangParams(paramsArray, _window);
  }

  static setHashbangParam(_key, _value, _window) {
    let hashParams = GeneralLocation.parseHashbangParams(_window);

    let exsists = false;
    let param;
    for (let i = 0; i < hashParams.length; i++) {
      param = hashParams[i];

      if (param[0] === _key) {
        exsists = true;
        param[1] = _value;
      }
    }

    if (!exsists) hashParams.push([_key, _value]);

    GeneralLocation.setHashbangParams(hashParams, _window);
  }

  static removeHashbangParam(_key, _window) {
    let hashParams = GeneralLocation.parseHashbangParams(_window);
    let newParams = [];

    let exsists = false;
    let param;
    for (let i = 0; i < hashParams.length; i++) {
      param = hashParams[i];

      if (param[0] !== _key) {
        newParams.push(param);
      }
    }

    GeneralLocation.setHashbangParams(newParams, _window);
  }
}

export default GeneralLocation;