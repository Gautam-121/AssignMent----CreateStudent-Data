const valditor=require("../validators/validator.js")
const userModel=require("../models/userModel.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const createUser=async function (req,res) {
    try{
    if(req.body.userName==undefined){
        return res.status(400).send({status:false,message:"Please Provide userName in Body"})
    }
    if(req.body.password==undefined){
        return res.status(400).send({status:false,message:"Please Provide password in Body"})
    }

    if(!valditor.isValidUserName(req.body.userName)){
        return res.status(400).send({status:false,message:"Please Provide valid userName in the body, unerName must be of String with no Special charecters and numbers in the userName."})
    }

    if(!valditor.isValidPassword(req.body.password)){
        return res.status(400).send({status:false,message:"Please Provide valid password in the body,password must be of String whose minimum length must be of 8 charecters,with at least one Special charecters ,one numbers,one uppercase letter and one lowercase letter."})
    }

    const hash = bcrypt.hashSync(req.body.password, 10)
    req.body.password=hash

    let unique=await userModel.findOne({userName:req.body.userName})
    if(unique){
        return res.status(400).send({status:false,message:"User already exist , please provide unique userName"})
    }

    let savedData=await userModel.create(req.body)
    return res.status(201).send({status:true,message:"You are successfully registered.",data:savedData})
    }
    catch (error) {
        return res.status(500).send({ status: false, err: error.message });
    }
}

const loginUser=async function(req,res){
    try{
    if(req.body.userName==undefined){
        return res.status(400).send({status:false,message:"Please Provide userName in Body"})
    }
    if(req.body.password==undefined){
        return res.status(400).send({status:false,message:"Please Provide password in Body"})
    }

    if(!valditor.isValidUserName(req.body.userName)){
        return res.status(400).send({status:false,message:"Please Provide valid userName in the form of String with no Special charecters and numbers in the userName."})
    }
    if(!valditor.isValidPassword(req.body.password)){
        return res.status(400).send({status:false,message:"Please Provide valid password in the form of String whose minimum length must be of 8 charecters,with at least one Special charecters ,one numbers,one uppercase letter and one lowercase letter."})
    }
    let user=await userModel.findOne({userName:req.body.userName})
    if(!user){
        return res.status(404).send({status:false,message:"User does not exist , please register first"})
    }

    if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.status(400).send({status:false,message:"Password is not correct."})
    }
    
    let token = jwt.sign(
      {
        userId: user._id,
        userName:user.userName
      },"MynameisRSD"
    )
    
    return res.status(200).send({ status: true, message: "Success", token: token })
}
    catch (error) {
    return res.status(500).send({ status: false, err: error.message });
    }
}




module.exports={createUser,loginUser}