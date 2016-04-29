let mongoose = require('mongoose');

export default mongoose.Schema({
  project_id: 'ObjectId',
  user_id: 'ObjectId',
  permission: {
    type: String,
    enum: ['master', 'publisher', 'guest']
  }
});