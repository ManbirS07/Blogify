const express=require("express")
const User=require("../models/user")
const router=express.Router()

const {validateToken}=require("../services/auth")
const {checkCookieandUser}=require("../middlewares/auth")

router.get("/login",(req,res)=>
{
    res.render("login")
})
router.get("/signup",(req,res)=>
{
    res.render("signup")
})
router.post("/signup",async(req,res)=>
{
    const {name,email,password}=req.body
    const result=await User.create(
        {
            name:name,
            email:email,
            password:password,
        }
    )
    return res.render("home")
})
router.post("/login",async(req,res)=>
{
    const {email,password}=req.body

    try{
    const token= await User.matchPass(email,password)
    console.log(token);
    const user=req.user
    console.log(user)
    // console.log(token.name);
    //now that token is generated without error,it means user has logged in and now we store the token in a cookie
    return res.cookie("token",token).render("home",{
        id:token,
        name:user.name,
        user:user,
    })
    }catch(err)
    {
        return res.render("login",{
            error:err,
        })    
    }
})

router.get("/logout",async(req,res)=>
{
    //to logout we simple delete the session cookie
    res.clearCookie("token").redirect("/")
})

module.exports = router;