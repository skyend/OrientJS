let mongoose = require('mongoose');

let schema = mongoose.Schema({
  user_id: 'ObjectId', // 작업 유발자

  workerClass: String, // 작업자

  log_lines: Array, // 작업 로그 스트링 배열

  name: String, // 작업 명
  desc: String, // 작업 내용

  step_code: String, // 작업 단계 코드 Worker

  relations: Array, // 작업에 관련한 콜렉션 명과 콜렉션 내의 연관 Document ID

  workParams: Object,

  beginning_time: Date, // 작업 시작 타임스탬프
  finished_time: Date // 작업 완료 타임스탬프 , 작업중에는 null.
});


schema.MODEL_NAME = "WORK";

export default schema;