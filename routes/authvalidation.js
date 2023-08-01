const jwt = require ('jsonwebtoken')

    const authvalidation = {

    auth:(req,res,next)=>{

    const token= req.headers.authorization.split(' ')[1]

    if(token){
    
    try{
        const userVerified = jwt.verify(token,process.env.TOKEN_SECRET)
        req.user = userVerified
        
        next()

    }catch(error){
        res.status(401).send("Acesso Negado")
    }

      }
},

    adminverify:(req,res,next)=>{

    const token = req.headers.authorization.split(' ')[1]

    if(token){

    try{

        const userVerified = jwt.verify(token,process.env.TOKEN_SECRET) 
        req.user = userVerified
        if(!req.user.admin){
            res.status(401).send("Not admin")
        }else{
            next()
        }
        

    }catch(error){
        res.status(401).send(error)
      
    }

    }
        
    }

    
}
module.exports = authvalidation