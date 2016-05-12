import mongoose from 'mongoose';
import FileSchema from './file';

// Virtual File Node
let MODEL_NAME = "VFNODE";
let schema = mongoose.Schema({
  dir: Boolean, // 디렉토리 인가 파일 인가
  name: String,
  owner_user_ids: [mongoose.Schema.Types.ObjectId],
  owner_group_ids: [mongoose.Schema.Types.ObjectId],
  refferenceFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: FileSchema.MODEL_NAME
  }, // 디렉토리가 아닌 경우 File 의 ObjectID
  refferences: [{
    type: mongoose.Schema.Types.ObjectId, // sub
    ref: MODEL_NAME
  }]
});

schema.MODEL_NAME = MODEL_NAME;

export default schema;