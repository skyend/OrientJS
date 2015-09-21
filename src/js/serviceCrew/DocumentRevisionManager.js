class Revision {
  constructor(_e, _d, _t) {

    this.e = _e; // ElementNode
    this.d = _d; // diff
    this.t = _t; // type

    this.p = null; // prev
    this.n = null; // next
  }

  get prev() {
    return this.p;
  }

  get next() {
    return this.n;
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
      this.cursor = this.cursor.next;
    }
  }

  moveToPrev() {
    if (this.cursor === null) return false;

    if (this.cursor.prev === null) {
      return false;
      // this.cursor = null;
      // this.rootRevision = null;
    } else {
      this.cursor = this.cursor.prev;
    }

    return true;
  }

  moveToNext() {
    if (this.cursor === null) return false;
    if (this.cursor.next === null) {
      return false;
    } else {
      this.cursor = this.cursor.next;
      return true;
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