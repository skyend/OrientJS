let mongoose = require('mongoose');




let schema = mongoose.Schema({
  key: String,
  user_id: 'ObjectId',
  issue_date: Date
});

schema.MODEL_NAME = "EMAIL_CERTIFY_QUEUE";

export default schema;