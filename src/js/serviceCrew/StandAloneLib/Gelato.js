import async from 'async';
import request from 'superagent';
import Sizzle from 'Sizzle';

import Page from './Page';
import GelatoDocument from './GelatoDocument';
import Cookie from './Cookie';

let instance = null;

class Gelato {
  static one() {
    return instance;
  }

  constructor() {
    (() => {
      if (instance !== null) throw new Error("Gelato is aleady running. Call Gelato.one() if you need to the gelato instance.");
      instance = this;
    })()

    // Gelato가 제공하는 DOM 선택자
    this.$ = Sizzle;

    // GelatoDocument 조작 객체
    this.GD = new GelatoDocument(document);
    // cookie 제어 객체
    this.cookie = new Cookie();
    // page 객체가 생성될 때 Page의 사양을 파악한다.
    this.page = new Page(document);
  }

  // 서비스를 시작함
  // 1. Grid에서 프래그먼트를 필요로 하는 요소 찾기
  startup() {

    async.waterfall([
      (_cb) => { // fragment attach
        let fragmentFollowingGrids = this.page.analysisFragmentFollowing();

        // gridElement 에 Fragment 를 채운다.
        this.page.fillAllFragmentOfGridElement(fragmentFollowingGrids, () => {
          console.log("Attached All Fragments");
          _cb();
        });
      }, (_cb) => { // ref element filling
        this.page.renderRefElementsOfFragments(() => {
          _cb();
        });
      }, (_cb) => {
        // 바인딩
        this.page.runAllDynamicContext(() => {
          _cb()
        });
      }, (_cb) => {
        this.page.appendPageScripts(() => {

        });
      }
    ]);

  }


  // loadConfig(_config) {
  //   request.get('./config/config.json')
  //     .end(function(_result) {
  //       console.log(_result);
  //     });
  // }
}

export default Gelato;