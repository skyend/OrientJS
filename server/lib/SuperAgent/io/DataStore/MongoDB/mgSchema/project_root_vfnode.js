let mongoose = require('mongoose');

let schema = mongoose.Schema({
  project_id: 'ObjectId',
  vfnode_id: 'ObjectId'
});


schema.MODEL_NAME = "PROJECT_ROOT_VFNODE";

export default schema;