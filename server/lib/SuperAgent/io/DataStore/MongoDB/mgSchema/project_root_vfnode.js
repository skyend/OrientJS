let mongoose = require('mongoose');

export default mongoose.Schema({
  project_id: 'ObjectId',
  root_vfnode_id: 'ObjectId'
});