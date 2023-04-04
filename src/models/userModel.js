const mongoose = require('mongoose')
const userSchema= new mongoose.Schema(
    {
    name: {type:String, required:true, trim:true},
    email: {type:String,required:true, trim:true,unique:true,lowercase:true},
    mobile: { type:Number, required:true,trim:true},
    password:  {type:String,unique:true,required:true}, 
    isDeleted: {
        type: Boolean,
        default: false
      },
},{timestamps:true}
)
module.exports = mongoose.model('User',userSchema)