let mongoose = require('mongoose');

export default mongoose.Schema({
  name: String,
  access: String,
  description: String,
});