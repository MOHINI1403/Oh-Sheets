const jwt=require('jsonwebtoken');

exports.authenticate=(req,resp,next)=>{
    const token=req.header('Authorization').replace('Bearer','');
    if(!token){
        return resp.status(401).json({msg:'No Token , authorization Denied'});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded.user;
        next();
    }
    catch(err){
        resp.send(401).json({msg:'Token is not Valid'});
    }
};