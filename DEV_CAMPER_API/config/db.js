const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

const connectDB =  async ()=>{
    try{
        const conn = await mongoose.connect( URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log(`mongo database is connected: ${conn.connection.host} `)
    }catch(error){
        console.error(`Error: ${error} `)
        process.exit(1)
    }
}

module.exports = connectDB;