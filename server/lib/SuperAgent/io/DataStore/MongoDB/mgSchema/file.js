let mongoose = require('mongoose');

let schema = mongoose.Schema({
  text: String,
  type: String
});


schema.MODEL_NAME = "FILE";

export default schema;