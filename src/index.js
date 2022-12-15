const express=require("express")
const route=require("./routes/route.js")
const mongoose=require("mongoose")
const app=express()

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://Sushant_Bhaiswar_30:WBYUu1bCYmxmZUmg@cluster0.jui41on.mongodb.net/Gautam20-DB?retryWrites=true&w=majority",)
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(3000,()=> console.log('Express app running on port ' + ( 3000)))


