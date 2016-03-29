import path from 'path';
var debug = require('debug')('SuperAgent');

import Logger from './SuperAgent/Logger.js';
import IOConfig from './SuperAgent/io/Config.js';

import Errors from '../define/errors.json';
global.ERROR_CODES = Errors;

import FatalCodes from '../define/FatalCodes.json';
global.FATAL_CODES = FatalCodes;


class SuperAgent {
  constructor(_rootDirname) {
    this.rootDirname = _rootDirname;

    // Config
    this.config = new IOConfig();

    this.initLoggers();
  }

  initLoggers() {
    let logDirpath = path.join(this.rootDirname, '/logs/'); // default logPath : root/logs/
    if (this.config.getField('log_absolte_dirpath')) {
      logDirpath = this.config.getField('log_absolte_dirpath');
    }

    this.log = new Logger(path.join(logDirpath, '/report.log'));
    // // Loggers
    // this.fatalLogger = new Logger(path.join(logDirpath, '/fatal.log'), 'crit');
    // this.errorLogger = new Logger(path.join(logDirpath, '/errors.log'), 'error');
    // this.warnLogger = new Logger(path.join(logDirpath, '/warn.log'), 'warning');
    // this.accessLogger = new Logger(path.join(logDirpath, '/access.log'), 'info');
    // this.normalLogger = new Logger(path.join(logDirpath, '/normal.log'), 'info');
    // this.devLogger = new Logger(path.join(logDirpath, '/dev.log'), 'debug');
  }

  warmup(_callback) {
    this.config.readConfig(path.join(this.rootDirname, 'config/profile.json'), () => {
      this.init();
    });
  }

  init() {
    this.initLoggers();
  }

  get isBuilt() {

  }

  get rootDirname() {
    return this._rootDirname;
  }

  set rootDirname(_rootDirname) {
    this._rootDirname = _rootDirname;
  }

  // fatalLog(_fatalCode, _message) {
  //   if (FATAL_CODES[_fatalCode])
  //     this.fatalLogger.crit(`[${_fatalCode}] ${_message || '' }`);
  //   else {
  //     throw new Error(`Not found fatalCode[${_fatalCode}].`);
  //   }
  // }
  //
  // errLog(_errorCode, _message) {
  //   if (ERROR_CODES[_errorCode])
  //     this.errorLogger.error(`[${_errorCode}] ${_message || '' }`);
  //   else {
  //     throw new Error(`Not found errorCode[${_errorCode}].`);
  //   }
  // }
  //
  // warnLog(_message) {
  //   this.warnLogger.warning(_message);
  // }
  //
  // accessLog(_ip, _url, _method) {
  //   this.accessLogger.info(`${_ip} : ${_url} [${_method}]`);
  // }
  //
  // log(_message) {
  //   this.normalLogger.info(_message);
  // }
  //
  // devLog(_message) {
  //   this.devLogger.debug(_message);
  // }
}

export default SuperAgent;