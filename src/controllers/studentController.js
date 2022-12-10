const valditor=require("../validators/validator.js")
const studentModel=require("../models/studentModel.js")



const createStudent=async (req,res)=>{
    try{
        if(req.body.name==undefined){
            return res.status(400).send({status:false,message:"Please Provide name in Body"})
        }
        if(req.body.subject==undefined){
            return res.status(400).send({status:false,message:"Please Provide subject in Body"})
        }
        if(req.body.marks==undefined){
            return res.status(400).send({status:false,message:"Please Provide marks in Body"})
        }

    
        if(!valditor.isValidUserName(req.body.name)){
            return res.status(400).send({status:false,message:"Please Provide valid Name in the body, name must be of String with no Special charecters and numbers in the name."})
        }

        if(!valditor.isValidUserName(req.body.subject)){
            return res.status(400).send({status:false,message:"Please Provide valid subject in the body, name must be of String with no Special charecters and numbers in the subject."})
        }

        if(typeof req.body.marks!="number"){
            return res.status(400).send({status:false,message:"Please Provide valid marks in body, number must be of number."})
        }

        req.body.userId=req.decodedtoken.userId
        let unique=await studentModel.findOne({name:req.body.name,subject:req.body.subject,userId:req.body.userId,isDeleted:false});
        console.log(unique)

        let message="Student is successfully Added"
        if(unique){
            req.body.marks=req.body.marks+unique.marks
            message="Student marks is successfully updated"

            let savedData=await studentModel.findOneAndUpdate({name:req.body.name,subject:req.body.subject,userId:req.body.userId,isDeleted:false},{$set:{marks:req.body.marks}},{new:true})
            return res.status(200).send({status:true,message:message,data:savedData})
        }
        console.log(req.body);
        let savedData=await studentModel.create({...req.body})
        return res.status(201).send({status:true,message:message,data:savedData})

        }
        catch (error) {
            return res.status(500).send({ status: false, err: error.message });
        }
    

}

module.exports={createStudent}