let mongoose = require('mongoose');

export default mongoose.Schema({
  project_id: 'ObjectId',
  user_id: 'ObjectId',
  permission: String // master, publisher, guest
});