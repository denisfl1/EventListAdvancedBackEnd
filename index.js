require ('dotenv').config();
const express = require ('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
require ('dotenv').config()
const cors = require('cors')
const router = require ('./routes/linkRoute')
const path = require('path')
const jwt = require ('jsonwebtoken')


const schemas = require ('./routes/schemas')
const Event = mongoose.model('Event',schemas.linkSchema1)
const dbURI = process.env.MONGO_CONNECTION_URL 

let db = mongoose.connection

mongoose.connect(dbURI,{
    useNewUrlParser:true, 
    useUnifiedTopology:true

})


db.on("error", ()=>{console.log("houve um erro")})
db.once("open", ()=>{
    
    console.log("Banco carregado")



})
app.use(cors())
   

app.use('/',router)


const server = app.listen(port,()=>{

console.log("Running on port",port)


})


const io = require('socket.io')(server,{cors:{origin:'*'}})


io.use(async(socket,next)=>{
  
  const token =  socket.handshake.headers.authorization
    
  socket.on('disconnect',()=>{

  console.log("O Usuário Desconectou", socket.id)

  })
  
  try {
  const userVerified = jwt.verify(token,process.env.TOKEN_SECRET)
  if(userVerified){
    next()
  }
  }catch (error) {         
    console.log("Acesso Negado do SocketIO")
            
  }

  })



io.on('connection',(socket)=>{
const token =  socket.handshake.headers.authorization
console.log("Usuário Connectado", socket.id)


socket.on('allList',async () => {


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
  
  });


socket.on('participatelist',async (id) =>{
 

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

})



})
 

    
 
