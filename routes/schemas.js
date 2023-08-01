const mongoose = require ('mongoose')


const schemas = {


    linkSchema : new mongoose.Schema({

        name: {type:String, required:true},
        number:{type:String, required:true},
        password:{type:String, required:true},
        admin:{type:Boolean, default:false},
        createdAt:{type:Date, default:Date.now}
       
       
       }),



    linkSchema1 : new mongoose.Schema({
   
        date:{type:String},
        time:{type:String},
        extratime:{type:String,default: " - "},
        createdAt:{type:Date, default:Date.now},
        names:[{type:String, default: " "}],
        fills:[{type:String, default: " - " }],
        myID:[{type:String, default: " "}],
        lockbtn:{type:Boolean, default:false}
       
    
    }),


    linkSchema3 : new mongoose.Schema({

        _id:{type:String},
        createdAt:{type:Date,default:Date.now}

    }).index('createdAt', { expireAfterSeconds: 180 ,unique:true})

}




module.exports = schemas



