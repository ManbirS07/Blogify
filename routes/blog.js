const express=require("express")
const multer=require("multer")
const path=require("path")
const router=express.Router()
const Blog=require("../models/blog")
const User=require("../models/user")
const Comment=require("../models/comments")

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
     res.render("addBlog",{
            user:req.user,
            flag:true,
        }
    )
})

router.get("/:id",async(req,res)=>
{
  const blog=await Blog.findById(req.params.id)
  const comments=await Comment.find({blogId:req.params.id})
  
  const authId=blog.author
  const userr=await User.findById(authId)
  return res.render("blog",{
    blog,
    user:req.user, //so that the user stays signed-in
    userr,
    comments,
    flag:true,
  })
})
router.post("/addBlog",upload.single("coverImage"),async(req,res)=>
{
    const {title,body}=req.body
    const blog=await Blog.create({
        title,
        body,
        coverImageUrl:`/uploads/${req.file.filename}`,//filename or destination??
        author: req.user.id,
    })
    return res.redirect("/")
})
module.exports=router


router.post("/comment/:blogId",async(req,res)=>
{
  const comment=await Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user.id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})


