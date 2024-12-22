const mongoose=require("mongoose")

const blogSchema=({
    title:
    {
        type:String,
        required:true,
    },
    body:
    {
        type:String,
        required:true,
    },
    coverImageUrl:
    {
        type:String,
    },
    author:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})