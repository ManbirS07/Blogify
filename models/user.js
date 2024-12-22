const mongoose=require("mongoose")
const {createHmac,randomBytes}=require("crypto")
const {createTokenUser}=require("../services/auth")
const userSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
    },
    email:
    {
        type:String,
        unique:true,
        required:true,
    },
    password:
    {
        type:String,
        required:true,
    },
    salt:
    {
        type:String,
    },
    role:
    {
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    }
})

//Before saving any user
userSchema.pre("save",function(next)
{
    const user=this //this used for the current object
// salt is a piece of random data(a secret key) added to a password before it is hashed and stored
    const salt=randomBytes(10).toString()
    //now we will create hash of password (sha256 is the name of algorithm)
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex")
    
    this.salt=salt
    this.password=hashedPassword
    next()
})

//creating a virtual function for the schema
//yaha pe we are implementing login logic

//schema.static allows us to define static class methods (matchPass here) for models using schema objects
userSchema.static("matchPass",async function(email,password)
{
    const user=await this.findOne({email})
    if(!user) 
        {
            throw new Error("User not found !!")
        }
    const salt=user.salt
    const pass=user.password //hashed pass in db

    //isme we put the password as received jo user ne dala h
    const userPassword=createHmac("sha256",salt).update(password).digest("hex")

    //ab dono ko coombine karke check whether this equals hashed pass in db
    if(pass!==userPassword ) throw new Error("Incorrect Password !!")
    //else return the user
    
    //token is created after user successfully logs in
    const token=createTokenUser(user)
    return token
})

const User= mongoose.model("user",userSchema)

module.exports= User;