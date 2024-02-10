const { default: mongoose } = require('mongoose')
const schemas = require ('./schemas')
const Event = mongoose.model('Event',schemas.linkSchema1)
const jwt = require('jsonwebtoken');

const SOCKET_Functions ={

    eventList:async(socket,token)=>{
 
     try { 
    
       const userVerified = jwt.verify(token,process.env.TOKEN_SECRET)
       if(userVerified){
       let list = await  Event.find({});
       socket.emit('initialList', list);
      
       }
     } catch (error) {

       socket.emit('initialListError', error.message);
       console.log(error)
   
     }
 
 
 
   },
 
    participateList:async(id,socket,token)=>{
       
        try {

            const userVerified = jwt.verify(token,process.env.TOKEN_SECRET)
            if(userVerified){
            const items = await Event.findById(id)
            socket.emit('participate',items)

            }
        } catch (error) {

            socket.emit('participateerror',error.message)
            console.log(error)

        } 
        
        }


    }


 module.exports = SOCKET_Functions 