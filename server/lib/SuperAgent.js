import path from 'path';
import fs from 'fs';
import proc from 'process';


var debug = require('debug')('SuperAgent');

import Logger from './SuperAgent/Logger.js';
import IOConfig from './SuperAgent/io/Config.js';
import DataStore from './SuperAgent/io/DataStore.js';
import MemoryStore from './SuperAgent/io/MemoryStore.js';
import FileStore from './SuperAgent/io/File.js';
import SocketStore from './SuperAgent/io/SocketStore.js';

import MailService from './SuperAgent/io/MailService/MailService.js';
import Librarian from './SuperAgent/Librarian.js';

import Errors from '../define/errors.js';
global.ERRORS = Errors;

import FatalCodes from '../define/FatalCodes.json';
global.FATAL_CODES = FatalCodes;

class SuperAgent {
  constructor(_rootDirname) {
    this.built = false;
    this.rootDirname = _rootDirname;

    // Config
    this.config = new IOConfig();

    this.businessMan = new Librarian(this);

    this.initTTYLogger();
  }

  // Synchronous Block
  warmup(_callback) {
    this.config.readConfig(path.join(this.rootDirname, 'config/profile.json'));
    this.builtCheck();
    this.initWithConfig();
    this.log.info("Server start up");
    _callback();
  }

  initWithConfig() {
    this.initLoggers();
    this.initStores();

    this.mail = new MailService(this.config.smtp);
    this.mail.connect(() => {

    });
  }

  initStores() {
    this.dataStore = new DataStore(this.config.dataStoreConfigSet);
    this.dataStore.connect(() => {

    });

    this.memStore = new MemoryStore(this.config.memoryStoreConfigSet);
    this.memStore.connect(() => {

    });

    this.fileStore = new FileStore(this);

    this.socketStore = new SocketStore(this);
  }

  initTTYLogger(){
    this.ttyLog = new Logger();
  }

  initLoggers() {
    let defaultLogDirpath = path.join(this.rootDirname, '/logs/'); // default logPath : root/logs/
    let logDirpath = defaultLogDirpath;

    if (this.config.getField('log_absolte_dirpath')) {
      logDirpath = this.config.getField('log_absolte_dirpath');
    }

    if( fs.existsSync(defaultLogDirpath) ){
      var openFd = fs.openSync(defaultLogDirpath, 'r');

      console.log(openFd)
    } else {
      this.ttyLog.error(`No exists log directory : ${defaultLogDirpath}`);

      proc.exit(1);
    }

    // console.log('FS Result', fs.existsSync(defaultLogDirpath) )
    // agent.log.error(`NOT_FOUND_CONFIG`);

    this.log = new Logger(path.join(logDirpath, '/report.log'));
    this.websockLog = new Logger(path.join(logDirpath, '/websock.log'));
    this.accessLog = new Logger(path.join(logDirpath, '/access.log'));
    this.mailLog = new Logger(path.join(logDirpath, '/mail.log'));

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
