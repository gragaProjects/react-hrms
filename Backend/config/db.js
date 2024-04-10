const mongoose = require("mongoose")

const url = process.env.MONGODB_URL
mongoose.set("strictQuery", false)

// const connectDB = async () => {
//     try {
//         console.log(url);
//         const connectDB = await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//         console.log(`MONGODB is connected ${connectDB.connection.host}`)
//         console.log(url);
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err);
//     }
// }


const connectDB = () => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        
        console.log(`Mongoose connected to MongoDB: ${mongoose.connection.host}, database name: ${mongoose.connection.name}`);


        
    }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });
};



module.exports = connectDB