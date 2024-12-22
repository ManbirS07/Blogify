const express=require("express")
const path=require("path")
const {connectToMongo}=require("./connection")
const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")
const cookieParser=require("cookie-parser")
const {checkCookieandUser}=require("./middlewares/auth")

const Blog=require("./models/blog")

const app=express()
const port=8000
//to deal with form data we use a middleware
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkCookieandUser("token"))
app.use(express.static(path.resolve("./public"))) //serve whatever is inside public folder as static files rather than routes(i.e seedha images do jo h in public folder)
connectToMongo("mongodb://127.0.0.1:27017/blogs")

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use("/user",userRoute)
app.use("/blog",blogRoute)
app.get("/",async(req,res)=>
{
    const userID=req.body.author
    const allBlogs=await Blog.find({userID})
    res.render("home",
    {
        user:req.user,
        blogs:allBlogs
    })
})
app.listen(port,()=>console.log(`Server listening on port ${port}`))