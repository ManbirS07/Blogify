const express=require("express")
const path=require("path")
const {connectToMongo}=require("./connection")
const userRoute=require("./routes/user")
const cookieParser=require("cookie-parser")
const {checkCookieandUser}=require("./middlewares/auth")

const app=express()
const port=8000
//to deal with form data we use a middleware
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkCookieandUser("token"))
connectToMongo("mongodb://127.0.0.1:27017/blogs")

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use("/user",userRoute)

app.get("/",(req,res)=>
{
    res.render("home")
})

app.listen(port,()=>console.log(`Server listening on port ${port}`))