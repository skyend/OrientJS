import ScopeMember from './ScopeMember';
import MetaText from '../../Data/MetaText';
import _ from 'underscore';

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

class ValueScopeMember extends ScopeMember {
  constructor(_scopeData) {
    super(_scopeData);
    this.type = 'value';
  }

  get value() {
    return this._value;
  }

  // 본 모습 : 자신의 데이터타입에 맞춰 데이터를 반환한다.
  get shapeValue() {
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
  }

  get plainValue() {
    return this.value.variable;
  }

  get dataType() {
    return this._dataType;
  }


  // 외부에서는 value setter 를 사용하지 않아야 한다.
  // value Member는 MetaText 객체이다.
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
    let newScopeMember = new ValueScopeMember(ValueScopeMember.BuildScopeSpecObjectByScopeDom(_scopeDom));
    console.log(newScopeMember);
    return newScopeMember;
  }

  static BuildScopeSpecObjectByScopeDom(_dom) {
    let scopeSpecObject = super.BuildScopeSpecObjectByScopeDom(_dom);

    // 확장클래스에서 사용하는 attribute 읽기 및 지정

    // type attribute 는 dataType 으로 지정된다.
    scopeSpecObject.dataType = DataTypes[_dom.getAttribute('type')];
    scopeSpecObject.value = _dom.getAttribute('value') || _dom.innerHTML || '';

    return scopeSpecObject;
  }

  import (_scopeData) {
    super.import(_scopeData);
    this.dataType = _scopeData.dataType;
    this.value = new MetaText(_scopeData.value || '');
  }

  export () {
    let exportObject = super.export();
    exportObject.dataType = this.dataType;
    exportObject.value = _.clone(this.value.export());

    return exportObject;
  }
}

export default ValueScopeMember;