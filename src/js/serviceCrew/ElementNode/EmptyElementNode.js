import TagBaseElementNode from './TagBaseElementNode.js';
import _ from 'underscore';

class EmptyElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'empty';

    this.refferenceType; // react | document | ...
    this.refferenceTarget; // reactComponent{ _componentKey, _packageKey }
    this.refferenceTargetProps; // {...}


    /* Empty Type */
    this.refferenceInstance = null;
  }

  // refferenceType
  getRefferenceType() {
    return this.refferenceType;
  }

  // refferenceTarget
  getRefferenceTarget() {
    return this.refferenceTarget;
  }

  // refferenceTargetProps
  getRefferenceTargetProps() {
    return this.refferenceTargetProps;
  }

  // refferenceInstance
  getRefferenceInstance() {
    return this.refferenceInstance;
  }

  // getRefferencingElementNode //Empty Type elnode 의 참조중인 elNode를 가져옴
  getRefferencingElementNode() {
    var refElNode = this.environment.getElementNodeFromPool(this.getRefferenceTarget());
    return refElNode;
  }

  // refferenceType
  setRefferenceType(_refferenceType) {
    this.refferenceType = _refferenceType;
  }

  // refferenceTarget
  setRefferenceTarget(_refferenceTarget) {
    this.refferenceTarget = _refferenceTarget;
  }

  // refferenceTargetProps
  setRefferenceTargetProps(_refferenceTargetProps) {
    this.refferenceTargetProps = _refferenceTargetProps;
  }

  // refferenceInstance
  setRefferenceInstance(_refferenceInstance) {
    this.refferenceInstance = _refferenceInstance;

    if (this.refferenceInstance !== 'none' && this.refferenceInstance !== undefined) {
      this.refferenceInstance.setParent(this);
    }
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);

    this.realizeEmpty(_realizeOptions);
  }

  realizeEmpty(_realizeOptions) {
    console.log(this.getRefferenceTarget());
    let refferenceElementNode = this.environment.findById(this.getRefferenceTarget());
    console.log(refferenceElementNode);

    if (refferenceElementNode != false)
      refferenceElementNode.realize(_realizeOptions);
  }

  linkHierarchyRealizaion() {
    let refferenceElementNode = this.environment.findById(this.getRefferenceTarget());
    if (refferenceElementNode != false)
      this.realization.appendChild(refferenceElementNode.getRealization());
  }

  // clear refferenceInstance
  clearRefferenceInstance() {
    if (this.refferenceInstance !== null) this.refferenceInstance.unlinkParent();
    else console.warn("참조중인 인스턴스가 없습니다.");
  }

  buildByComponent(_component) {
    super.buildByComponent(_component);
    this.buildEmptyTypeElement();
  }

  /******************
   * buildEmptyTypeElement
   */
  buildEmptyTypeElement(_domElement) {

    this.setType('empty');
    this.setAttributes({
      'tagName': 'div',
      'style': "width:100px;height:100px;border:1px solid #fff"
    });

    this.setRefferenceType('none');
    this.setRefferenceTarget('none');
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    this.refferenceType = _elementNodeDataObject.refferenceType;
    this.refferenceTarget = _elementNodeDataObject.refferenceTarget;
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);

    result.refferenceType = this.getRefferenceType();
    result.refferenceTarget = this.getRefferenceTarget();
    result.refferenceTargetProps = this.getRefferenceTargetProps();

    return result;
  }
}

export default EmptyElementNode;