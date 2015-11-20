import _ from 'underscore';

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

  set rootGrid(_rootGrid) {
    return this._rootGrid = _rootGrid;
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

  get rootGrid() {
    return this._rootGrid;
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    if (data._id === undefined || data._id === '') throw new Error("아이디를 가지지 않은 Page는 객체로 import 될 수 없습니다.");

    this.id = data._id;
    this.title = data.title || 'Untitled';
    this.created = data.created;
    this.updated = data.updated || undefined;

    this.rootGrid = data.rootGrid;
  }

  export () {
    return {
      //_id: this.id,
      title: this.title,
      created: this.created,
      updated: this.updated,
      rootGrid: _.clone(this.rootGrid)
    };
  }
}

export default Page;