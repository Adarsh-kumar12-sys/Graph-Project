// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://127.0.0.1:27017/dijkstraDB', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

      

    mongoose.connect(process.env.MONGO_URI);


    
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app if DB fails
  }
};

module.exports = connectDB;
