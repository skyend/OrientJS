let mongoose = require('mongoose');


// Virtual File Node

let schema = mongoose.Schema({
  dir: Boolean, // 디렉토리 인가 파일 인가
  name: String,
  owner_user_ids: [mongoose.Schema.Types.ObjectId],
  owner_group_ids: [mongoose.Schema.Types.ObjectId],
  refferenceFile: 'ObjectId', // 디렉토리가 아닌 경우 File 의 ObjectID
  refferences: [mongoose.Schema.Types.ObjectId], // 자신에게 속하는  vfnode IDs
});


schema.MODEL_NAME = "VFNODE";

export default schema;