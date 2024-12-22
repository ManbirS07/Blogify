const {validateToken}=require("../services/auth")

function checkCookieandUser(cookieName)
{
    return(req,res,next)=>
    {
        const tokenValue=req.cookies[cookieName]
        try{
            const user=validateToken(tokenValue)
            req.user=user
            return next()
        }
        catch(err)
        {
            console.log(err);
        }
        next()
    }
}

module.exports={
    checkCookieandUser
}