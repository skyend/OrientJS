import LZString from '../lib/lz-string.js';
var revisionCounter = 0;

class Revision {
  constructor(_elementNode, _before, _after, _type) {

    this._elementNode = _elementNode;
    this.before = _before; // setter 이용
    this.after = _after; // setter 이용
    this._type = _type;
    this._next = null;
    this._prev = null;
    this._time = new Date();
    this._counter = ++revisionCounter;
    this._isExecuted = false;
    //
    // this.e = _e; // ElementNode
    // this.after = _after; // diff
    // this.before = _before;
    // this.t = _t; // type
    //
    // this.p = null; // prev
    // this.n = null; // next
    //
    // this.f = false; // final or flushed
    //
    // this.as; // apply state [executed | undo]
  }

  // Getters
  get elementNode() {
    return this._elementNode;
  }

  get before() {
    return JSON.parse(LZString.decompress(this._before));
  }

  get after() {
    return JSON.parse(LZString.decompress(this._after));
  }

  get type() {
    return this._type;
  }

  get prev() {
    return this._prev;
  }

  get next() {
    return this._next;
  }

  get time() {
    return this._time;
  }

  get count() {
    return this._counter;
  }

  // Setters
  set elementNode(_elementNode) {
    this._elementNode = _elementNode;
  }

  set before(_beforeObject) {
    this._before = LZString.compress(JSON.stringify(_beforeObject));
  }

  set after(_afterObject) {
    this._after = LZString.compress(JSON.stringify(_afterObject));
  }

  set type(_type) {
    this._type;
  }

  set prev(_prev) {
    this._prev = _prev;
  }

  set next(_next) {
    this._next = _next;
  }

  executed() {
    this._isExecuted = true;
  }

  undo() {
    this._isExecuted = false;
  }

  get isExecuted() {
    return this._isExecuted;
  }
}


class DocumentRevisionManager {
  constructor() {
    this.rootRevision = null;
    this.lastRevision = null;
    this.cursor = null;

    this.reachRoof = true;
    this.reachFloor = true;
  }

  moveToBack() {
    this.cursor = this.prevFromPresent;
    if (this.cursor === null) {
      this.reachFloor = true;
    } else {
      this.reachFloor = false;
    }
  }

  moveToFore() {
    this.cursor = this.nextFromPresent;
    if (this.cursor === null) {
      this.reachRoof = true;
    } else {
      this.reachRoof = false;
    }
  }

  appendNewRevision(_revision) {
    var newRevision = new Revision(_revision.elementNode, _revision.before, _revision.after, _revision.type);

    if (this.cursor === null) {
      console.log('cursor null');
      this.cursor = newRevision;
      if (this.reachRoof && this.lastRevision !== null) {
        this.lastRevision.next = newRevision;
        newRevision.prev = this.lastRevision;
        this.lastRevision = newRevision;
      } else if (this.reachFloor) {
        this.rootRevision = this.cursor;
      } else {
        this.rootRevision = this.cursor;
      }
      this.reachRoof = false;
      this.reachFloor = false;
    } else {
      console.log('cursor not null');
      this.cursor.next = newRevision;
      this.cursor.next.prev = this.cursor;
      this.cursor = newRevision;

      this.reachFloor = false;
      this.reachRoof = false;
    }

    this.lastRevision = newRevision;
    newRevision.executed(); // 상태변경
  }

  //
  // // appendRevision(_revision) {
  // //   var newRevision = new Revision(_revision.e, _revision.d, _revision.t);
  // //
  // //   if (this.cursor === null) {
  // //     this.rootRevision = newRevision;
  // //     this.cursor = this.rootRevision;
  // //   } else {
  // //
  // //     this.cursor.next = newRevision;
  // //     newRevision.prev = this.cursor;
  // //     this.cursor = this.cursor.next;
  // //     this.lastRevision = newRevision;
  // //   }
  // //
  // //   console.log(this.cursor, this);
  // // }
  //
  // appendNewRevision(_revision) {
  //   var newRevision = new Revision();
  //
  //   if (this.cursor === null) {
  //     this.rootRevision = newRevision;
  //     this.cursor = this.rootRevision;
  //   } else {
  //
  //     this.cursor.next = newRevision;
  //     newRevision.prev = this.cursor;
  //
  //     this.lastRevision = newRevision;
  //     this.cursor = this.cursor.next;
  //
  //   }
  // }
  //
  // // 변경사항을 현재 리비전에 기록한다.
  // writeHistory(_changeLog) {
  //   this.cursor.changeLog = _changeLog;
  // }
  //
  // // 변경사항 기록을 종료하고 새 리비전을 준비한다.
  // flushRevision() {
  //   this.cursor.flush();
  //   this.appendNewRevision();
  // }
  //
  // /****
  //  * moveToPrev
  //  * 리비전을 후퇴시킨다.
  //  */
  // moveToPrev() {
  //   this.cursor = this.cursor.prev;
  //   // 커서가 null일 때 지붕에 도달한 이력이 있는지 확인하여
  //   // 지붕에 도달하여 null이 된경우
  //   // if (this.cursor === null) {
  //   //   if (this.reachRoof) {
  //   //     this.cursor = this.lastRevision;
  //   //   }
  //   // } else {
  //   //   if (this.cursor.prev === null) {
  //   //     this.reachFloor = true;
  //   //   } else {
  //   //     this.reachFloor = false;
  //   //   }
  //   //
  //   //   this.cursor = this.cursor.prev;
  //   // }
  // }
  //
  // moveToNext() {
  //   this.cursor = this.cursor.next;
  //   // if (this.cursor === null) {
  //   //   if (this.reachFloor) {
  //   //     this.cursor = this.rootRevision;
  //   //   }
  //   // } else {
  //   //   if (this.cursor.next === null) {
  //   //     this.reachRoof = true;
  //   //   } else {
  //   //     this.reachRoof = false;
  //   //   }
  //   //
  //   //   this.cursor = this.cursor.next;
  //   // }
  // }

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