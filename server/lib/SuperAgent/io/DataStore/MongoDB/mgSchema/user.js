 let mongoose = require('mongoose');

 export default mongoose.Schema({
   screenname: String,
   name: String,
   password: String,
   email: String,
   role: String
 });