let mongoose = require('mongoose');

export default mongoose.Schema({
  dir: Boolean, // 디렉토리 인가 파일 인가
  name: String,
  refferenceFile: 'ObjectId', // 디렉토리가 아닌 경우 File 의 ObjectID
  refferences: Array, // 자신에게 속하는 파일 vfnode ID
});