const mongoose=require("mongoose")

async function connectToMongo(url)
{
    return mongoose.connect(url)
    .then(console.log('MongoDb connected'))
}

module.exports={
    connectToMongo
}