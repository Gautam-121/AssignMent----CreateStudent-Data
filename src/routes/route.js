const express = require('express')
const router = express.Router()
const userContoller=require("../controllers/userController.js")
const studentContoller=require("../controllers/studentController.js")

const {authentication}=require("../middlewares/middle.js")



router.post("/register",userContoller.createUser)
router.post("/login",userContoller.loginUser)
router.post("/createStudent",authentication,studentContoller.createStudent)
router.get("/getStudent/:studentId",authentication,studentContoller.getStudentById)
router.get("/getStudent",authentication,studentContoller.getStudentByFilter)
router.put("/editStudent/:studentId",authentication,studentContoller.editStudent)
router.delete("/deleteStudent/:studentId",authentication,studentContoller.deleteStudentById)



router.all("/testme", (req, res) => 
{ console.log(req.params.productId)
    return res.status(400).send({ status: false, message: "Endpoint is not correct" }) })

module.exports = router;
