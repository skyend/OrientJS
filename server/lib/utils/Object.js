import _ from 'underscore';

Projection = function(_object, _projectionQuery) {
  let projections = _projectionQuery.split(' ');
  let newObject = {};
  let originKeys = Object.keys(_object);

  // projection direction
  let exclude = false;

  for (let i = 0; i < originKeys.length; i++) {
    let proj = projections[i];
    if (proj) {}
  }

};

export var Projection;