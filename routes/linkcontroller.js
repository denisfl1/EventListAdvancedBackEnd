const { default: mongoose } = require('mongoose')
const schemas = require ('./schemas')
const bcrypt = require('bcryptjs')
const LoginUser = mongoose.model('LoginUser',schemas.linkSchema)
const Event = mongoose.model('Event',schemas.linkSchema1)
const TokenGen = mongoose.model('TokenGen',schemas.linkSchema3)
const jwt = require('jsonwebtoken');


const userController = {

    register: async (req,res)=>{


    try{
        const id = req.body.authtoken
        const TOKEN = await TokenGen.findById({_id:id})
        const searchNumber = await LoginUser.findOne({number:req.body.number})
        
        if(!TOKEN || TOKEN._id != id){
        return  res.status(400).send("Token Inválido")
        }      
        if(searchNumber){
        return res.status(400).send("Número já existe")
        }
        else{  
        const register = new LoginUser
        ({  name:req.body.name,
            number:req.body.number,
            password:bcrypt.hashSync(req.body.password)
        })
        
        const doc = await register.save()
        const token = jwt.sign({id:doc._id,name:doc.name,admin:doc.admin},process.env.TOKEN_SECRET,{expiresIn:43200})
        res.status(200).send({id:doc._id,name:doc.name,admin:doc.admin,number:doc.number,password:doc.password,token:token})
        await TokenGen.findByIdAndDelete(id)
        
        } 
        
    }catch(error){
        res.status(404).send(error)
        
    }

    },

    login: async(req,res)=>{

   

    try {
        const searchNumber = await LoginUser.findOne({number:req.body.number})


        if(!searchNumber) {

        return res.status(400).send("Number or password incorrect")

        }
        const checkUser = bcrypt.compareSync(req.body.password,searchNumber.password)
        if(!checkUser)  
        return res.status(400).send("Number or password incorrect")
    
        const token = jwt.sign({id:searchNumber._id,name:searchNumber.name,admin:searchNumber.admin},process.env.TOKEN_SECRET,{expiresIn:43200})
      
        res.status(200).send({id:searchNumber._id,name:searchNumber.name,admin:searchNumber.admin,number:searchNumber.number,token:token})


    } catch (error) {
        res.status(404).send(error)
        
    }
   


    },

    event: async(req,res)=>{

    try{
        const event = new Event

        ({  date:req.body.formattedDate,
            time:req.body.time,
            extratime:req.body.extratime
        })

        let doc1 = await event.save()
        res.status(200).send(doc1)
    
    }catch(error){
        res.status(404).send(error)
        console.log(error)
    }

    },

    allList: async(req,res)=>{

    try{
        const list =  await  Event.find({});
        res.status(200).send(list)
    } catch(error){
        res.status(404).send(error)
    }
       


    },

    deleteList: async (req,res)=>{

    try{
        let id = req.params.id

        await Event.findByIdAndDelete(id)
        res.status(200).send(id)
    }catch(error){
        res.status(404).send(error)
    }


    },

    getEditId: async(req,res)=>{

       try{
        const id = req.params.id

        if(req.user.admin){
        const list = await Event.findById(id)
        res.status(200).send(list)
        }
       }catch(error){
        res.status(404).send(error)
       }

    },

    editlist: async (req,res)=>{

       
        try{
            const list = {}
            const id = req.body.id
    
            list.date = req.body.formatteddate
            list.time = req.body.time
            list.extratime = req.body.extratime
    

            let item = await Event.findByIdAndUpdate(id,list)
            res.status(200).send(item)
        
        }catch (error){
            console.log(error)
            res.status(404).send(error)
        }

    },

    editlockbutton: async(req,res)=>{


        try{
            const lockbtn = req.body.checklist
            const id = req.body.id
            const item = await Event.updateOne({_id:id},{$set:{lockbtn:lockbtn}})
            res.status(200).send(item)
           
            
        }catch(error){
            res.status(400).send(error)
            console.log(error)
            
        }

    },

    addNameandFill: async (req, res) => {
          

          try {
            const id = req.body.id
            const names = req.body.names.split()
            const fills = req.body.fills.split()
            const myID = req.user.id.split()
            const items = await Event.findById(id)
            const verify = items.myID.includes(myID[0])
            const username = await LoginUser.findById(myID[0])
            
            if (!items.lockbtn && !req.user.admin || verify && !req.user.admin ||username.name !== names[0] && !req.user.admin){
              res.status(403).send("Access Denied");
              console.log("Access Denied");
             
            }
            else{
            
              const updatedItems = await Event.updateOne(
                { _id: id },
                { $push: { names: { $each: names }, fills: { $each: fills }, myID: { $each: myID } } }
              );
      
              res.status(200).send(updatedItems);
              
            }

           
          } catch (error) {
            console.log(error);
           res.status(404).send(error);
          }
    },


    addUser: async (req,res)=>{


        try {
            const id = req.user.id
            const getuser = await LoginUser.findById(id)

            if(id == getuser.id){
                const items = {}
                items.id =getuser.id
                items.name = getuser.name
                items.admin = getuser.admin
                res.status(200).send(items)
            }else{
                res.status(403).send("Not found")
            }
                
           
        } catch (error) {
            console.log(error)
            res.status(404).send(error)
        }


    },

    getUser:async(req,res)=>{

        try {

            const id = req.params.id
            const items = await LoginUser.findById({_id:id})  
            res.status(200).send({id:items._id,name:items.name,number:items.number,admin:items.admin})
    
        
        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }


    },

    getUser1:async(req,res)=>{

        try {

            const id = req.user.id
            const items = await LoginUser.findById({_id:id})
            
            if(!items){
                res.status(401).send("Acess Denied")
            return
            }

            const token = jwt.sign({id:items._id,name:items.name,number:items.number,admin:items.admin},process.env.TOKEN_SECRET,{expiresIn:43200})
            res.status(200).send({id:items._id,name:items.name,number:items.number,admin:items.admin,token:token})
         
           
        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }


    },

    getusers: async(req,res)=>{

       try {
       
        const users = await LoginUser.find({})
        if(users){
            res.status(200).send(users)
        return
        }
        res.status(404).send("Nenhum usuário encontrado")

       } catch (error) {
            res.status(404).send(error)
       }  

    },

    getNamesandFills: async (req,res)=>{

        try {
            const id = req.params.id
            const items = await Event.findById(id)
            res.status(200).send(items)
        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }
       

    },

    editUser: async(req,res)=>{

        try {
          
            const id = req.body.id
            const name = req.body.name
            const number = req.body.number
            const admin = req.body.admin

            const items = {}
            items.name = name
            items.number = number
            items.admin = admin

            const usernumber = await LoginUser.findById(id)
            const searchNumber = await LoginUser.find({})
            const filtering = searchNumber.filter((numbers)=>numbers.number != usernumber.number).map((items)=>items.number).includes(number)
            

            if(filtering){
             return   res.status(404).send("Número já existe")
            }

            await LoginUser.findByIdAndUpdate(id,items)
            res.status(200).send("Update Successfull")
              
          
        } catch (error) {
    
            res.status(404).send(error)
            console.log(error)
        }
       

    },


    editUser1: async(req,res)=>{

        try {
          
            const id = req.user.id
            const name = req.body.name
            const number = req.body.number
            const password = req.body.password1 && bcrypt.hashSync(req.body.password1)
            const searchNumber = await LoginUser.find({})

            const filtering = searchNumber.filter((numbers)=>numbers.number != req.user.number).map((value)=>value.number).includes(number)
           
            if(filtering){
                return res.status(404).send('Número já existe')
            }
            
            const items = {}

            items.name = name
            items.number = number
            items.password = password
               
       
            if(req.user.admin){
            await LoginUser.findByIdAndUpdate(id,items)
            res.status(200).send("Update Successfull")
            }
            else{
            await LoginUser.findByIdAndUpdate(id,{password:password})   
            res.status(200).send("Update Successfull")
            }
   
       
          
        } catch (error) {
            console.log(error)
            res.status(404).send(error)
        }
       



    },

    delNamesAndFills: async (req,res)=>{

        
        try {
            
        const id = req.params.id
        const position = req.body.position
        const items = await Event.findOne({_id:id})
         
        if(!items){
            return res.status(404).send("Documento não encontrado")
        }if(req.user.id == items.myID[position] && items.lockbtn || req.user.admin){

            const names = items.names
            const fills = items.fills
            const myID = items.myID
 
            names.splice(position,1)
            fills.splice(position,1)
            myID.splice(position,1)
            
            
           await items.save()

            res.status(200).send("Apagado com sucesso")
            
  
        }else{
            res.status(403).send("Acess Denied")
        }      
            
        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }

    },

    getNamesandFillstoEdit: async (req,res)=>{

       

        try {
            const id = req.params.id
            const position = req.params.position
            const verify = req.user.id
            const admin = req.user.admin


          const items = await Event.findOne({_id:id})

          if(!items){
            return res.status(404).send("Item não encontrado")
          }
          if(items.myID[position] == verify || admin){

          const names = items.names[position]
          const fills = items.fills[position]

          res.status(200).send({names,fills})
        }else{
            res.status(403).send("Não autorizado")
        }  

        } catch (error) {
            res.status(404).send(error)
            console.log(error)
        }

    },

    updateNamesAndFills: async (req,res)=>{

   

    try {
        const id = req.body.id
        const position = req.body.position
        const names = req.body.names
        const fills = req.body.fills1
        const admin = req.user.admin
        const verify = req.user.id

        const items = await Event.findOne({_id:id})
        const username = await LoginUser.findById(verify)

        if(!items){
            res.status(404).send("Item não encontrado")
        }
        if(username.name != names && !admin || !items.lockbtn && !admin){
            res.status(404).send("Acess Denied")
        }
        else if(items.myID[position] == verify || admin ){

        items.names.splice(position,1,names)
        items.fills.splice(position,1,fills)

        await items.save()

        res.status(200).send("Atualizado com Sucesso")

        }else{
            res.status(403).send("Acess Denied")
        }
        } catch (error) {
            res.status(400).send(error)
            console.log(error)
        }



    },

    delUsers:async(req,res)=>{
       
        try{
        const array  = req.params.array.split(",")
        const items = await LoginUser.deleteMany({_id:{$in:array}}) 

        res.status(200).send(items)
            }catch(error){
                res.status(403).send(items)
                console.log(error)
            }


    },


    generatetoken:async(req,res)=>{
          
        try {  
        const gentoken = Math.random().toString(36).substring(2,9)
        const newtoken = new TokenGen({_id:gentoken})  
        const savetoken = await newtoken.save()

        res.status(200).send(savetoken)    
        } catch (error) {
        res.status(404).send(error)
            
        }



    }


   


}

module.exports = userController