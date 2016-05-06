let mongoose = require('mongoose');

let schema = mongoose.Schema({
  name: String,
  access: String,
  description: String,
});


schema.MODEL_NAME = "PROJECT";

export default schema;