 class ObjectExtends {
   static liteExtends(_destObject, _source) {
     let okeys = Object.keys(_source);

     let propKey;
     let prop;
     for (let i = 0; i < okeys.length; i++) {
       propKey = okeys[i];
       prop = _source[propKey];


       if (typeof prop === 'object') {
         if (prop === null || prop === undefined) {
           _destObject[propKey] = prop;
         } else {
           _destObject[propKey] = ObjectExtends.clone(prop);
         }

       } else if (typeof prop === 'function') {
         _destObject[propKey] = prop;
       } else {
         _destObject[propKey] = prop;
       }
     }
   }

   static clone(_object, _deep) {
     let keys = Object.keys(_object);
     let clonedObj = {};
     let value, key;

     for (let i = 0; i < keys.length; i++) {
       key = keys[i];
       value = _object[key];
       switch (typeof value) {
         case 'function': // function 은 참조 복사
         case 'number': // 1232, 12312.1123, Infinity, NaN
         case 'string':
         case 'boolean': // true ,false
         case 'undefined': // undefined
           clonedObj[key] = value;
           break;
         case 'object':
           if (_deep) {
             if (value === null) {
               clonedObj[key] = null;
             } else {
               clonedObj[key] = ObjectExtends.clone(value, _deep);
             }
           } else {
             clonedObj[key] = value;
           }
       }
     }

     return clonedObj;
   }

   // Object 를 머지한다. 참조객체에 소스객체를 머지한다. 반환은 없다
   // override 가 true로 입력되면 키가 이미 dest 객체에 존재 하더라도 _source의 값으로 덮어쓴다.
   static mergeByRef(_dest, _source, _override, _asSuper) {
     let keys = Object.keys(_source);
     let key;

     for (let i = 0; i < keys.length; i++) {
       key = keys[i];
       if (_override) {
         _dest[key] = _source[key];
       } else if (!_dest.hasOwnProperty(key)) {
         if (_asSuper) {
           _dest['super_' + key] = _source[key];
         }

         _dest[key] = _source[key];
       }
     }
   }

   static merge(_dest, _source, _override, _asSuper) {
     let assigned = ObjectExtends.clone(_dest);

     ObjectExtends.mergeByRef(assigned, _source, _override, _asSuper);

     return assigned;
   }

   static extendClass(_subClass, _superClass) {
     return ObjectExtends.merge(_subClass, _superClass, true, true);
   }
 }



 export default ObjectExtends;