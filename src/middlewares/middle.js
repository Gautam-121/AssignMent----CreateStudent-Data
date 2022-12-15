const jwt=require("jsonwebtoken")

const authentication=async (req,res,next)=>{
    try{
    if(!req.headers["x-api-key"]){
        return res.status(401).send({ status: false, msg: "token is required" });
    }
    jwt.verify(req.headers["x-api-key"], "MynameisRSD", (error, decodedtoken) => {
        if (error) {
            const msg = error.message === "jwt expired"? "Token is expired": "Token is invalid";
            return res.status(401).send({ status: false, message:msg });
        }
        else {
            req.decodedtoken = decodedtoken;
            next();
        }
    });
    }
    catch(error){
        return res.status(500).send({ status: false, err: error.message });
    }

}

module.exports = { authentication }