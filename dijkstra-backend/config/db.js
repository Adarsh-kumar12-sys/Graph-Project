// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://127.0.0.1:27017/dijkstraDB', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    mongoose.connect('mongodb+srv://lovendrast0102:XgHXnJG9mLNhBwly@cluster0.uevt97m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
      

    // mongoose.connect(MONGO_URI);


    
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app if DB fails
  }
};

module.exports = connectDB;
