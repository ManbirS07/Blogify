const jwt=require("jsonwebtoken")
const secretKey="Manbir123"

function createTokenUser(user)
{
    const payload=
    {
        id:user._id,
        email:user.email,
        role:user.role,
        name:user.name,
    }
    const token=jwt.sign(payload,secretKey)
    return token
}

function validateToken(token)
{
    const payload=jwt.verify(token,secretKey)
    return payload  //returns decoded object that we stored in token
}

module.exports=
{
    createTokenUser,
    validateToken
}
