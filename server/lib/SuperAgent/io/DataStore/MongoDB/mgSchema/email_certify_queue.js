let mongoose = require('mongoose');

export default mongoose.Schema({
  key: String,
  user_id: 'ObjectId',
  issue_date: Date
});