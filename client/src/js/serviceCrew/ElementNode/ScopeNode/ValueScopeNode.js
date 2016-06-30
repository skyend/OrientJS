import ScopeNode from './ScopeNode';
import MetaText from '../../Data/MetaText';
import MetaData from '../../Data/MetaData';
import ObjectExtends from '../../../util/ObjectExtends';
import GeneralLocation from '../../../util/GeneralLocation';
import BrowserStorage from '../../../util/BrowserStorage';

const DataTypes = Object.freeze({
  Number: "number",
  String: "string",
  Object: "object",
  Array: "array",
  Boolean: "boolean",
  Function: "function",

  number: "number",
  string: "string",
  object: "object",
  array: "array",
  boolean: "boolean",
  function: "function"
});

class ValueScopeNode extends ScopeNode {
  constructor(_scopeData) {
    super(_scopeData);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      ScopeNode.call(this, _scopeData);
    }

    this.type = 'value';
    this.scannedHashbang = false;
    this.scannedSession = false;

    if (this.mappingHashbangParam) {
      let hashbangValue;

      hashbangValue = GeneralLocation.getHashbangParam(this.mappingHashbangParam === true ? this.name : this.mappingHashbangParam);
      if (hashbangValue !== null)
        this.plainValue = hashbangValue;

      this.scannedHashbang = true;
    }

    if (this.mappingSession) {
      let sessionValue;

      sessionValue = BrowserStorage.getSession(this.mappingSession === true ? this.name : this.mappingSession);

      if (sessionValue !== null)
        this.shapeValue = sessionValue;

      this.scannedSession = true;
    }

  }

  get resolveOn() {
    return this._resolveOn;
  }

  get value() {
    return this._value;
  }

  // 본 모습 : 자신의 데이터타입에 맞춰 데이터를 반환한다.
  get shapeValue() {
    // return this.value.variable;

    try {
      switch (this.dataType) {
        case DataTypes.String:
          return this.value.byString;
        case DataTypes.Number:
          return this.value.byNumber;
        case DataTypes.Boolean:
          return this.value.byBoolean;
        case DataTypes.Array:
        case DataTypes.Object:
          return this.value.byObject;
      }
    } catch (_e) {
      throw _e;
    }
  }

  get plainValue() {
    return this.value.variable;
  }

  get dataType() {
    return this._dataType;
  }

  set resolveOn(_onRes) {
    this._resolveOn = _onRes;
  }

  // 외부에서는 value setter 를 사용하지 않아야 한다.
  // value Node는 MetaText 객체이다.
  set value(_value) {
    this._value = _value;
  }

  set plainValue(_value) {
    this.value.variable = _value;
  }

  set dataType(_dataType) {
    this._dataType = _dataType;
  }

  // 입력된 데이터를 데이터 타입에 따라 분별하여 자신에게 저장한다.
  set shapeValue(_shape) {
    // this.value.variable = _shape;


    if (this.mappingHashbangParam) {

      GeneralLocation.setHashbangParam(this.mappingHashbangParam === true ? this.name : this.mappingHashbangParam, _shape);
    }

    if (this.mappingSession) {

      BrowserStorage.setSession(this.mappingSession === true ? this.name : this.mappingSession, _shape);
    }

    switch (this.dataType) {
      case DataTypes.String:
        this.value.fromString = _shape;
        break;
      case DataTypes.Number:
        this.value.fromNumber = _shape;
        break;
      case DataTypes.Boolean:
        this.value.fromBoolean = _shape;
        break;
      case DataTypes.Array:
      case DataTypes.Object:
        this.value.fromObject = _shape;
        break;
      default:
        throw new Error("invalid value type :" + this.dataType);
    }
  }

  /**
  Task Implement
  **/
  static CreateByScopeDom(_scopeDom) {

    let newScopeNode = new ValueScopeNode(ValueScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));

    return newScopeNode;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {

    let scopeSpecObject = ScopeNode.BuildScopeSpecObjectByScopeDom(_dom);

    // 확장클래스에서 사용하는 attribute 읽기 및 지정

    // type attribute 는 dataType 으로 지정된다.
    scopeSpecObject.dataType = DataTypes[_dom.getAttribute('type')];
    scopeSpecObject.value = _dom.getAttribute('value') || _dom.innerHTML || '';
    scopeSpecObject.resolveOn = _dom.getAttribute('resolve-on') !== null ? true : false;
    scopeSpecObject.initializer = _dom.getAttribute('initializer') !== null ? _dom.getAttribute('initializer') : null;
    if (_dom.hasAttribute('mapping-hashbang-param'))
      scopeSpecObject.mappingHashbangParam = _dom.getAttribute('mapping-hashbang-param') || true;

    if (_dom.hasAttribute('mapping-session'))
      scopeSpecObject.mappingSession = _dom.getAttribute('mapping-session') || true;
    return scopeSpecObject;
  }

  import (_scopeData) {
    super.import(_scopeData);
    this.resolveOn = _scopeData.resolveOn;
    this.dataType = _scopeData.dataType;
    this.value = new MetaText(_scopeData.value || '');
    this.initializer = _scopeData.initializer;
    this.mappingHashbangParam = _scopeData.mappingHashbangParam;
    this.mappingSession = _scopeData.mappingSession;

  }

  export () {
    let exportObject = super.export();
    exportObject.resolveOn = this.resolveOn;
    exportObject.dataType = this.dataType;
    exportObject.value = ObjectExtends.clone(this.value.export());
    exportObject.initializer = this.initializer;
    exportObject.mappingHashbangParam = this.mappingHashbangParam;
    exportObject.mappingSession = this.mappingSession;
    return exportObject;
  }
}

export default ValueScopeNode;