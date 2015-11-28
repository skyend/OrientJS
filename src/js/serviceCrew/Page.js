import _ from 'underscore';
import Factory from './ElementNode/Factory.js';

class Page {
  constructor(_contextController, _pageDataObject) {
    this.contextController = _contextController;

    this.import(_pageDataObject);

    // runtime
    this._screenSize = {};
  }

  set title(_title) {
    this._title = _title;
  }

  set id(_id) {
    this._id = _id;
  }

  set created(_created) {
    this._created = _created;
  }

  set updated(_updated) {
    this._updated = _updated;
  }

  set rootGridElement(_rootGridElement) {
    this._rootGridElement = _rootGridElement;
  }

  set screenSize(_screenSize) {
    this._screenSize = _screenSize;
    console.log('::setScreenSize', this._screenSize);
    if (this.rootGridElement !== null) {
      this.rootGridElement.screenSize = this._screenSize;
    }
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }

  get created() {
    return this._created;
  }

  get updated() {
    return this._updated;
  }

  get rootGridElement() {
    return this._rootGridElement;
  }

  get screenSize() {
    return this._screenSize;
  }

  getNewGridId() {
    return ++this.lastGridId;
  }

  createRootGridElement() {
    this.rootGridElement = this.newGridNode('grid');
  }

  appendNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.appendChild(this.newGridNode(_behavior));
  }

  appendBeforeNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.insertBefore(this.newGridNode(_behavior));
  }

  appendAfterNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");

    targetNode.insertAfter(this.newGridNode(_behavior));
  }

  setNewGrid(_targetId, _behavior) {
    let targetNode = this.rootGridElement.findById(_targetId);
    if (targetNode === false) throw new Error("Not found targetGridNode");
    targetNode.setOneChild(this.newGridNode(_behavior));
  }

  newGridNode(_behavior) {
    let newGridNode = Factory.takeElementNode(undefined, undefined, 'grid', this);
    newGridNode.setId(this.getNewGridId());
    newGridNode.behavior = _behavior;

    // 초기 rectangle은 width, height 모두 auto로 지정한다.
    // 자식들크기를 합하여 자신의 Container최소 크기를 계산할 때 auto 는 0으로 가정하여 계산하게 된다.
    newGridNode.setRectangle({
      desktop: {
        width: 'auto',
        height: 'auto'
      },
      tablet: {
        width: 'auto',
        height: 'auto'
      },
      mobile: {
        width: 'auto',
        height: 'auto'
      }
    });

    return newGridNode;
  }

  clearElementNode(_targetId) {
    let targetNode = this.rootGridElement.findById(_targetId);
    targetNode.clearInside();
  }

  removeElementNode(_targetId) {
    let targetNode = this.rootGridElement.findById(_targetId);

    if (targetNode === this.rootGridElement) {
      this.rootGridElement = null;
    } else {
      targetNode.remove();
    }
  }

  modiftyGridElementProp(_targetId, _fieldName, _value) {
    let targetNode = this.rootGridElement.findById(_targetId);

    switch (_fieldName) {
      case "fragmentId":
        targetNode.followingFragment = _value;
        break;
    }
  }

  modifyGridRect(_targetId, _rect) {
    let targetNode = this.rootGridElement.findById(_targetId);

    targetNode.setRectanglePart(_rect.width, 'width');
    targetNode.setRectanglePart(_rect.height, 'height');
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    if (data._id === undefined || data._id === '') throw new Error("아이디를 가지지 않은 Page는 객체로 import 될 수 없습니다.");

    this.id = data._id;
    this.lastGridId = data.lastGridId || -1
    this.title = data.title || 'Untitled';
    this.created = data.created;
    this.updated = data.updated || undefined;

    this._rootGridElement = data.rootGridElement !== undefined ? Factory.takeElementNode(data.rootGridElement, undefined, undefined, this) : null;
  }

  export () {
    return {
      //_id: this.id,
      title: this.title,
      lastGridId: this.lastGridId,
      created: this.created,
      updated: this.updated,
      rootGridElement: _.clone(this._rootGridElement.export())
    };
  }
}

export default Page;