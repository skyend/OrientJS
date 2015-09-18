class Revision {
  constructor(_e, _d, _t) {

    this.e = _e; // ElementNode
    this.d = _d; // diff
    this.t = _t; // type

    this.p = null; // prev
    this.n = null; // next
  }

  set prev(_p) {
    this.p = _p;
  }

  set next(_n) {
    this.n = _n;
  }

}


class DocumentRevisionManager {
  constructor() {
    console.log('created');
    this.rootRevision = null;
    this.cursor = null;
  }

  appendRevision(_revision) {
    var newRevision = new Revision(_revision.e, _revision.d, _revision.t);

    if (this.rootRevision === null) {
      this.rootRevision = newRevision;
      this.cursor = this.rootRevision;
    } else {
      this.cursor.next = newRevision;
    }

    console.log(this.rootRevision);
  }

  moveToPrev() {
    if (this.cursor.prev !== null) {
      this.cursor = this.cursor.prev;
      return true;
    } else {
      return false;
    }
  }

  moveToNext() {
    if (this.cursor.next !== null) {
      this.cursor = this.cursor.next;
      return true;
    } else {
      return false;
    }
  }

  get present() {
    return this.cursor;
  }

  get prevFromPresent() {
    return this.cursor.prev || null;
  }

  get nextFromPresent() {
    return this.cursor.next || null;
  }
}

export default DocumentRevisionManager;