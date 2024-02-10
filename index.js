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

const dbURI = process.env.MONGO_CONNECTION_URL 
const SOCKET_Functions = require('./routes/iocontroller')

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

  socket.on('allList', () => {

    return SOCKET_Functions.eventList(socket,token)
  
  })

  socket.on('participatelist', (id) =>{
 
    return SOCKET_Functions.participateList(id,socket,token)

  })
 
})
    
