 let mongoose = require('mongoose');

 export default mongoose.Schema({
   screenname: String,
   fullname: String,
   password: String,
   email: String,
   role: String,
   superuser: Boolean
 });