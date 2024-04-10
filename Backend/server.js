const express = require("express")
require("dotenv").config()
const connectDB = require("./config/db")
const apiRouter = require("./routes")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require('path');
const app = express()
connectDB()

app.use(express.json())
//app.use(cors())
app.use(cors({
    origin: process.env.FRONTEND_URL, // Allow requests from this specific origin
    credentials: true
}));
console.log(process.env.FRONTEND_URL);
// mongoose.connect('mongodb+srv://balusiva1299:Siva2312@cluster0.avjoegu.mongodb.net/UserLogin?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use("/api", apiRouter)
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 4000 || process.env.PORT

console.log(process.env.NODE_ENV);
app.get("/", (req, res) => {
    res.send("server was started")
})

app.listen(PORT, () => {
    console.log(`server is up and running on ${PORT} PORT`)
   
})