import _ from 'underscore';


class ObjectExtends {
  static liteExtends(_destObject, _source){
    let okeys = Object.keys(_source);

    let propKey;
    let prop;
    for( let i = 0; i < okeys.length; i++ ){
      propKey = okeys[i];
      prop =_source[propKey];


      if( typeof prop === 'object' ){
        if( prop === null || prop === undefined ){
          _destObject[propKey] = prop ;
        } else {
          _destObject[propKey] = _.clone(prop);
        }

      } else if( typeof prop === 'function' ){
        _destObject[propKey] = prop;
      } else {
        _destObject[propKey] = prop;
      }
    }
  }
}


export default ObjectExtends;
