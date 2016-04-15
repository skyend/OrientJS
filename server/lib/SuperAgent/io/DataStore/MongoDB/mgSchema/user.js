 let mongoose = require('mongoose');

 export default mongoose.Schema({
   screenname: String,
   fullname: String,
   password: String,
   email: String,
   role: String,
   superuser: Boolean,
   certified: Boolean, // 이메일 인증 완료
   active: Boolean // 이메일 인증 완료 후 계정을 사용할 수 있는 상태일 때 true 이다. / 관리자의 승인을 거쳐야 하는 경우 이메일인증을 완료 해도 active는 false이다.
 });