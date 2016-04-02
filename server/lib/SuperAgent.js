import path from 'path';
var debug = require('debug')('SuperAgent');

import Logger from './SuperAgent/Logger.js';
import IOConfig from './SuperAgent/io/Config.js';
import DataStore from './SuperAgent/io/DataStore.js';
import MemoryStore from './SuperAgent/io/MemoryStore.js';
import Librarian from './SuperAgent/Librarian.js';

import Errors from '../define/errors.json';
global.ERROR_CODES = Errors;

import FatalCodes from '../define/FatalCodes.json';
global.FATAL_CODES = FatalCodes;


class SuperAgent {
  constructor(_rootDirname) {
    this.built = false;
    this.rootDirname = _rootDirname;

    // Config
    this.config = new IOConfig();

    this.businessMan = new Librarian(this);

    this.initLoggers();
  }

  // Synchronous Block
  warmup(_callback) {
    this.config.readConfig(path.join(this.rootDirname, 'config/profile.json'));
    this.builtCheck();
    this.initWithConfig();
    _callback();
  }

  initWithConfig() {
    this.initLoggers();
    this.initStores();
  }

  initStores() {
    this.dataStore = new DataStore(this.config.dataStoreConfigSet);
    this.dataStore.connect(function() {

    });
    this.memStore = new MemoryStore(this.config.memoryStoreConfigSet);
  }

  initLoggers() {
    let defaultLogDirpath = path.join(this.rootDirname, '/logs/'); // default logPath : root/logs/
    let logDirpath = defaultLogDirpath;

    if (this.config.getField('log_absolte_dirpath')) {
      logDirpath = this.config.getField('log_absolte_dirpath');
    }

    this.log = new Logger(path.join(logDirpath, '/report.log'));
    this.accessLog = new Logger(path.join(logDirpath, '/access.log'));

    // // Loggers
    // this.fatalLogger = new Logger(path.join(logDirpath, '/fatal.log'), 'crit');
    // this.errorLogger = new Logger(path.join(logDirpath, '/errors.log'), 'error');
    // this.warnLogger = new Logger(path.join(logDirpath, '/warn.log'), 'warning');
    // this.accessLogger = new Logger(path.join(logDirpath, '/access.log'), 'info');
    // this.normalLogger = new Logger(path.join(logDirpath, '/normal.log'), 'info');
    // this.devLogger = new Logger(path.join(logDirpath, '/dev.log'), 'debug');
  }

  builtCheck() {
    // 임시. 인스톨러 구현 후에 처리
    this.built = true;
  }

  get isBuilt() {
    return this.built;
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