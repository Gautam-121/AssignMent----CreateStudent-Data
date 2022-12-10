const mongoose=require('mongoose')

const studentSchema=new mongoose.Schema({ 
    name: {type:String, required:true},
    marks:{type:Number,required:true},
    subject:{ type:String,  required:true },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user10",require:true},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true})
  
  module.exports= mongoose.model("student10",studentSchema)