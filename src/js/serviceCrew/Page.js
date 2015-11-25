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
    let gridElementNode = Factory.takeElementNode(undefined, undefined, 'grid', this);
    gridElementNode.behavior = 'grid';
    gridElementNode.setId(this.getNewGridId());

    this.rootGridElement = gridElementNode;
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

  newGridNode(_behavior) {
    let newGridNode = Factory.takeElementNode(undefined, undefined, 'grid', this);
    newGridNode.setId(this.getNewGridId());
    newGridNode.behavior = _behavior;
    return newGridNode;
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