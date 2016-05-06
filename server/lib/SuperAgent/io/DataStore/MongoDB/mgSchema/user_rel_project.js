let mongoose = require('mongoose');

let schema = mongoose.Schema({
  project_id: 'ObjectId',
  user_id: 'ObjectId',
  permission: {
    type: String,
    enum: ['master', 'publisher', 'guest']
  }
});


schema.MODEL_NAME = "USER_REL_PROJECT";

export default schema;