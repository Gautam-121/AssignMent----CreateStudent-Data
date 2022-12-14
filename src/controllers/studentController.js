const valditor=require("../validators/validator.js")
const studentModel=require("../models/studentModel.js")
const mongoose=require("mongoose")



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
            return res.status(400).send({status:false,message:"Please Provide valid marks in body, marks must be of number."})
        }

        req.body.userId=req.decodedtoken.userId
        let savedData=await studentModel.findOneAndUpdate({name:req.body.name,subject:req.body.subject,userId:req.body.userId,isDeleted:false},{$inc:{marks:req.body.marks}},{new:true,upsert:true})

        return res.status(201).send({status:true,data:savedData})

        }
        catch (error) {
            return res.status(500).send({ status: false, err: error.message });
        } 
}

const getStudentById=async (req,res)=>{
    try{
        // console.log(req.params.studentId)
        if(!req.params.studentId){
            return res.status(400).send({status:false,message:"Please Provide studentId in path params"})
        }
        if(!mongoose.Types.ObjectId.isValid(req.params.studentId)){
            return res.status(400).send({status:false,message:"given studentId is not a valid ObjectId, please provide valid objectId in params."})
        }
        let savedData=await studentModel.findOne({_id:req.params.studentId,userId:req.decodedtoken.userId,isDeleted:false}).select({name:1,subject:1,marks:1})
        if(!savedData){
            return res.status(404).send({status:false,message:"No student found with this studentId by your userId"})
        }
        return res.status(200).send({status:true,message:"Student sucessfully found.",data:savedData})
    }
    catch(error){
        return res.status(500).send({ status: false, err: error.message });
    }
}

const getStudentByFilter=async (req,res)=>{
    try{
        let filter={}
        if(req.query.name){
            if(!valditor.isValidUserName(req.query.name)){
                return res.status(400).send({status:false,message:"Please Provide valid Name in the query, name must be of String with no Special charecters and numbers in the name."})
            }
            filter["name"]={ $regex: req.query.name, $options: 'i' }
        }
        if(req.query.subject){
            if(!valditor.isValidUserName(req.query.subject)){
                return res.status(400).send({status:false,message:"Please Provide valid subject in the query, subject must be of String with no Special charecters and numbers in the subject."})
            }
            filter["subject"]={ $regex: req.query.subject, $options: 'i' }
        }
// console.log(filter)
        filter.userId=req.decodedtoken.userId
        filter.isDeleted=false

        let savedData=await studentModel.find(filter).select({name:1,marks:1,subject:1,userId:1})
        return res.status(200).send({status:false,data:savedData})
    }
    catch(error){
        return res.status(500).send({ status: false, err: error.message });
    }
}

const editStudent=async (req,res)=>{
    try{
        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false,message:"Please give any valid field to update from [name,subject,marks]."})
        }

        let arr=["name","subject","marks"]
        for(let key in req.body){
            if(!arr.includes(key)){
                return res.status(400).send({status:false,message:`${key} is not a valid field to update , please give valid field to update from ["name","subject","marks"].`})
            }
        }

        if(!req.params.studentId){
            return res.status(400).send({status:false,message:"Please Provide studentId in path params"})
        }
        if(!mongoose.Types.ObjectId.isValid(req.params.studentId)){
            return res.status(400).send({status:false,message:"given studentId is not a valid ObjectId, please provide valid objectId in params."})
        }
        let student=await studentModel.findOne({_id:req.params.studentId,userId:req.decodedtoken.userId,isDeleted:false})

        if(!student){
            return res.status(404).send({ status: false, message:"No student found with this studentId with this current user." });
        }

        let check={userId:req.decodedtoken.userId,isDeleted:false}
        let update={}
        if(req.body.name){
            if(!valditor.isValidUserName(req.body.name)){
                return res.status(400).send({status:false,message:"Please Provide valid Name in the body, name must be of String with no Special charecters and numbers in the name."})
            }
            update["name"]=req.body.name
            check["name"]=req.body.name
        }else{
            check["name"]=student.name
        }
        if(req.body.subject){
            if(!valditor.isValidUserName(req.body.subject)){
                return res.status(400).send({status:false,message:"Please Provide valid subject in the body, subject must be of String with no Special charecters and numbers in the subject."})
            }
            update["subject"]=req.body.subject
            check["subject"]=req.body.subject
        }else{
            check["subject"]=student.subject
        }
        if(req.body.marks){
            if(typeof req.body.marks!="number"){
                return res.status(400).send({status:false,message:"Please Provide valid marks in body, marks must be of number."})
            }
            update["marks"]=req.body.marks
        }

        console.log(update)
        console.log(check)
        if(update.hasOwnProperty("subject")||update.hasOwnProperty("name")){
            // console.log("I am in")
            let doublicate=await studentModel.findOne(check)
            // console.log(doublicate)
            if(doublicate){
                return res.status(400).send({status:false,message:"The combination of name and subject that you have given to update already exist."})
            }
        }

        let savedData=await studentModel.findOneAndUpdate({_id:req.params.studentId,userId:req.decodedtoken.userId,isDeleted:false},update,{new:true})
        return res.status(200).send({status:false,message:"Student Successfully Updated",data:savedData})
    }
    catch(error){
        return res.status(500).send({ status: false, err: error.message });
    }
}

const deleteStudentById= async (req,res)=>{
    if(!req.params.studentId){
        return res.status(400).send({status:false,message:"Please Provide studentId in path params"})
    }
    if(!mongoose.Types.ObjectId.isValid(req.params.studentId)){
        return res.status(400).send({status:false,message:"given studentId is not a valid ObjectId, please provide valid objectId in params."})
    }
    let student=await studentModel.findOneAndUpdate({_id:req.params.studentId,userId:req.decodedtoken.userId,isDeleted:false},{isDeleted:true})

    if(!student){
        return res.status(404).send({ status: false, message:"No student found with this studentId with this current user." });
    }
    return res.status(200).send({ status: true, message:"Student is successfully Deleted" });
}



module.exports={createStudent,getStudentById,getStudentByFilter,editStudent,deleteStudentById}