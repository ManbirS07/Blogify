const express=require("express")
const multer=require("multer")
const path=require("path")
const router=express.Router()
const Blog=require("../models/blog")

//isse we are storing the coverFile user sent so as to add it's url to the database
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fileName=`${file.originalname}`
      cb(null,fileName)
    }
  })
  const upload = multer({ storage: storage })

router.get("/getblog",(req,res)=>
{
    console.log(req.user)
     res.render("addBlog",{
            user:req.user,
        }
    )
})
router.post("/addBlog",upload.single("coverImage"),async(req,res)=>
{
    const {title,coverImage,body}=req.body
    const blog=await Blog.create({
        title,
        body,
        coverImageUrl:`/uploads/${req.file.filename}`,//filename or destination??
        author: req.user.id,
    })
    console.log(blog);
    
    return res.redirect("/")
})
module.exports=router