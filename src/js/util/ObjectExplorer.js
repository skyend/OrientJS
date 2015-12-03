/**
 * getValueByKeyPath
 * @param _object
 * @param _keyPath
 * @returns {*}
 */
function getValueByKeyPath(_object, _keyPath) {

  var splitPath = _keyPath.split('/');

  var currValue = _object;

  for (var i = 0; i < splitPath.length; i++) {
    if (currValue === undefined || currValue === null) return undefined;
    currValue = currValue[splitPath[i]];
  }

  return currValue;
}

/**
 * String Replacement 문자열을 사전오브젝트를 이용하여 치환한다.
 * @param _string 문자열 내에 "{{key/path/key'}}"와 같은 문자를 찾으면 dicObject 에서 찾아 교체한다. object 트리를 타서 접근 해야 할 경우 / 로 경로를 지정한다.
 * key 는 알파벳, 숫자, 하이픈(-), 언더스코어(_), 공백문자로(" ") 이루어 질 수 있다.
 * @param _dicObject
 * @param _replacePointBracketString 문자열내에 교체할 지점을 찾을 때 기준이 되는 인수 기본적으로 "{{/}}" 을 사용한다
 */
function stringReplacement(_string, _dicObject, _replacePointBracketString) {
  var replacePointBracketString = _replacePointBracketString || "{{/}}";
  var replacePointBrackets = replacePointBracketString.split('/');
  var replacePointForeBracket = replacePointBrackets[0];
  var replacePointBackBracket = replacePointBrackets[1];

  var pointFindRegExp = new RegExp("" + replacePointForeBracket + "([\\w\\d-_\/\s]+)" + replacePointBackBracket + "");

  // string 이 단 하나의 치환포인트만을 가질 경우 sring 형식으로 삽입 하지 않고 그 데이터를 그대로 반환한다.
  var onlyOnePointFindRegExp = new RegExp("^" + replacePointForeBracket + "([\\w\\d-_\/\s]+)" + replacePointBackBracket + "$");
  var oneReturn = false;
  if (onlyOnePointFindRegExp.test(_string)) {
    oneReturn = true;
  }

  var resultString = _string;

  var matched = resultString.match(pointFindRegExp);
  while (matched !== null) {
    var replaceKey = matched[1];
    console.log('####', _string, _dicObject, _replacePointBracketString);
    // replace
    var replaceValue = getValueByKeyPath(_dicObject, replaceKey);
    resultString = resultString.replace(replacePointForeBracket + replaceKey + replacePointBackBracket, replaceValue);

    // 단하나의 교체대상만을 가질 경우 교체할 데이터를 그대로 반환한다.
    if (oneReturn) {
      return replaceValue;
    }

    matched = resultString.match(pointFindRegExp);
  }

  return resultString;
}

module.exports = {
  stringReplacement: stringReplacement,
  getValueByKeyPath: getValueByKeyPath
};