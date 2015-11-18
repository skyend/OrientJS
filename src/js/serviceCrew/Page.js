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

  set updated(_updated) {
    this._updated = _updated;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }

  get updated() {
    return this._updated;
  }

  import (_pageDataObject) {
    let data = _pageDataObject || {};

    if (data._id === undefined || data._id === '') throw new Error("아이디를 가지지 않은 Page는 객체로 import 될 수 없습니다.");

    this.id = data._id;
    this.title = data.title || 'Untitled';
    this.updated = data.updated || undefined;
  }

  export () {
    return {
      //_id: this.id,
      title: this.title,
      updated: this.updated
    };
  }
}

export default Page;