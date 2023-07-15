const mongoose = require('mongoose');
//setting Up mongoDB
mongoose.connect("mongodb://localhost:27017/LoginSignup")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
   console.log("Failed to connect to Database"); 
});

const LogInSchema = new mongoose.Schema({
    name: {type:String,
    require:true},

    password: {
        type : String , require: true
    }


})

const collection = new mongoose.model("Collection_01",LogInSchema)
module.exports=collection;
