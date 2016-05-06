 let mongoose = require('mongoose');

 let schema = mongoose.Schema({
   screenname: String,
   fullname: String,
   password: String,
   email: String,

   role: String,

   superuser: Boolean,

   certified: Boolean, // 이메일 인증 완료
   active: Boolean, // 유저로그인이 불가능 할 때 active 필드는 false 로 변경된다.
   deleted: Boolean // 유저가 삭제되면 deleted를 true 를 변경하여 삭제된것 처럼 처리한다.
 });


 schema.MODEL_NAME = "USER";

 export default schema;