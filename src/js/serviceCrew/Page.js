import _ from 'underscore';
import Factory from './ElementNode/Factory.js';

class Page {
  constructor(_contextController, _pageDataObject) {
    this.contextController = _contextController;

    this.import(_pageDataObject);
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
    return this._rootGridElement = _rootGridElement;
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


  createRootGridElement() {
    let gridElementNode = Factory.takeElementNode(undefined, undefined, 'grid');
    console.log(gridElementNode);
    this.rootGridElement = gridElementNode;
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    if (data._id === undefined || data._id === '') throw new Error("아이디를 가지지 않은 Page는 객체로 import 될 수 없습니다.");

    this.id = data._id;
    this.title = data.title || 'Untitled';
    this.created = data.created;
    this.updated = data.updated || undefined;

    this._rootGridElement = data.rootGridElement;
  }

  export () {
    return {
      //_id: this.id,
      title: this.title,
      created: this.created,
      updated: this.updated,
      rootGridElement: _.clone(this._rootGridElement.export())
    };
  }
}

export default Page;