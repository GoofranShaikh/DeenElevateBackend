const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const secret=process.env.SECRET_KEY
const AuthenticateRequest =(req,res,next)=>{
    try{
    console.log(req.headers,'headers')
    let token =req?.headers?.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
    const decodedToken=jwt.verify(token,secret)
    console.log(decodedToken,'decodedToken')
    console.log( req.body.customer_id,' req.body.userId')
    if(decodedToken.userId == req.body.customerId){
        next()
    }
    else{
        return res.status(403).json({ error: 'Forbidden - Invalid tokens' });
    }

    }
    catch(e){
        console.error(e);
        return res.status(401).json({ error: 'Unauthorized - Invalid tokens' });
    }
}


module.exports={AuthenticateRequest}