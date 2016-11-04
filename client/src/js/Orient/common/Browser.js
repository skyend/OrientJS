import browser from 'detect-browser';

var BROWSER_NAME = browser.name;
var BROWSER_VER = browser.version;

let appleWebKitVer, mobileDeviceVer, RealVersion, SafariVer, ChromeVer;

// BrowserName 과 version 을 감지 하지 못 했을 때
if( !(BROWSER_NAME && BROWSER_VER) ){

  if( window.navigator || navigator.userAgent ){
    let userAgent = navigator.userAgent;


    appleWebKitVer = userAgent.match(/AppleWebKit\/([\d\.]+)/);
    mobileDeviceVer = userAgent.match(/Mobile\/([\dA-Z]+)/);
    RealVersion = userAgent.match(/Version\/([\d\.]+)/);
    SafariVer = userAgent.match(/Safari\/([\d\.]+)/);
    ChromeVer = userAgent.match(/Chrome\/([\d\.]+)/);


    if( appleWebKitVer && mobileDeviceVer && !RealVersion  && !SafariVer && !ChromeVer ){


      // Kolonmall App at IOS8.0
      if( appleWebKitVer[1] === '600.1.4' ){

        BROWSER_NAME = 'ioswebview';
        BROWSER_VER = '600.1.4';
      }
    }
  }
}

export default {
  name : BROWSER_NAME,
  version : BROWSER_VER,
  origin : browser,
  appleWebKitVer : appleWebKitVer && appleWebKitVer[1],
  mobileDeviceVer : mobileDeviceVer && mobileDeviceVer[1],
  realVersion : RealVersion && RealVersion[1],
  safariVer : SafariVer && SafariVer[1],
  chromeVer : ChromeVer && ChromeVer[1]
}
