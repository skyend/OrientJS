let mongoose = require('mongoose');

let schema = mongoose.Schema({
  description: Buffer,
  type: String
});


schema.MODEL_NAME = "FILE";

export default schema;